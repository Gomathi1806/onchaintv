"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, DollarSign, MoreVertical, Trash2 } from "lucide-react"
import { formatEth } from "@/lib/web3-config"
import { getIPFSUrl } from "@/lib/ipfs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface VideoCardProps {
  id: bigint
  ipfsHash?: string
  price: bigint
  viewCount: bigint
  totalEarnings?: bigint
  timestamp: bigint
  isActive: boolean
  isCreator?: boolean
  onDeactivate?: () => void
}

export function VideoCard({
  id,
  ipfsHash,
  price,
  viewCount,
  totalEarnings,
  timestamp,
  isActive,
  isCreator = false,
  onDeactivate,
}: VideoCardProps) {
  const date = new Date(Number(timestamp) * 1000)
  const thumbnailUrl = ipfsHash ? getIPFSUrl(ipfsHash, "pinata") : "/placeholder.svg?height=200&width=400"

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

        {isCreator && totalEarnings !== undefined && (
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
