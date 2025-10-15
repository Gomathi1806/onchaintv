"use client"

import { useMiniApp } from "@/hooks/use-miniapp"
import { useFarcaster } from "@/lib/farcaster-context"
import { Smartphone, Zap } from "lucide-react"

export function MiniAppBanner() {
  const { platform, isInMiniApp } = useMiniApp()
  const { user } = useFarcaster()

  if (!isInMiniApp) return null

  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            {platform === "farcaster" ? (
              <>
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  Running in Farcaster
                  {user && ` • @${user.username}`}
                </span>
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 text-primary" />
                <span className="font-medium">Running in Base Mini App</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
