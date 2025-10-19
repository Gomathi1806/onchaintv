"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { VideoUpload } from "@/components/video-upload"
import { Upload, Loader2, AlertCircle } from "lucide-react"
import { useVideoPaywallContract } from "@/hooks/use-contract"
import { parseEth, formatEth, calculateFees } from "@/lib/web3-config"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function UploadVideoDialog() {
  const [open, setOpen] = useState(false)
  const [ipfsHash, setIpfsHash] = useState("")
  const [price, setPrice] = useState("0.001")
  const [title, setTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [pinataJWT, setPinataJWT] = useState("")
  const [showJWTInput, setShowJWTInput] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { uploadVideo, isPending, isConfirming } = useVideoPaywallContract()
  const { toast } = useToast()

  const handleUploadComplete = (hash: string, file: File) => {
    setIpfsHash(hash)
    setUploadError(null)
    // Auto-fill title from filename
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)

    // Only show JWT input if the error is about missing server configuration
    if (error.includes("PINATA_JWT") || error.includes("not configured")) {
      setShowJWTInput(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ipfsHash || !price) {
      toast({
        title: "Missing information",
        description: "Please upload a video and set a price",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const priceWei = parseEth(price)

      console.log("[v0] Starting video upload to blockchain...")
      console.log("[v0] IPFS Hash:", ipfsHash)
      console.log("[v0] Price (wei):", priceWei.toString())
      console.log("[v0] NFT Gate: 0x0000000000000000000000000000000000000000 (no gating)")

      const hash = await uploadVideo(ipfsHash, priceWei, "0x0000000000000000000000000000000000000000")
      setTxHash(hash)

      console.log("[v0] Transaction submitted successfully, hash:", hash)

      toast({
        title: "Transaction submitted",
        description: "Waiting for confirmation on the blockchain...",
      })

      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Video uploaded!",
        description: "Your video is now live on the platform",
      })

      // Reset form
      setOpen(false)
      setIpfsHash("")
      setPrice("0.001")
      setTitle("")
      setPinataJWT("")
      setShowJWTInput(false)
      setUploadError(null)
      setTxHash(undefined)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      console.error("[v0] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })

      let errorMessage = "Failed to upload video"

      if (error instanceof Error) {
        if (error.message.includes("User rejected") || error.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected in wallet"
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas fees"
        } else if (error.message.includes("Contract not deployed")) {
          errorMessage = "Contract not available on this network"
        } else if (error.message.includes("execution reverted")) {
          errorMessage = "Transaction failed - check contract requirements"
        } else {
          errorMessage = error.message
        }
      }

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const priceWei = price ? parseEth(price) : 0n
  const { platformFee, creatorEarning } = calculateFees(priceWei)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="glow-primary">
          <Upload className="h-4 w-4 mr-2" />
          Upload Video
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Video</DialogTitle>
          <DialogDescription>Upload your video to IPFS and set a viewing price</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {uploadError && uploadError.includes("PINATA_JWT") && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-medium mb-2">Platform IPFS not configured</p>
                <p className="text-sm mb-3">
                  The platform owner needs to add <code className="bg-destructive/20 px-1 rounded">PINATA_JWT</code> to
                  environment variables, or you can use your own Pinata account.
                </p>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowJWTInput(true)}>
                  Use My Pinata Account
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {showJWTInput && (
            <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Your Pinata JWT</Label>
                  <p className="text-sm text-muted-foreground mt-1">Upload using your own Pinata account</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowJWTInput(false)
                    setPinataJWT("")
                  }}
                >
                  Cancel
                </Button>
              </div>

              <div className="space-y-2">
                <Input
                  id="pinataJWT"
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={pinataJWT}
                  onChange={(e) => setPinataJWT(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Get your JWT from{" "}
                  <a
                    href="https://app.pinata.cloud/developers/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Pinata Dashboard
                  </a>
                </p>
              </div>
            </div>
          )}

          <VideoUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            pinataJWT={showJWTInput ? pinataJWT : undefined}
          />

          {ipfsHash && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="My awesome video"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Viewing Price (ETH)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  placeholder="0.001"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">Minimum: 0.0001 ETH</p>
              </div>

              {price && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium">Fee Breakdown</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Viewer pays:</span>
                      <span className="font-medium">{formatEth(priceWei)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform fee (6%):</span>
                      <span>{formatEth(platformFee)} ETH</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="text-muted-foreground">You earn:</span>
                      <span className="font-medium text-primary">{formatEth(creatorEarning)} ETH</span>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isPending || isConfirming || isUploading}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Confirm in wallet...
                  </>
                ) : isConfirming ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Confirming on blockchain...
                  </>
                ) : isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  "Publish Video"
                )}
              </Button>

              {txHash && (
                <p className="text-xs text-muted-foreground text-center">
                  Transaction:{" "}
                  <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </a>
                </p>
              )}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
