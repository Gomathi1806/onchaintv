"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Upload, Video, X } from "lucide-react"
import { useIPFSUpload } from "@/hooks/use-ipfs-upload"
import { formatFileSize, generateThumbnail } from "@/lib/ipfs"
import { cn } from "@/lib/utils"

interface VideoUploadProps {
  onUploadComplete: (ipfsHash: string, file: File) => void
  onUploadError?: (error: string) => void
  className?: string
  pinataJWT?: string
}

export function VideoUpload({ onUploadComplete, onUploadError, className, pinataJWT }: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { upload, progress, isUploading, error, reset } = useIPFSUpload()

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    reset()

    // Generate thumbnail
    try {
      const thumb = await generateThumbnail(file)
      setThumbnail(thumb)
    } catch (err) {
      console.error("Failed to generate thumbnail:", err)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    console.log("[v0] Starting upload...")
    console.log("[v0] File:", selectedFile.name, selectedFile.size, "bytes")
    console.log("[v0] JWT provided:", !!pinataJWT)
    console.log("[v0] JWT length:", pinataJWT?.length || 0)

    try {
      const result = await upload(selectedFile, pinataJWT)
      console.log("[v0] Upload successful!")
      console.log("[v0] IPFS Hash:", result.ipfsHash)
      onUploadComplete(result.ipfsHash, selectedFile)
    } catch (err) {
      console.error("[v0] Upload failed:", err)
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      if (onUploadError) {
        onUploadError(errorMessage)
      }
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setThumbnail(null)
    reset()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className={cn("p-6", className)}>
      <div className="space-y-4">
        <div>
          <Label>Upload Video</Label>
          <p className="text-sm text-muted-foreground">MP4, WebM, OGG, or MOV (max 500MB)</p>
        </div>

        {!selectedFile ? (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              "cursor-pointer",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">Drop your video here or click to browse</p>
                <p className="text-sm text-muted-foreground">Supports MP4, WebM, OGG, MOV</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg border bg-card overflow-hidden">
              {thumbnail && (
                <div className="aspect-video bg-muted">
                  <img
                    src={thumbnail || "/placeholder.svg"}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="rounded bg-primary/10 p-2 shrink-0">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>

                  {!isUploading && (
                    <Button variant="ghost" size="icon" onClick={handleRemove} className="shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isUploading && progress && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uploading to IPFS...</span>
                      <span className="font-medium">{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} />
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {!isUploading && !error && (
              <Button onClick={handleUpload} className="w-full" size="lg">
                <Upload className="h-4 w-4 mr-2" />
                Upload to IPFS
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
