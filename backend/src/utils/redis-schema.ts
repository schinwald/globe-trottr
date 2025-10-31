// Redis key schemas and helper functions

import { TRPCError } from "@trpc/server";
import Sqids from "sqids";
import { validateGuess } from "./logic.js";
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
export const GAME_STATUSES_CHANNEL = (code: string) =>
	`room:${code}:game-states`;
export const USER_MESSAGES_CHANNEL = (code: string) =>
	`room:${code}:user-messages`;
export const ROOM_COUNTRY_STATUSES_CHANNEL = (code: string) =>
	`room:${code}:country-statuses`;

export type User = {
	username: string;
};

// Creating a user
export const createUser = async (id: string, user: User) => {
	await redis.hset(USER_KEY(id), user);
	return id;
};

// Getting a user
export const getUser = async (id: string) => {
	const exists = await redis.exists(USER_KEY(id));
	if (!exists)
		throw new TRPCError({ code: "NOT_FOUND", message: "Unable to find user" });

	const user = await redis.hgetall(USER_KEY(id));
	return user as User;
};

type Room = {
	createdAt: number;
};

// Creating a room
export const createRoom = async () => {
	const roomId = await redis.incr(TOTAL_ROOMS_KEY);
	const roomCode = sqids.encode([roomId]);
	await redis.hset(ROOM_KEY(roomCode), {
		createdAt: Date.now(),
	} satisfies Room);
	return roomCode;
};

// Gettings a room
export const getRoom = async (roomCode: string) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists)
		throw new TRPCError({ code: "NOT_FOUND", message: "Unable to find room" });

	const room = await redis.hgetall(ROOM_KEY(roomCode));
	return room as unknown as Room;
};

type Role = "host" | "guest";

type JoinRoomArgs = {
	roomCode: string;
	userId: string;
};

// Joining a room
export const joinRoom = async ({ roomCode, userId }: JoinRoomArgs) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists)
		throw new TRPCError({ code: "NOT_FOUND", message: "Unable to find room" });

	await redis.incr(ROOM_CONNECTION_KEY(roomCode, userId));
	const numberOfUsers = await redis.hlen(ROOM_USERS_KEY(roomCode));
	const role = (() => {
		if (numberOfUsers === 0) return "host";
		return "guest";
	})();

	await redis.hset(ROOM_USERS_KEY(roomCode), {
		[userId]: role,
	});
};

type LeaveRoomArgs = {
	roomCode: string;
	userId: string;
};

const SCRIPT_LEAVE_ROOM = `
-- KEYS[1] = room roles hash
-- ARGV[1] = user leaving

-- Get the user's role
local role = redis.call('HGET', KEYS[1], ARGV[1])

-- Delete the user from the room
redis.call('HDEL', KEYS[1], ARGV[1])

-- Check if the user is the host
if role == 'host' then
  local users = redis.call('HKEYS', KEYS[1])
  if #users > 0 then
    local new_host = users[1]
    redis.call('HSET', KEYS[1], new_host, 'host')
    return new_host
  end
end

return nil
`;

const deleteUserAndPromoteOther = redis.defineCommand(
	"deleteUserAndPromoteOther",
	{
		numberOfKeys: 1,
		lua: SCRIPT_LEAVE_ROOM,
	},
);

// Leaving a room
export const leaveRoom = async ({ roomCode, userId }: LeaveRoomArgs) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists)
		throw new TRPCError({ code: "NOT_FOUND", message: "Unable to find room" });

	const connections = await redis.decr(ROOM_CONNECTION_KEY(roomCode, userId));
	if (connections > 0) return false;

	await redis.deleteUserAndPromoteOther(ROOM_USERS_KEY(roomCode), userId);
	return true;
};

// Getting all users in a room
export const getRoomUsers = async (roomCode: string) => {
	const usersMapping = await redis.hgetall(ROOM_USERS_KEY(roomCode));
	const users = await Promise.all(
		Object.entries(usersMapping).map(async ([id, role]) => {
			const user = await getUser(id);
			return {
				id,
				role: role as Role,
				...user,
			};
		}),
	);
	return users;
};

type StartGameArgs = {
	roomCode: string;
};

// Starting a game
export const startGame = async (options: StartGameArgs) => {
	const startedAt = Date.now();

	await redis.hset(ROOM_KEY(options.roomCode), {
		startedAt,
	});

	await redis.del(ROOM_GUESSES_KEY(options.roomCode));

	return startedAt;
};

type GameStatus = {
	startedAt: number;
};

// Getting the game status
export const getGameStatus = async (roomCode: string) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists)
		throw new TRPCError({ code: "NOT_FOUND", message: "Unable to find room" });

	const data = await redis.hgetall(ROOM_KEY(roomCode));
	return data as unknown as GameStatus;
};

export type GuessedCountry = {
	userId: string;
	timestamp: number;
};

type GuessCountryArgs = {
	roomCode: string;
	userId: string;
	guess: string;
};

// Guessing a country
export const guessCountry = async ({
	roomCode,
	userId,
	guess,
}: GuessCountryArgs) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists)
		throw new TRPCError({ code: "NOT_FOUND", message: "Unable to find room" });

	const country = validateGuess(guess);
	if (!country) return null;

	await redis.hsetnx(
		ROOM_GUESSES_KEY(roomCode),
		country.iso,
		JSON.stringify({
			userId,
			timestamp: Date.now(),
		} satisfies GuessedCountry),
	);

	return country;
};

// Getting all guessed countries
export const getGuessedCountries = async (roomCode: string) => {
	const exists = await redis.exists(ROOM_KEY(roomCode));
	if (!exists)
		throw new TRPCError({ code: "NOT_FOUND", message: "Unable to find room" });

	const guessedCountriesMapping = await redis.hgetall(
		ROOM_GUESSES_KEY(roomCode),
	);
	return guessedCountriesMapping as unknown as Record<string, GuessedCountry>;
};

/** PUBLISHERS **/

// Publish country statuses to a room
export const publishGameStatus = async (
	roomCode: string,
	event: "started",
	data: any,
) => {
	await redis.publish(
		GAME_STATUSES_CHANNEL(roomCode),
		JSON.stringify({ event, ...data }),
	);
};

// Publish country statuses to a room
export const publishGameCountryStatus = async (
	roomCode: string,
	event: "country-statuses",
	data: any,
) => {
	await redis.publish(
		ROOM_COUNTRY_STATUSES_CHANNEL(roomCode),
		JSON.stringify({ event, ...data }),
	);
};

// Publish user messages to a room
export const publishUserMessage = async (
	roomCode: string,
	event: "message",
	data: any,
) => {
	await redis.publish(
		USER_MESSAGES_CHANNEL(roomCode),
		JSON.stringify({ event, ...data }),
	);
};

// Publish updates to a room
export const publishRoomConnection = async (
	roomCode: string,
	event: "join" | "leave",
	data: any,
) => {
	await redis.publish(
		ROOM_CONNECTION_CHANNEL(roomCode),
		JSON.stringify({ event, ...data }),
	);
};
