// Redis key schemas and helper functions

import Sqids from "sqids";
import redis from "./redis.js";

const sqids = new Sqids({ minLength: 6 });

type RedisEvent = {
	channel: string;
	message: string;
};

type Redis = typeof redis;
type IteratorOptions = {
	signal?: AbortSignal;
};

// Create an async iterator for a Redis subscriber
export const createSubscriberIterator = async (
	subscriber: Redis,
	option: IteratorOptions,
) => {
	const queue: RedisEvent[] = [];
	let resolver: Function | null = null;
	let isAborted = false;

	option.signal?.addEventListener("abort", () => {
		isAborted = true;
		if (resolver) {
			resolver();
			resolver = null;
		}
	});

	subscriber.on("message", (channel, message) => {
		queue.push({ channel, message });
		if (resolver) {
			resolver();
			resolver = null;
		}
	});

	return {
		async *[Symbol.asyncIterator]() {
			while (true) {
				if (queue.length === 0)
					await new Promise((resolve) => (resolver = resolve));

				if (isAborted) break;

				yield queue.shift() as RedisEvent;
			}
		},
	};
};

// Key patterns
export const TOTAL_ROOMS_KEY = "total_rooms";
export const ROOM_KEY = (code: string) => `room:${code}`;
export const ROOM_CONNECTION_KEY = (code: string, id: string) =>
	`room:${code}user:${id}:connections`;
export const ROOM_GUESSES_KEY = (code: string) => `room:${code}:guesses`;
export const ROOM_SETTINGS_KEY = (code: string) => `room:${code}:settings`;
export const ROOM_USERS_KEY = (code: string) => `room:${code}:users`;
export const USER_KEY = (id: string) => `user:${id}`;

// Channels
export const ROOM_CONNECTION_CHANNEL = (code: string) =>
	`room:${code}:connections`;
export const ROOM_GUESSES_CHANNEL = (code: string) => `room:${code}:guesses`;

export type User = {
	username: string;
};

export const createUser = async (id: string, user: User) => {
	await redis.hset(USER_KEY(id), user);
	return id;
};

// Getting a user
export const getUser = async (id: string) => {
	const user = await redis.hgetall(USER_KEY(id));
	return user as User;
};

// Creating a user
export const createRoom = async () => {
	const roomId = await redis.incr(TOTAL_ROOMS_KEY);
	const roomCode = sqids.encode([roomId]);
	await redis.hset(ROOM_KEY(roomCode), { createdAt: Date.now() });
	return roomCode;
};

type JoinRoomArgs = {
	roomCode: string;
	userId: string;
};

// Joining a room
export const joinRoom = async ({ roomCode, userId }: JoinRoomArgs) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists) throw new Error("Room not found");

	await redis.incr(ROOM_CONNECTION_KEY(roomCode, userId));
	await redis.hset(ROOM_USERS_KEY(roomCode), {
		[userId]: {
			role: "host",
		},
	});
};

type LeaveRoomArgs = {
	roomCode: string;
	userId: string;
};

// Leaving a room
export const leaveRoom = async ({ roomCode, userId }: LeaveRoomArgs) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists) throw new Error("Room not found");

	console.log("attempting to leave", userId);

	const connections = await redis.decr(ROOM_CONNECTION_KEY(roomCode, userId));
	if (connections > 0) return false;

	await redis.hdel(ROOM_USERS_KEY(roomCode), userId);

	// Check if room is empty
	const userCount = await redis.hlen(ROOM_USERS_KEY(roomCode));

	if (userCount === 0) {
		await redis.del(ROOM_KEY(roomCode));
		await redis.del(ROOM_SETTINGS_KEY(roomCode));
		await redis.del(ROOM_USERS_KEY(roomCode));
	}

	return true;
};

// Getting all users in a room
export const getRoomUsers = async (roomCode: string) => {
	const userIds = await redis.hgetall(ROOM_USERS_KEY(roomCode));
	const users = await Promise.all(
		Object.keys(userIds).map(async (id) => {
			const fields = await getUser(id);
			return {
				id,
				...fields,
			};
		}),
	);
	return users;
};

type GuessCountryArgs = {
	roomCode: string;
	userId: string;
	guess: string;
};

export const guessCountry = async ({
	roomCode,
	userId,
	guess,
}: GuessCountryArgs) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists) throw new Error("Room not found");

	await redis.rpush(
		ROOM_GUESSES_KEY(userId),
		JSON.stringify({
			userId,
			guess,
			timestamp: Date.now(),
		}),
	);
};

/** PUBLISHERS **/

// Publish guessed country to a room
export const publishGuessedCountry = async (
	roomCode: string,
	event: "guess",
	data: any,
) => {
	await redis.publish(
		ROOM_GUESSES_CHANNEL(roomCode),
		JSON.stringify({ event, ...data }),
	);
};

// Publish updates to a room
export const publishRoomUpdate = async (
	roomCode: string,
	event: "join" | "leave",
	data: any,
) => {
	await redis.publish(
		ROOM_CONNECTION_CHANNEL(roomCode),
		JSON.stringify({ event, ...data }),
	);
};
