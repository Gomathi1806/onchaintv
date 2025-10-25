"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, Loader2 } from "lucide-react"
import { formatEth } from "@/lib/web3-config"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { VIDEO_PAYWALL_ABI } from "@/lib/contract-abi"
import { CONTRACT_ADDRESSES } from "@/lib/web3-config"
import { useChainId } from "wagmi"

interface CreatorEarningsDashboardProps {
  creatorAddress: `0x${string}`
}

export function CreatorEarningsDashboard({ creatorAddress }: CreatorEarningsDashboardProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { toast } = useToast()
  const chainId = useChainId()
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES]

  const { writeContractAsync, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Read creator earnings from contract
  const { data: earnings, refetch } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "creatorEarnings",
    args: [creatorAddress],
  })

  // Read creator tips from contract
  const { data: tips } = useReadContract({
    address: contractAddress,
    abi: VIDEO_PAYWALL_ABI,
    functionName: "creatorTips",
    args: [creatorAddress],
  })

  const totalEarnings = (earnings || 0n) + (tips || 0n)
  const hasEarnings = totalEarnings > 0n

  const handleWithdraw = async () => {
    if (!hasEarnings) {
      toast({
        title: "No earnings to withdraw",
        description: "You don't have any earnings available",
        variant: "destructive",
      })
      return
    }

    try {
      setIsWithdrawing(true)

      await writeContractAsync({
        address: contractAddress,
        abi: VIDEO_PAYWALL_ABI,
        functionName: "withdrawEarnings",
      })

      toast({
        title: "Withdrawal successful!",
        description: `${formatEth(totalEarnings)} ETH has been sent to your wallet`,
      })

      // Refetch earnings after withdrawal
      setTimeout(() => refetch(), 2000)
    } catch (error) {
      console.error("Withdrawal error:", error)
      toast({
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "Failed to withdraw earnings",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Earnings</h3>
        <Badge variant={hasEarnings ? "default" : "secondary"}>{hasEarnings ? "Available" : "No Earnings"}</Badge>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-primary/20 p-2">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Total Available</p>
          </div>
          <p className="text-3xl font-bold">{formatEth(totalEarnings)} ETH</p>
          <p className="text-sm text-muted-foreground mt-1">
            ≈ ${(Number(formatEth(totalEarnings)) * 2500).toFixed(2)} USD
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Video Earnings</p>
            </div>
            <p className="text-xl font-semibold">{formatEth(earnings || 0n)} ETH</p>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Tips Received</p>
            </div>
            <p className="text-xl font-semibold">{formatEth(tips || 0n)} ETH</p>
          </div>
        </div>

        <Button
          onClick={handleWithdraw}
          disabled={!hasEarnings || isPending || isConfirming || isWithdrawing}
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
              Withdraw Earnings
            </>
          )}
        </Button>

        <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
          <p className="font-medium">How Earnings Work</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• You earn 94% of each video unlock (6% platform fee)</li>
            <li>• Tips go 100% to you (no platform fee)</li>
            <li>• Withdraw anytime to your connected wallet</li>
            <li>• Gas fees apply for withdrawal transactions</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
