"use client"

import { useAccount } from "wagmi"
import { useCreatorVideos, useVideo } from "@/hooks/use-contract"
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
  const { videoIds, isLoading } = useCreatorVideos(address)
  const videoDetails = useVideo(videoIds)

  // Fetch all video details
  const videos = videoIds.map((id) => videoDetails[id])

  // Calculate stats
  const stats = useMemo(() => {
    const validVideos = videos.filter((v) => v !== null)
    return {
      totalVideos: validVideos.length,
      totalViews: validVideos.reduce((sum, v) => sum + Number(v.viewCount), 0),
      totalEarnings: validVideos.reduce((sum, v) => sum + v.totalEarnings, 0n),
    }
  }, [videos])

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
            <UploadVideoDialog />
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

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">You haven't uploaded any videos yet</p>
              <UploadVideoDialog />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map(
                (video) =>
                  video && (
                    <VideoCard
                      key={video.id.toString()}
                      id={video.id}
                      ipfsHash={video.ipfsHash}
                      price={video.price}
                      viewCount={video.viewCount}
                      totalEarnings={video.totalEarnings}
                      timestamp={video.timestamp}
                      isActive={video.isActive}
                      isCreator={true}
                    />
                  ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
