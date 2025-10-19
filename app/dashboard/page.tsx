"use client"

import { useAccount } from "wagmi"
import { useCreatorVideos } from "@/hooks/use-contract"
import { CreatorStats } from "@/components/creator-stats"
import { VideoCard } from "@/components/video-card"
import { UploadVideoDialog } from "@/components/upload-video-dialog"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"
import { useConnect } from "wagmi"
import { useMemo } from "react"

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { videoIds, isLoading: isLoadingIds, refetch } = useCreatorVideos(address)

  console.log("[v0] Dashboard - Creator address:", address)
  console.log("[v0] Dashboard - Video IDs:", videoIds)
  console.log("[v0] Dashboard - Is loading:", isLoadingIds)

  const videos = useMemo(() => {
    if (!videoIds || videoIds.length === 0) return []

    // For now, return video IDs with basic info
    // The VideoCard component will fetch individual video details
    return videoIds.map((id) => ({ id }))
  }, [videoIds])

  const stats = useMemo(() => {
    return {
      totalVideos: videoIds?.length || 0,
      totalViews: 0, // Will be calculated once videos load
      totalEarnings: 0n,
    }
  }, [videoIds])

  const handleUploadSuccess = () => {
    console.log("[v0] Upload success - refetching videos...")
    refetch()
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto">
            <Wallet className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Connect Your Wallet</h1>
            <p className="text-muted-foreground">Connect your wallet to access your creator dashboard</p>
          </div>
          <div className="space-y-2">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => connect({ connector })}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Connect with {connector.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Creator Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your videos and track earnings</p>
            </div>
            <UploadVideoDialog onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <CreatorStats
          totalVideos={stats.totalVideos}
          totalViews={stats.totalViews}
          totalEarnings={stats.totalEarnings}
        />

        <div>
          <h2 className="text-xl font-semibold mb-4">Your Videos</h2>

          {isLoadingIds ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">You haven't uploaded any videos yet</p>
              <UploadVideoDialog onUploadSuccess={handleUploadSuccess} />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id.toString()} id={video.id} isCreator={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
