"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Zap } from "lucide-react"
import { formatEth } from "@/lib/web3-config"
import {
  useCreatorTiers,
  useTierDetails,
  useSubscriptionStatus,
  useSubscriptionContract,
} from "@/hooks/use-subscription"
import { useAccount } from "wagmi"
import { toast } from "sonner"
import { useState } from "react"

interface SubscriptionTiersProps {
  creatorAddress: `0x${string}`
}

const TIER_ICONS = [Star, Zap, Crown]
const TIER_COLORS = ["text-bronze", "text-silver", "text-gold"]

export function SubscriptionTiers({ creatorAddress }: SubscriptionTiersProps) {
  const { address } = useAccount()
  const { tierCount } = useCreatorTiers(creatorAddress)
  const { subscribe, cancelSubscription, isPending } = useSubscriptionContract()
  const [loadingTier, setLoadingTier] = useState<number | null>(null)

  const tiers = Array.from({ length: tierCount }, (_, i) => i)

  const handleSubscribe = async (tierId: number, price: bigint) => {
    if (!address) {
      toast.error("Please connect your wallet")
      return
    }

    setLoadingTier(tierId)
    try {
      await subscribe(creatorAddress, BigInt(tierId), price)
      toast.success("Subscribed successfully!")
    } catch (error) {
      toast.error("Failed to subscribe")
      console.error(error)
    } finally {
      setLoadingTier(null)
    }
  }

  const handleCancel = async (tierId: number) => {
    setLoadingTier(tierId)
    try {
      await cancelSubscription(creatorAddress, BigInt(tierId))
      toast.success("Subscription cancelled")
    } catch (error) {
      toast.error("Failed to cancel subscription")
      console.error(error)
    } finally {
      setLoadingTier(null)
    }
  }

  if (tierCount === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">This creator hasn't set up subscription tiers yet</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tiers.map((tierId) => (
        <TierCard
          key={tierId}
          creatorAddress={creatorAddress}
          tierId={tierId}
          icon={TIER_ICONS[tierId % TIER_ICONS.length]}
          onSubscribe={handleSubscribe}
          onCancel={handleCancel}
          isLoading={loadingTier === tierId}
        />
      ))}
    </div>
  )
}

function TierCard({
  creatorAddress,
  tierId,
  icon: Icon,
  onSubscribe,
  onCancel,
  isLoading,
}: {
  creatorAddress: `0x${string}`
  tierId: number
  icon: any
  onSubscribe: (tierId: number, price: bigint) => void
  onCancel: (tierId: number) => void
  isLoading: boolean
}) {
  const { address } = useAccount()
  const { tier } = useTierDetails(creatorAddress, tierId)
  const { hasActiveSubscription, subscription } = useSubscriptionStatus(address, creatorAddress, tierId)

  if (!tier) return null

  const daysRemaining = subscription?.expiryTime
    ? Math.max(0, Math.floor((Number(subscription.expiryTime) - Date.now() / 1000) / 86400))
    : 0

  return (
    <Card className="p-6 space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16" />

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <Icon className="h-8 w-8 text-primary" />
          {hasActiveSubscription && <Badge variant="success">Active</Badge>}
        </div>

        <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{formatEth(tier.monthlyPrice)}</span>
          <span className="text-muted-foreground">ETH/month</span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-success" />
          <span>Access to all videos</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-success" />
          <span>Early access to new content</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-success" />
          <span>Support the creator</span>
        </div>
      </div>

      <div className="pt-4">
        {hasActiveSubscription ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">{daysRemaining} days remaining</p>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => onCancel(tierId)}
              disabled={isLoading}
            >
              Cancel Subscription
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={() => onSubscribe(tierId, tier.monthlyPrice)}
            disabled={isLoading || !tier.isActive}
          >
            {isLoading ? "Processing..." : "Subscribe Now"}
          </Button>
        )}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        {tier.subscriberCount} {tier.subscriberCount === 1 ? "subscriber" : "subscribers"}
      </p>
    </Card>
  )
}
