import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Repository, Schema } from "redis-om";
import redis, { type Redis } from "../../setup.js";
import type { RoomUser } from "./types.js";

const file = fileURLToPath(import.meta.url);
const directory = dirname(file);

const schema = new Schema<RoomUser>("room_users", {
	roomCode: { type: "string" },
	userId: { type: "string" },
	role: { type: "string" },
	connections: { type: "number" },
});

type PromoteArgs = {
	roomCode: string;
	userId: string;
};

type JoinRoomArgs = {
	roomCode: string;
	userId: string;
};

type LeaveRoomArgs = {
	roomCode: string;
	userId: string;
};

const roomUserKey = "room_users:index";

class RoomUsersRepository extends Repository<RoomUser> {
	constructor(schema: Schema<RoomUser>, redis: Redis) {
		super(schema, redis);
	}

	async promote(args: PromoteArgs) {
		const { roomCode, userId } = args;
		const script = readFileSync(`${directory}/scripts/promote.lua`);
		return await redis.eval(script.toString(), {
			keys: [roomUserKey],
			arguments: [roomCode, userId],
		});
	}

	async joinRoom(args: JoinRoomArgs) {
		const { roomCode, userId } = args;
		const script = readFileSync(`${directory}/scripts/join-room.lua`);
		return await redis.eval(script.toString(), {
			keys: [roomUserKey],
			arguments: [roomCode, userId],
		});
	}

	async leaveRoom(args: LeaveRoomArgs) {
		const { roomCode, userId } = args;
		const script = readFileSync(`${directory}/scripts/leave-room.lua`);
		return await redis.eval(script.toString(), {
			keys: [roomUserKey],
			arguments: [roomCode, userId],
		});
	}
}

export const roomUsersRepository = new RoomUsersRepository(schema, redis);

redis.on("connect", async () => {
	await roomUsersRepository.createIndex();
});
