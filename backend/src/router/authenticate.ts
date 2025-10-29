import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import z from "zod";
import { createUser } from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(z.object({ username: z.string() }))
	.mutation(async ({ ctx, input }) => {
		const payload = {
			sessionId: uuid(),
		};

		const token = jwt.sign(payload, process.env.COOKIE_SESSION_SECRET);
		ctx.log.info({ token }, "Signed payload");

		ctx.res.setCookie("auth", token, {
			httpOnly: true,
			secure: process.env.APP_ENVIRONMENT === "production",
			sameSite: "strict",
			path: "/",
		});

		await createUser(payload.sessionId, {
			id: payload.sessionId,
			username: input.username,
		});

		return {};
	});
