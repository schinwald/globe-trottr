import type { AnyRouter } from "@trpc/server";
import type { CreateWSSContextFn } from "@trpc/server/adapters/ws";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { getUser } from "./redis-schema.js";

export function createHTTPContext(fastify: FastifyInstance) {
	const log = fastify.log;

	return async ({ req, res }: { req: FastifyRequest; res: FastifyReply }) => {
		const token = req.cookies?.auth;
		log.info({ token }, "Auth cookie");

		let user = {};

		if (token) {
			try {
				const payload = jwt.verify(
					token,
					process.env.COOKIE_SESSION_SECRET,
				) as {
					sessionId: string;
				};
				log.info({ payload }, "JWT payload auth cookie");

				user = await getUser(payload.sessionId);
				log.info({ user }, "User");

				if (!user) {
					throw new Error("User not found");
				}
			} catch (error) {
				console.error(error);
				// Invalid token, ignore
			}
		}

		const info = {
			user,
		};

		return {
			log,
			res,
			req,
			info,
		};
	};
}

export function createWSContext<TRouter extends AnyRouter>(
	fastify: FastifyInstance,
): CreateWSSContextFn<TRouter> {
	return async (options) => {
		const log = fastify.log;
		const cookies = fastify.parseCookie(options.req.headers.cookie ?? "");
		const token = cookies.auth;
		log.info({ token }, "WS cookie");

		let user = {};

		if (token) {
			try {
				const payload = jwt.verify(
					token,
					process.env.COOKIE_SESSION_SECRET,
				) as {
					sessionId: string;
				};
				log.info({ payload }, "JWT payload auth cookie");

				user = await getUser(payload.sessionId);
				log.info({ user }, "User");

				if (!user) {
					throw new Error("User not found");
				}
			} catch (error) {
				console.error(error);
				// Invalid token, ignore
			}
		}

		const info = {
			user,
		};

		return {
			log,
			req: options.req,
			res: options.res,
			info,
		};
	};
}

export type Context = ReturnType<typeof createHTTPContext>;
