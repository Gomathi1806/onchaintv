"use client"

import { useEffect, useState } from "react"
import { getMiniAppPlatform, isMiniApp } from "@/lib/miniapp-detection"

export function useMiniApp() {
  const [platform, setPlatform] = useState<"farcaster" | "base" | "web">("web")
  const [isInMiniApp, setIsInMiniApp] = useState(false)

  useEffect(() => {
    const detectedPlatform = getMiniAppPlatform()
    setPlatform(detectedPlatform)
    setIsInMiniApp(isMiniApp())
  }, [])

  return {
    platform,
    isInMiniApp,
    isFarcaster: platform === "farcaster",
    isBase: platform === "base",
    isWeb: platform === "web",
  }
}
