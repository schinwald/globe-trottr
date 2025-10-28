import { initTRPC } from "@trpc/server";
import type { createContext } from "./context.js";

export const t = initTRPC.context<ReturnType<typeof createContext>>().create();
