"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Video, ShoppingCart, Check } from "lucide-react"
import { formatEth } from "@/lib/web3-config"

interface Bundle {
  id: number
  name: string
  description: string
  videoCount: number
  price: bigint
  purchaseCount: number
  isPurchased: boolean
}

interface ContentBundlesProps {
  bundles: Bundle[]
  onPurchase: (bundleId: number) => void
  isLoading?: boolean
}

export function ContentBundles({ bundles, onPurchase, isLoading }: ContentBundlesProps) {
  if (bundles.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No bundles available yet</p>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bundles.map((bundle) => (
        <Card key={bundle.id} className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="rounded-full bg-primary/10 p-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            {bundle.isPurchased && <Badge variant="success">Owned</Badge>}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">{bundle.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Video className="h-4 w-4" />
              <span>{bundle.videoCount} videos included</span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{formatEth(bundle.price)}</span>
              <span className="text-muted-foreground">ETH</span>
            </div>
          </div>

          <div className="space-y-2">
            {bundle.isPurchased ? (
              <Button variant="outline" className="w-full bg-transparent" disabled>
                <Check className="h-4 w-4 mr-2" />
                Purchased
              </Button>
            ) : (
              <Button onClick={() => onPurchase(bundle.id)} disabled={isLoading} className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Purchase Bundle
              </Button>
            )}

            <p className="text-xs text-center text-muted-foreground">
              {bundle.purchaseCount} {bundle.purchaseCount === 1 ? "purchase" : "purchases"}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
