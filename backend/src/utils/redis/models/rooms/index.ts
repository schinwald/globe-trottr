import { Repository, Schema } from "redis-om";
import Sqids from "sqids";
import redis, { type Redis } from "../../setup.js";
import type { Room } from "./types.js";

const sqids = new Sqids({ minLength: 6 });

const schema = new Schema("room", {
	roomCode: { type: "string" },
	createdAt: { type: "date" },
});

class RoomRepository extends Repository<Room> {
	constructor(schema: Schema<Room>, redis: Redis) {
		super(schema, redis);
	}

	async init() {
		const roomId = await redis.incr("total_rooms");
		const roomCode = sqids.encode([roomId]);

		return this.save({
			roomCode,
			createdAt: new Date(),
		});
	}
}

export const roomRepository = new RoomRepository(schema, redis);

redis.on("connect", async () => {
	await roomRepository.createIndex();
});
