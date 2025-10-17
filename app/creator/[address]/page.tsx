"use client"

import { use } from "react"
import { useCreatorVideos, useVideo } from "@/hooks/use-contract"
import { VideoCard } from "@/components/video-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectButton } from "@/components/connect-button"
import { Loader2, User, Video, Eye, DollarSign, TrendingUp, Calendar, Share2, Bell } from "lucide-react"
import { formatEth } from "@/lib/web3-config"
import Link from "next/link"
import { useMemo, useState } from "react"
import { useAccount } from "wagmi"
import { CreatorAnalytics } from "@/components/creator-analytics"
import { SubscribeButton } from "@/components/subscribe-button"

export default function CreatorProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params)
  const creatorAddress = address as `0x${string}`
  const { address: connectedAddress } = useAccount()
  const isOwnProfile = connectedAddress?.toLowerCase() === creatorAddress.toLowerCase()

  const { videoIds, isLoading } = useCreatorVideos(creatorAddress)
  const [activeTab, setActiveTab] = useState("videos")

  const videoDetails = videoIds.map((id) => useVideo(id))

  const stats = useMemo(() => {
    let totalViews = 0n
    let totalEarnings = 0n
    let activeVideos = 0

    videoDetails.forEach(({ video }) => {
      if (video) {
        totalViews += video.viewCount
        totalEarnings += video.totalEarnings
        if (video.isActive) activeVideos++
      }
    })

    return {
      totalVideos: videoIds.length,
      activeVideos,
      totalViews: Number(totalViews),
      totalEarnings,
    }
  }, [videoIds, videoDetails])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              ← Back to Explore
            </Link>
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="rounded-full bg-gradient-to-br from-primary to-accent p-1">
              <div className="rounded-full bg-background p-6">
                <User className="h-16 w-16 text-primary" />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Creator Channel</h1>
                <p className="font-mono text-sm text-muted-foreground">{creatorAddress}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Video className="h-4 w-4" />
                    <span className="text-xs">Videos</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalVideos}</p>
                  <p className="text-xs text-muted-foreground">{stats.activeVideos} active</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">Views</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Earnings</span>
                  </div>
                  <p className="text-2xl font-bold">{formatEth(stats.totalEarnings)}</p>
                  <p className="text-xs text-muted-foreground">ETH</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">Avg Price</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {stats.totalVideos > 0 ? formatEth(stats.totalEarnings / BigInt(stats.totalViews || 1)) : "0.00"}
                  </p>
                  <p className="text-xs text-muted-foreground">ETH</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {!isOwnProfile && (
                  <>
                    <SubscribeButton creatorAddress={creatorAddress} />
                    <Button variant="outline" size="sm">
                      <Bell className="h-4 w-4 mr-2" />
                      Follow
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Channel
                </Button>
                {isOwnProfile && (
                  <Link href="/dashboard">
                    <Button size="sm">Manage Channel</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Videos ({stats.totalVideos})</h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : videoIds.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">This creator hasn't uploaded any videos yet</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videoIds.map((id) => (
                  <VideoCard key={id.toString()} id={id} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <CreatorAnalytics creatorAddress={creatorAddress} videoIds={videoIds} />
          </TabsContent>

          <TabsContent value="about">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">About This Creator</h3>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {new Date().toLocaleDateString()}</span>
                </div>
                <p>
                  This creator is building on Base, offering exclusive video content through blockchain-powered
                  micropayments. Support them by unlocking their videos or subscribing to their channel.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
