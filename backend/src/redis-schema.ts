// Redis key schemas and helper functions

import redis from "./redis.js";

// Key patterns
export const ROOM_KEY = (code: string) => `room:${code}`;
export const ROOM_USERS_KEY = (code: string) => `room:${code}:users`;
export const USER_KEY = (id: string) => `user:${id}`;
export const ROOM_UPDATES_CHANNEL = (code: string) => `room:${code}:updates`;

type RedisEvent = {
	channel: string;
	message: string;
};

export const createSubscriberIterator = async (subscriber: typeof redis) => {
	const queue: RedisEvent[] = [];
	let resolver: Function | null = null;

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
				yield queue.shift() as RedisEvent;
			}
		},
	};
};

// Room operations
export const createRoom = async (
	code: string,
	hostId: string,
	hostName: string,
) => {
	await redis.hset(ROOM_KEY(code), "code", code);
	await redis.sadd(ROOM_USERS_KEY(code), hostId);
	await redis.hset(USER_KEY(hostId), "name", hostName, "roomCode", code);
	return { roomCode: code, users: [hostName] };
};

export const joinRoom = async (
	roomCode: string,
	userId: string,
	username: string,
) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists) throw new Error("Room not found");

	const isMember = await redis.sismember(ROOM_USERS_KEY(roomCode), userId);
	if (isMember) throw new Error("User already in room");

	await redis.sadd(ROOM_USERS_KEY(roomCode), userId);
	await redis.hset(USER_KEY(userId), "name", username, "roomCode", roomCode);

	// Get all users in room
	const userIds = await redis.smembers(ROOM_USERS_KEY(roomCode));
	const users = await Promise.all(
		userIds.map(async (id) => await redis.hget(USER_KEY(id), "name")),
	);

	return { userId, users: users.filter(Boolean) };
};

export const leaveRoom = async (roomCode: string, userId: string) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists) throw new Error("Room not found");

	const isMember = await redis.sismember(ROOM_USERS_KEY(roomCode), userId);
	if (!isMember) throw new Error("User not in room");

	await redis.srem(ROOM_USERS_KEY(roomCode), userId);
	await redis.del(USER_KEY(userId));

	// Check if room is empty
	const userCount = await redis.scard(ROOM_USERS_KEY(roomCode));
	if (userCount === 0) {
		await redis.del(ROOM_KEY(roomCode));
		await redis.del(ROOM_USERS_KEY(roomCode));
	}

	// Get remaining users
	const userIds = await redis.smembers(ROOM_USERS_KEY(roomCode));
	const users = await Promise.all(
		userIds.map(async (id) => await redis.hget(USER_KEY(id), "name")),
	);

	return { users: users.filter(Boolean) };
};

export const getRoomUsers = async (roomCode: string) => {
	const userIds = await redis.smembers(ROOM_USERS_KEY(roomCode));
	const users = await Promise.all(
		userIds.map(async (id) => await redis.hget(USER_KEY(id), "name")),
	);
	return users.filter(Boolean);
};

export const publishRoomUpdate = async (
	roomCode: string,
	event: string,
	data: any,
) => {
	await redis.publish(
		ROOM_UPDATES_CHANNEL(roomCode),
		JSON.stringify({ event, ...data }),
	);
};
