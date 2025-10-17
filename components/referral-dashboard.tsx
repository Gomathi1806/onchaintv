"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Share2, Copy, DollarSign, Users, TrendingUp } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { formatEth } from "@/lib/web3-config"

interface ReferralDashboardProps {
  userAddress: `0x${string}`
  referralCode?: string
  totalEarnings: bigint
  referralCount: number
}

export function ReferralDashboard({ userAddress, referralCode, totalEarnings, referralCount }: ReferralDashboardProps) {
  const [newCode, setNewCode] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const referralLink = referralCode ? `${window.location.origin}?ref=${referralCode}` : ""

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink)
      toast.success("Referral link copied!")
    }
  }

  const handleCreateCode = async () => {
    if (!newCode || newCode.length < 3) {
      toast.error("Code must be at least 3 characters")
      return
    }

    setIsCreating(true)
    try {
      // TODO: Call smart contract to create referral code
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Referral code created!")
    } catch (error) {
      toast.error("Failed to create code")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold">{formatEth(totalEarnings)} ETH</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-accent/10 p-3">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Referrals</p>
              <p className="text-2xl font-bold">{referralCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-success/10 p-3">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Commission Rate</p>
              <p className="text-2xl font-bold">10%</p>
            </div>
          </div>
        </Card>
      </div>

      {referralCode ? (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Referral Link</h3>
            <Badge variant="success">Active</Badge>
          </div>

          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="font-mono text-sm" />
            <Button onClick={handleCopyLink} size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share on Twitter
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share on Farcaster
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Earn 10% commission on every purchase made through your referral link!
          </p>
        </Card>
      ) : (
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Create Your Referral Code</h3>
          <p className="text-sm text-muted-foreground">Create a unique referral code to start earning commissions</p>

          <div className="space-y-2">
            <Label htmlFor="code">Referral Code</Label>
            <Input
              id="code"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
              placeholder="MYCODE"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">3-20 characters, letters and numbers only</p>
          </div>

          <Button onClick={handleCreateCode} disabled={isCreating} className="w-full">
            {isCreating ? "Creating..." : "Create Referral Code"}
          </Button>
        </Card>
      )}
    </div>
  )
}
