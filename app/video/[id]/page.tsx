"use client"

import { use } from "react"
import { useAccount } from "wagmi"
import { useVideoAccess } from "@/hooks/use-video-access"
import { ProtectedVideo } from "@/components/protected-video"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConnectButton } from "@/components/connect-button"
import { Loader2, Eye, DollarSign, Calendar, User, Share2, ExternalLink } from "lucide-react"
import { formatEth } from "@/lib/web3-config"
import { getIPFSUrl } from "@/lib/ipfs"
import Link from "next/link"
import { UnlockVideoButton } from "@/components/unlock-video-button"

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const videoId = BigInt(id)
  const { address, isConnected } = useAccount()

  const { canWatch, isCreator, hasUnlocked, isLoading, video, refetch } = useVideoAccess(videoId)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Video not found</h1>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const date = new Date(Number(video.timestamp) * 1000)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({
        title: `Video #${id}`,
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    }
  }

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

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <ProtectedVideo videoId={videoId} />

            {/* Video Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">Video #{id}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{video.viewCount.toString()} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{date.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Creator Info */}
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Creator</p>
                      <p className="font-mono text-sm">
                        {video.creator.slice(0, 6)}...{video.creator.slice(-4)}
                      </p>
                    </div>
                  </div>
                  {isCreator && <Badge variant="secondary">Your Video</Badge>}
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {!canWatch && (
              <Card className="p-6 space-y-4 border-primary/50 glow-primary">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Unlock Video</h3>
                    <Badge variant="secondary">{formatEth(video.price)} ETH</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">One-time payment for lifetime access</p>
                </div>

                {isConnected ? (
                  <UnlockVideoButton videoId={videoId} price={video.price} onSuccess={() => refetch()} />
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Connect your wallet to unlock</p>
                    <ConnectButton />
                  </div>
                )}

                <div className="pt-4 border-t space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">{formatEth(video.price)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform fee (6%):</span>
                    <span>{formatEth((video.price * 6n) / 100n)} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creator earns:</span>
                    <span className="text-success font-medium">{formatEth((video.price * 94n) / 100n)} ETH</span>
                  </div>
                </div>
              </Card>
            )}

            {canWatch && (
              <Card className="p-6 space-y-4 border-success/50">
                <div className="flex items-center gap-2 text-success">
                  <div className="rounded-full bg-success/10 p-2">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{isCreator ? "Your Video" : "Unlocked"}</p>
                    <p className="text-sm text-muted-foreground">
                      {isCreator ? "You created this video" : "You have access to this video"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Stats Card */}
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">Video Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Total Views</span>
                  </div>
                  <span className="font-medium">{video.viewCount.toString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Price</span>
                  </div>
                  <span className="font-medium">{formatEth(video.price)} ETH</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Uploaded</span>
                  </div>
                  <span className="font-medium">{date.toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            {canWatch && video.ipfsHash && (
              <Card className="p-6 space-y-4">
                <h3 className="font-semibold">IPFS Details</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Decentralized storage hash</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-muted p-2 rounded truncate">{video.ipfsHash}</code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(getIPFSUrl(video.ipfsHash, "ipfs"), "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
