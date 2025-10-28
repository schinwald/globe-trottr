import websocket from "@fastify/websocket";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import Fastify from "fastify";
import { WebSocketServer } from "ws";
import { appRouter } from "./router/index.js";
import { createContext } from "./utils/context.js";
import { createRedis } from "./utils/redis.js";

const fastify = Fastify({
	logger: true,
});

createRedis(fastify);

fastify.register(websocket);

const wss = new WebSocketServer({ port: 5003 });

applyWSSHandler({
	wss,
	router: appRouter,
	createContext: createContext(fastify),
});

// Run the server!
try {
	await fastify.listen({ port: 5000 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
