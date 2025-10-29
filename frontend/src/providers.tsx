"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "./lib/trpc"
import { client, queryClient } from "./trpc"

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
