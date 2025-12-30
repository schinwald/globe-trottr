import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { userRepository } from "./redis/models/index.js";

const getUserFromCookie = async (token?: string) => {
	if (!token) return undefined;

	const payload = jwt.verify(token, process.env.COOKIE_SESSION_SECRET!) as {
		sessionId: string;
	};

	const user = await userRepository
		.search()
		.where("id")
		.equals(payload.sessionId)
		.returnFirst();

	if (!user) {
		// TODO: remove cookie
	}

	return user;
};

export function createHTTPContext(fastify: FastifyInstance) {
	const log = fastify.log;

	return async ({ req, res }: { req: FastifyRequest; res: FastifyReply }) => {
		const cookies = req.cookies || {};
		const info = {
			user: await getUserFromCookie(cookies.auth),
		};

		return {
			log,
			res,
			req,
			info,
		};
	};
}

export function createWSContext(fastify: FastifyInstance) {
	const log = fastify.log;

	return async (options: CreateWSSContextFnOptions) => {
		const cookies = fastify.parseCookie(options.req.headers.cookie ?? "");

		const info = {
			user: await getUserFromCookie(cookies.auth),
		};

		return {
			log,
			req: options.req,
			res: options.res,
			info,
		};
	};
}

export type HTTPContext = Awaited<
	ReturnType<ReturnType<typeof createHTTPContext>>
>;
export type WSContext = Awaited<ReturnType<ReturnType<typeof createWSContext>>>;
export type Context = HTTPContext | WSContext;
