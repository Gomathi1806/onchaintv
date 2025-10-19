"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { config } from "./web3-config"
import { useState } from "react"
import { FarcasterProvider } from "./farcaster-context"

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 1000, // Data becomes stale after 10 seconds
            gcTime: 5 * 60 * 1000, // Cache for 5 minutes
            refetchOnWindowFocus: true, // Refetch when user returns to tab
            refetchOnMount: true, // Always refetch on component mount
          },
        },
      }),
  )

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FarcasterProvider>{children}</FarcasterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
