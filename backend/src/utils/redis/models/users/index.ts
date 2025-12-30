import { Repository, Schema } from "redis-om";
import redis, { type Redis } from "../../setup.js";
import type { User } from "./types.js";

export const schema = new Schema<User>("user", {
	id: { type: "string" },
	username: { type: "string" },
});

export class UserRepository extends Repository<User> {
	constructor(schema: Schema<User>, redis: Redis) {
		super(schema, redis);
	}
}

export const userRepository = new UserRepository(schema, redis);

redis.on("connect", async () => {
	await userRepository.createIndex();
});
