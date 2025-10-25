"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
}

interface FarcasterContextType {
  isInFarcaster: boolean
  user: FarcasterUser | null
  sdk: any | null
  isReady: boolean
}

const FarcasterContext = createContext<FarcasterContextType>({
  isInFarcaster: false,
  user: null,
  sdk: null,
  isReady: false,
})

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isInFarcaster, setIsInFarcaster] = useState(false)
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [sdk, setSdk] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function initFarcaster() {
      console.log("[v0] FarcasterProvider initializing...")

      try {
        // Dynamically import Farcaster SDK
        const { default: farcasterSdk } = await import("@farcaster/miniapp-sdk")
        console.log("[v0] Farcaster SDK loaded")

        // Check if running in Farcaster mini app
        const inFarcaster = farcasterSdk.isInMiniApp()
        console.log("[v0] Is in Farcaster:", inFarcaster)
        setIsInFarcaster(inFarcaster)

        if (inFarcaster) {
          setSdk(farcasterSdk)

          // Get user context
          const context = await farcasterSdk.context
          if (context?.user) {
            console.log("[v0] Farcaster user:", context.user.username)
            setUser({
              fid: context.user.fid,
              username: context.user.username,
              displayName: context.user.displayName,
              pfpUrl: context.user.pfpUrl,
            })
          }

          // Signal that the app is ready
          await farcasterSdk.actions.ready()
          console.log("[v0] Farcaster ready signal sent")
        }

        setIsReady(true)
        console.log("[v0] FarcasterProvider ready")
      } catch (error) {
        console.error("[v0] Failed to initialize Farcaster SDK:", error)
        setIsReady(true)
        setIsInFarcaster(false)
      }
    }

    initFarcaster()
  }, [])

  if (!isReady) {
    return null
  }

  return <FarcasterContext.Provider value={{ isInFarcaster, user, sdk, isReady }}>{children}</FarcasterContext.Provider>
}

export function useFarcaster() {
  const context = useContext(FarcasterContext)
  if (!context) {
    throw new Error("useFarcaster must be used within FarcasterProvider")
  }
  return context
}
