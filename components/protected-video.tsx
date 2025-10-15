"use client"

import type React from "react"

import { useVideoAccess } from "@/hooks/use-video-access"
import { VideoPlayer } from "@/components/video-player"
import { Card } from "@/components/ui/card"
import { Lock, Loader2 } from "lucide-react"
import { formatEth } from "@/lib/web3-config"

interface ProtectedVideoProps {
  videoId: bigint
  showLocked?: boolean
  children?: React.ReactNode
}

/**
 * Component that handles video access control
 * Shows video player if user has access, otherwise shows locked state
 */
export function ProtectedVideo({ videoId, showLocked = true, children }: ProtectedVideoProps) {
  const { canWatch, isLoading, video } = useVideoAccess(videoId)

  if (isLoading) {
    return (
      <Card className="aspect-video flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    )
  }

  if (!video) {
    return (
      <Card className="aspect-video flex items-center justify-center">
        <p className="text-muted-foreground">Video not found</p>
      </Card>
    )
  }

  if (canWatch && video.ipfsHash) {
    return <VideoPlayer ipfsHash={video.ipfsHash} />
  }

  if (!showLocked) {
    return null
  }

  return (
    <Card className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=800')] bg-cover bg-center opacity-20 blur-sm" />
      <div className="relative text-center space-y-4 p-8">
        <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto">
          <Lock className="h-12 w-12 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Unlock to Watch</h2>
          <p className="text-muted-foreground">Pay {formatEth(video.price)} ETH to access this video</p>
        </div>
        {children}
      </div>
    </Card>
  )
}
