import { TRPCError } from "@trpc/server";
import type { Context } from "./context.js";

export const requireUser = (ctx: Context) => {
	if (!ctx.info.user) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "User not authenticated",
		});
	}

	return ctx.info.user;
};
