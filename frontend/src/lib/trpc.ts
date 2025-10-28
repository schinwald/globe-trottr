import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "../../../backend/src/router/index"

export const trpc = createTRPCReact<AppRouter>()

