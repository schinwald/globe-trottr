import type { FastifyInstance } from "fastify";
import { Redis } from "ioredis";

const redis = new Redis({
	host: process.env.REDIS_HOST || "localhost",
	port: parseInt(process.env.REDIS_PORT || "6379"),
	password: process.env.REDIS_PASSWORD,
});

export function createRedis(fastify: FastifyInstance) {
	redis.on("connect", () => {
		fastify.log.info("Redis connected");
	});

	redis.on("error", (error) => {
		fastify.log.error(`Redis error: ${error.message}`);
	});
}

export default redis;
