"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCClient, createWSClient, wsLink } from "@trpc/client"
import type { AppRouter } from "../../backend/src/router/index.js"
import { trpc } from "./lib/trpc"

const wsClient = createWSClient({
  url: `ws://localhost:5003`,
})

const queryClient = new QueryClient()

const client = createTRPCClient<AppRouter>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
})

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
