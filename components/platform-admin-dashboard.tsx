"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Video, ArrowUpRight, Loader2, Shield } from "lucide-react"
import { formatEth } from "@/lib/web3-config"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { VIDEO_PAYWALL_ABI } from "@/lib/contract-abi"
import { CONTRACT_ADDRESSES } from "@/lib/web3-config"
import { useChainId, useAccount } from "wagmi"

export function PlatformAdminDashboard() {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { toast } = useToast()
  const chainId = useChainId()
  const { address } = useAccount()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Read platform earnings
  const { data: platformEarnings, refetch } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "platformEarnings",
  })

  // Read platform owner
  const { data: platformOwner } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "platformOwner",
  })

  // Read total videos
  const { data: videoCount } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "videoCount",
  })

  const isOwner = address && platformOwner && address.toLowerCase() === platformOwner.toLowerCase()
  const hasFees = (platformEarnings || 0n) > 0n

  const handleWithdraw = async () => {
    if (!isOwner) {
      toast({
        title: "Access denied",
        description: "Only the platform owner can withdraw fees",
        variant: "destructive",
      })
      return
    }

    if (!hasFees) {
      toast({
        title: "No fees to withdraw",
        description: "There are no platform fees available",
        variant: "destructive",
      })
      return
    }

    try {
      setIsWithdrawing(true)

      await writeContractAsync({
        address: contractAddress,
        abi: VIDEO_PAYWALL_ABI,
        functionName: "withdrawPlatformFees",
      })

      toast({
        title: "Withdrawal successful!",
        description: `${formatEth(platformEarnings || 0n)} ETH has been sent to your wallet`,
      })

      setTimeout(() => refetch(), 2000)
    } catch (error) {
      console.error("Withdrawal error:", error)
      toast({
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "Failed to withdraw fees",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  if (!isOwner) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Platform Admin</h2>
          <p className="text-sm text-muted-foreground">Manage platform fees and monitor activity</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform Fees</p>
              <p className="text-2xl font-bold">{formatEth(platformEarnings || 0n)} ETH</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-accent/10 p-3">
              <Video className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Videos</p>
              <p className="text-2xl font-bold">{videoCount?.toString() || "0"}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-success/10 p-3">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fee Rate</p>
              <p className="text-2xl font-bold">6%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Withdraw Platform Fees</h3>
          <Badge variant={hasFees ? "default" : "secondary"}>{hasFees ? "Available" : "No Fees"}</Badge>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-6">
          <p className="text-sm text-muted-foreground mb-2">Available to Withdraw</p>
          <p className="text-3xl font-bold">{formatEth(platformEarnings || 0n)} ETH</p>
        </div>

        <Button
          onClick={handleWithdraw}
          disabled={!hasFees || isPending || isConfirming || isWithdrawing}
          size="lg"
          className="w-full"
        >
          {isPending || isConfirming || isWithdrawing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isPending ? "Confirm in wallet..." : "Processing..."}
            </>
          ) : (
            <>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw Platform Fees
            </>
          )}
        </Button>

        <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
          <p className="font-medium">Platform Revenue Model</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• 6% fee on all video unlocks</li>
            <li>• Creators earn 94% of video price</li>
            <li>• Fees accumulate in smart contract</li>
            <li>• Only platform owner can withdraw</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
