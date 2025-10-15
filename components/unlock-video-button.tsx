"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useVideoPaywallContract } from "@/hooks/use-contract"
import { Loader2, Unlock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatEth } from "@/lib/web3-config"
import { TransactionStatus } from "@/components/transaction-status"

interface UnlockVideoButtonProps {
  videoId: bigint
  price: bigint
  onSuccess?: () => void
}

export function UnlockVideoButton({ videoId, price, onSuccess }: UnlockVideoButtonProps) {
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { unlockVideo, isPending, isConfirming, isConfirmed } = useVideoPaywallContract()
  const { toast } = useToast()

  const handleUnlock = async () => {
    try {
      setIsUnlocking(true)
      setError(null)

      const hash = await unlockVideo(videoId, price)

      toast({
        title: "Video unlocked!",
        description: "You now have access to this video",
      })

      if (onSuccess) {
        // Wait a bit for blockchain to update
        setTimeout(() => {
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      console.error("Unlock error:", err)
      const error = err instanceof Error ? err : new Error("Failed to unlock video")
      setError(error)

      toast({
        title: "Unlock failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsUnlocking(false)
    }
  }

  const isLoading = isPending || isConfirming || isUnlocking

  return (
    <div className="space-y-3">
      <Button onClick={handleUnlock} disabled={isLoading} size="lg" className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isPending ? "Confirming..." : "Processing..."}
          </>
        ) : (
          <>
            <Unlock className="h-4 w-4 mr-2" />
            Unlock for {formatEth(price)} ETH
          </>
        )}
      </Button>

      <TransactionStatus
        isPending={isPending}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        error={error}
        successMessage="Video unlocked successfully!"
        errorMessage="Failed to unlock video"
      />
    </div>
  )
}
