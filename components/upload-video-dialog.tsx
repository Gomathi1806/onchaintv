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
import { Upload, Loader2 } from "lucide-react"
import { useVideoPaywallContract } from "@/hooks/use-contract"
import { parseEth, formatEth, calculateFees } from "@/lib/web3-config"
import { useToast } from "@/hooks/use-toast"

export function UploadVideoDialog() {
  const [open, setOpen] = useState(false)
  const [ipfsHash, setIpfsHash] = useState("")
  const [price, setPrice] = useState("0.001")
  const [title, setTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [pinataJWT, setPinataJWT] = useState("")
  const [showJWTInput, setShowJWTInput] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const { uploadVideo, isPending, isConfirming } = useVideoPaywallContract()
  const { toast } = useToast()

  const handleUploadComplete = (hash: string, file: File) => {
    setIpfsHash(hash)
    setUploadError(null) // Clear any previous errors
    // Auto-fill title from filename
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
    // Auto-show JWT input if server config fails
    if (error.includes("PINATA_JWT") || error.includes("Server upload failed")) {
      setShowJWTInput(true)
      toast({
        title: "Server configuration missing",
        description: "Please paste your Pinata JWT token to continue",
        variant: "destructive",
      })
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

      const hash = await uploadVideo(ipfsHash, priceWei, showJWTInput ? pinataJWT : undefined)

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
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
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
          <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Pinata Configuration</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {showJWTInput ? "Paste your Pinata JWT token" : "Using server-side configuration"}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowJWTInput(!showJWTInput)}>
                {showJWTInput ? "Use Server Config" : "Use My JWT"}
              </Button>
            </div>

            {uploadError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive font-medium">{uploadError}</p>
                {!showJWTInput && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-destructive hover:text-destructive/80"
                    onClick={() => setShowJWTInput(true)}
                  >
                    Click here to use your own JWT token
                  </Button>
                )}
              </div>
            )}

            {showJWTInput && (
              <div className="space-y-2">
                <Label htmlFor="pinataJWT">Pinata JWT Token</Label>
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
            )}
          </div>

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
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isPending ? "Confirming..." : "Processing..."}
                  </>
                ) : (
                  "Publish Video"
                )}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
