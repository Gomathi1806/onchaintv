"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface VideoShareLinkProps {
  videoId: bigint
  hasAccess: boolean
}

export function VideoShareLink({ videoId, hasAccess }: VideoShareLinkProps) {
  const [copied, setCopied] = useState(false)

  const videoUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/video/${videoId}`
  const shareText = hasAccess
    ? `Check out this video I unlocked on OnChainTV!`
    : `Check out this video on OnChainTV - Own Your Content, Earn Directly!`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  const handleShare = async (platform: "twitter" | "farcaster") => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(videoUrl)

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, "_blank")
    } else {
      // Farcaster share (using Warpcast)
      window.open(`https://warpcast.com/~/compose?text=${encodedText}%20${encodedUrl}`, "_blank")
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Share2 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Share This Video</h3>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input value={videoUrl} readOnly className="font-mono text-sm" />
          <Button onClick={handleCopy} size="icon" variant="outline">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => handleShare("twitter")} className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Share on X
          </Button>
          <Button variant="outline" onClick={() => handleShare("farcaster")} className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Share on Farcaster
          </Button>
        </div>

        {hasAccess && (
          <p className="text-xs text-muted-foreground">
            💡 Share this link with friends! They'll need to unlock it to watch, and you can earn referral commissions.
          </p>
        )}
      </div>
    </Card>
  )
}
