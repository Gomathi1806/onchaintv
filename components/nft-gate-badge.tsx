"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NFTGateBadgeProps {
  nftContract: string
  minTokens?: number
  hasAccess?: boolean
}

export function NFTGateBadge({ nftContract, minTokens = 1, hasAccess }: NFTGateBadgeProps) {
  const shortAddress = `${nftContract.slice(0, 6)}...${nftContract.slice(-4)}`

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={hasAccess ? "success" : "secondary"} className="gap-1">
            {hasAccess ? <Shield className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
            NFT Gated
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {hasAccess ? "You have access" : `Requires ${minTokens} NFT${minTokens > 1 ? "s" : ""}`}
          </p>
          <p className="text-xs font-mono">{shortAddress}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
