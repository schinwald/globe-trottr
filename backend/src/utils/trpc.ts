import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import type { Context } from "./context.js";

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
});

export const router = t.router;

export const middleware = t.middleware(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		console.error(error);
		throw error;
	}
});

export const procedure = t.procedure.use(middleware);
