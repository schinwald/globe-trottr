import { QueryClient } from "@tanstack/react-query"
import {
  createTRPCClient,
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  wsLink,
} from "@trpc/client"
import superjson from "superjson"
import type { AppRouter } from "../../backend/src/router/index.js"

const wsClient = createWSClient({
  url: `ws://${process.env.NEXT_PUBLIC_ORIGIN}:5003`,
})

export const queryClient = new QueryClient()

export const client = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => op.type === "subscription",
      true: wsLink({ client: wsClient, transformer: superjson }),
      false: httpBatchLink({ url: "/api", transformer: superjson }),
    }),
  ],
})

export const server = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({ url: `http://localhost:5000/api`, transformer: superjson }),
  ],
})
