import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import z from "zod";
import { userRepository } from "../utils/redis/models/index.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(z.object({ username: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const payload = {
			sessionId: uuid(),
		};

		const token = jwt.sign(payload, process.env.COOKIE_SESSION_SECRET!);
		ctx.log.info({ token }, "Signed payload");

ctx.res.setCookie("auth", token, {
			httpOnly: true,
			secure: process.env.APP_ENVIRONMENT === "production",
			sameSite: process.env.APP_ENVIRONMENT === "production" ? "none" : "lax",
			path: "/",
		});

		ctx.log.info({ payload, input }, "Payload");

		await userRepository.save({
			id: payload.sessionId,
			username: input.username,
		});

		return {};
	});
