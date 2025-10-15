"use client"

import { Button } from "@/components/ui/button"
import { useFarcaster } from "@/lib/farcaster-context"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

interface FarcasterShareButtonProps {
  videoId: bigint
  title?: string
  url?: string
}

export function FarcasterShareButton({ videoId, title, url }: FarcasterShareButtonProps) {
  const { isInFarcaster, sdk } = useFarcaster()

  const handleShare = async () => {
    if (!isInFarcaster || !sdk) {
      // Fallback to Web Share API
      if (navigator.share) {
        try {
          await navigator.share({
            title: title || "Check out this video",
            url: url || window.location.href,
          })
        } catch (error) {
          console.error("[v0] Share failed:", error)
        }
      } else {
        // Copy to clipboard
        await navigator.clipboard.writeText(url || window.location.href)
        toast.success("Link copied to clipboard!")
      }
      return
    }

    try {
      // Use Farcaster compose cast
      await sdk.actions.composeCast({
        text: `${title || "Check out this video"}\n\n${url || window.location.href}`,
        embeds: [url || window.location.href],
      })
      toast.success("Cast composed!")
    } catch (error) {
      console.error("[v0] Failed to compose cast:", error)
      toast.error("Failed to share")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  )
}
