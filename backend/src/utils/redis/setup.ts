import type { FastifyInstance } from "fastify";
import { createClient } from "redis";

const redis = createClient({
	url: process.env.REDIS_URL || "redis://localhost:6379",
});

export async function createRedis(fastify: FastifyInstance) {
	await redis.connect();
	fastify.log.info("Redis connected");

	redis.on("error", (error) => {
		fastify.log.error(`Redis error: ${error.message}`);
	});
}

export default redis;
export type Redis = typeof redis;
