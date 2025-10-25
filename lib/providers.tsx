"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { config } from "./web3-config"
import { useState } from "react"
import { FarcasterProvider } from "./farcaster-context"

export function Web3Provider({ children }: { children: React.ReactNode }) {
  console.log("[v0] Web3Provider initializing...")

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            retry: 1,
            retryDelay: 1000,
          },
        },
      }),
  )

  console.log("[v0] Web3Provider initialized successfully")

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FarcasterProvider>{children}</FarcasterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
