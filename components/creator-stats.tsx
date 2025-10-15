"use client"

import { Card } from "@/components/ui/card"
import { DollarSign, Eye, Video } from "lucide-react"
import { formatEth } from "@/lib/web3-config"

interface CreatorStatsProps {
  totalVideos: number
  totalViews: number
  totalEarnings: bigint
}

export function CreatorStats({ totalVideos, totalViews, totalEarnings }: CreatorStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Videos</p>
            <p className="text-2xl font-bold">{totalVideos}</p>
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
            <p className="text-2xl font-bold">{totalViews}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-success/10 p-3">
            <DollarSign className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
            <p className="text-2xl font-bold">{formatEth(totalEarnings)} ETH</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
