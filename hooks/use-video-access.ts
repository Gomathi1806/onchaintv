"use client"

import { useAccount } from "wagmi"
import { useVideo, useCheckAccess } from "@/hooks/use-contract"

interface VideoAccessState {
  canWatch: boolean
  isCreator: boolean
  hasUnlocked: boolean
  isLoading: boolean
  video: ReturnType<typeof useVideo>["video"]
  refetch: () => void
}

/**
 * Hook to manage video access control
 * Checks if user can watch based on:
 * 1. Is the creator
 * 2. Has paid to unlock
 */
export function useVideoAccess(videoId: bigint | undefined): VideoAccessState {
  const { address } = useAccount()
  const { video, isLoading: videoLoading, refetch } = useVideo(videoId)
  const { hasAccess, isLoading: accessLoading } = useCheckAccess(videoId, address)

  const isCreator = video?.creator === address
  const hasUnlocked = hasAccess && !isCreator
  const canWatch = isCreator || hasUnlocked

  return {
    canWatch,
    isCreator,
    hasUnlocked,
    isLoading: videoLoading || accessLoading,
    video,
    refetch,
  }
}
