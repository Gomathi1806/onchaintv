"use client"

import { Button } from "@/components/ui/button"
import { Bell, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface SubscribeButtonProps {
  creatorAddress: `0x${string}`
}

export function SubscribeButton({ creatorAddress }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement subscription logic with smart contract
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubscribed(!isSubscribed)
      toast.success(isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully!")
    } catch (error) {
      toast.error("Failed to update subscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSubscribe} disabled={isLoading} size="sm" variant={isSubscribed ? "outline" : "default"}>
      {isSubscribed ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Subscribed
        </>
      ) : (
        <>
          <Bell className="h-4 w-4 mr-2" />
          Subscribe
        </>
      )}
    </Button>
  )
}
