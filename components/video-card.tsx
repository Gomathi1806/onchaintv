"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, DollarSign, MoreVertical, Trash2, Loader2 } from "lucide-react"
import { formatEth } from "@/lib/web3-config"
import { getIPFSUrl } from "@/lib/ipfs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useVideo } from "@/hooks/use-contract"
import type { VideoCardProps } from "@/types/video-card"

export function VideoCard({
  id,
  ipfsHash: propIpfsHash,
  price: propPrice,
  viewCount: propViewCount,
  totalEarnings: propTotalEarnings,
  timestamp: propTimestamp,
  isActive: propIsActive,
  isCreator,
  onDeactivate,
}: VideoCardProps) {
  const { video, isLoading } = useVideo(propIpfsHash === undefined ? id : undefined)

  // Use props if provided, otherwise use fetched data
  const ipfsHash = propIpfsHash ?? video?.ipfsHash
  const price = propPrice ?? video?.price ?? 0n
  const viewCount = propViewCount ?? video?.viewCount ?? 0n
  const totalEarnings = propTotalEarnings ?? video?.totalEarnings ?? 0n
  const timestamp = propTimestamp ?? video?.timestamp ?? 0n
  const isActive = propIsActive ?? video?.isActive ?? true

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <div className="aspect-video bg-muted flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <div className="p-4">
          <div className="h-4 bg-muted rounded animate-pulse mb-2" />
          <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
        </div>
      </Card>
    )
  }

  const date = timestamp ? new Date(Number(timestamp) * 1000) : new Date()
  const thumbnailUrl =
    ipfsHash && typeof ipfsHash === "string" ? getIPFSUrl(ipfsHash, "pinata") : "/video-thumbnail.png"

  return (
    <Card className="overflow-hidden group hover:border-primary/50 transition-colors">
      <Link href={`/video/${id}`}>
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img src={thumbnailUrl || "/placeholder.svg"} alt={`Video ${id}`} className="w-full h-full object-cover" />
          {!isActive && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary">Inactive</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/video/${id}`}>
              <h3 className="font-semibold truncate hover:text-primary transition-colors">Video #{id.toString()}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">{date.toLocaleDateString()}</p>
          </div>

          {isCreator && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onDeactivate} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Deactivate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{viewCount.toString()}</span>
          </div>
          <div className="flex items-center gap-1 text-primary font-medium">
            <DollarSign className="h-4 w-4" />
            <span>{formatEth(price)} ETH</span>
          </div>
        </div>

        {isCreator && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Earned:</span>
              <span className="font-medium text-success">{formatEth(totalEarnings)} ETH</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
