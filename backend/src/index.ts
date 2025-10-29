import cookie from "@fastify/cookie";
import websocket from "@fastify/websocket";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import Fastify from "fastify";
import { WebSocketServer } from "ws";
import { appRouter } from "./router/index.js";
import { createHTTPContext, createWSContext } from "./utils/context.js";
import { createRedis } from "./utils/redis.js";

const fastify = Fastify({
	logger: true,
});

createRedis(fastify);

fastify.register(cookie, {
	secret: process.env.COOKIE_SESSION_SECRET,
	parseOptions: {},
});

fastify.register(websocket);

fastify.register(fastifyTRPCPlugin, {
	prefix: "/api",
	trpcOptions: {
		router: appRouter,
		createContext: createHTTPContext(fastify),
	},
});

const wss = new WebSocketServer({ port: 5003 });

applyWSSHandler({
	wss,
	router: appRouter,
	createContext: createWSContext(fastify),
});

// Run the server!
try {
	await fastify.listen({ port: 5000 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
