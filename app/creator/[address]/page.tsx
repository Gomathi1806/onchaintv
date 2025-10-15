"use client"

import { use } from "react"
import { useCreatorVideos } from "@/hooks/use-contract"
import { VideoCard } from "@/components/video-card"
import { Card } from "@/components/ui/card"
import { ConnectButton } from "@/components/connect-button"
import { Loader2, User, Video, Eye, DollarSign } from "lucide-react"
import { formatEth } from "@/lib/web3-config"
import Link from "next/link"
import { useMemo } from "react"

export default function CreatorProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params)
  const creatorAddress = address as `0x${string}`

  const { videoIds, isLoading } = useCreatorVideos(creatorAddress)

  // Calculate creator stats
  const stats = useMemo(() => {
    const totalViews = 0n
    const totalEarnings = 0n

    videoIds.forEach((id) => {
      // This would need to fetch each video's details
      // For now, we'll show basic stats
    })

    return {
      totalVideos: videoIds.length,
      totalViews: Number(totalViews),
      totalEarnings,
    }
  }, [videoIds])

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
        {/* Creator Profile */}
        <Card className="p-8">
          <div className="flex items-start gap-6">
            <div className="rounded-full bg-primary/10 p-6">
              <User className="h-12 w-12 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">Creator Profile</h1>
              <p className="font-mono text-sm text-muted-foreground mb-6">{creatorAddress}</p>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Video className="h-4 w-4" />
                    <span className="text-sm">Videos</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalVideos}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Total Views</span>
                  </div>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Earnings</span>
                  </div>
                  <p className="text-2xl font-bold">{formatEth(stats.totalEarnings)} ETH</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Creator's Videos */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Videos by this Creator</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : videoIds.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">This creator hasn't uploaded any videos yet</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videoIds.map((id) => (
                <VideoCard key={id.toString()} id={id} price={0n} viewCount={0n} timestamp={0n} isActive={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
