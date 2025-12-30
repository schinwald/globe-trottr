import { initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import type { Context } from "./context.js";

export const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
});
