"use client"

import { Card } from "@/components/ui/card"
import { useVideo } from "@/hooks/use-contract"
import { BarChart, TrendingUp, DollarSign, Eye, VideoIcon, Calendar } from "lucide-react"
import { formatEth } from "@/lib/web3-config"
import { useMemo } from "react"

interface CreatorAnalyticsProps {
  creatorAddress: `0x${string}`
  videoIds: readonly bigint[]
}

export function CreatorAnalytics({ creatorAddress, videoIds }: CreatorAnalyticsProps) {
  // Fetch all video details
  const videoDetails = videoIds.map((id) => useVideo(id))

  // Calculate analytics
  const analytics = useMemo(() => {
    const videos = videoDetails.map((v) => v.video).filter(Boolean)

    const totalEarnings = videos.reduce((sum, v) => sum + (v?.totalEarnings || 0n), 0n)
    const totalViews = videos.reduce((sum, v) => sum + Number(v?.viewCount || 0n), 0)
    const avgViewsPerVideo = videos.length > 0 ? totalViews / videos.length : 0
    const avgEarningsPerVideo = videos.length > 0 ? totalEarnings / BigInt(videos.length) : 0n

    // Top performing videos
    const topVideos = [...videos]
      .sort((a, b) => Number(b?.totalEarnings || 0n) - Number(a?.totalEarnings || 0n))
      .slice(0, 5)

    // Recent activity
    const recentVideos = [...videos].sort((a, b) => Number(b?.timestamp || 0n) - Number(a?.timestamp || 0n)).slice(0, 5)

    return {
      totalEarnings,
      totalViews,
      avgViewsPerVideo,
      avgEarningsPerVideo,
      topVideos,
      recentVideos,
      conversionRate: totalViews > 0 ? (videos.length / totalViews) * 100 : 0,
    }
  }, [videoDetails])

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatEth(analytics.totalEarnings)} ETH</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-accent/10 p-3">
              <Eye className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-success/10 p-3">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg per Video</p>
              <p className="text-2xl font-bold">{formatEth(analytics.avgEarningsPerVideo)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-warning/10 p-3">
              <BarChart className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Views</p>
              <p className="text-2xl font-bold">{Math.round(analytics.avgViewsPerVideo)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performing Videos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Performing Videos
        </h3>
        <div className="space-y-3">
          {analytics.topVideos.length === 0 ? (
            <p className="text-muted-foreground text-sm">No videos yet</p>
          ) : (
            analytics.topVideos.map((video, index) => (
              <div key={video?.id.toString()} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                  <div>
                    <p className="font-medium">Video #{video?.id.toString()}</p>
                    <p className="text-sm text-muted-foreground">{Number(video?.viewCount)} views</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatEth(video?.totalEarnings || 0n)} ETH</p>
                  <p className="text-sm text-muted-foreground">earned</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Uploads
        </h3>
        <div className="space-y-3">
          {analytics.recentVideos.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent activity</p>
          ) : (
            analytics.recentVideos.map((video) => (
              <div key={video?.id.toString()} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <VideoIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Video #{video?.id.toString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Number(video?.timestamp || 0n) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatEth(video?.price || 0n)} ETH</p>
                  <p className="text-sm text-muted-foreground">price</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
