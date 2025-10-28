import type { AnyRouter } from "@trpc/server";
import type { CreateWSSContextFn } from "@trpc/server/adapters/ws";
import type { FastifyInstance } from "fastify";
import type { AppRouter } from "../router/index.js";

export function createContext<TRouter extends AnyRouter>(
	fastify: FastifyInstance,
): CreateWSSContextFn<TRouter> {
	return (options) => {
		console.log(options, options.info.connectionParams);
		return { log: fastify.log };
	};
}
