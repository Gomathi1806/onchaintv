"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DollarSign, Heart } from "lucide-react"
import { useState } from "react"
import { useSocialContract } from "@/hooks/use-social"
import { toast } from "sonner"
import { useAccount } from "wagmi"

interface TipButtonProps {
  creatorAddress: `0x${string}`
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function TipButton({ creatorAddress, variant = "outline", size = "sm" }: TipButtonProps) {
  const { address } = useAccount()
  const { sendTip, isPending } = useSocialContract()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("0.01")
  const [message, setMessage] = useState("")

  const handleTip = async () => {
    if (!address) {
      toast.error("Please connect your wallet")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      await sendTip(creatorAddress, message, amount)
      toast.success("Tip sent successfully!")
      setOpen(false)
      setAmount("0.01")
      setMessage("")
    } catch (error) {
      toast.error("Failed to send tip")
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <Heart className="h-4 w-4 mr-2" />
          Tip Creator
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a Tip</DialogTitle>
          <DialogDescription>Support this creator with a direct tip</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9"
                placeholder="0.01"
              />
            </div>
            <div className="flex gap-2">
              {["0.01", "0.05", "0.1"].map((preset) => (
                <Button key={preset} variant="outline" size="sm" onClick={() => setAmount(preset)}>
                  {preset} ETH
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message for the creator..."
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">{message.length}/200 characters</p>
          </div>

          <Button onClick={handleTip} disabled={isPending} className="w-full">
            {isPending ? "Sending..." : `Send ${amount} ETH Tip`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
