"use client"

import { useState } from "react"
import { uploadToIPFSClient, validateVideoFile, type UploadProgress, type IPFSUploadResult } from "@/lib/ipfs"

interface UseIPFSUploadReturn {
  upload: (file: File, pinataJWT?: string) => Promise<IPFSUploadResult>
  progress: UploadProgress | null
  isUploading: boolean
  error: string | null
  reset: () => void
}

export function useIPFSUpload(): UseIPFSUploadReturn {
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (file: File, pinataJWT?: string): Promise<IPFSUploadResult> => {
    console.log("[v0] Upload function called")
    console.log("[v0] File:", file.name, file.size, "bytes")
    console.log("[v0] JWT provided:", !!pinataJWT)

    setError(null)
    setProgress(null)

    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.valid) {
      console.error("[v0] File validation failed:", validation.error)
      setError(validation.error || "Invalid file")
      throw new Error(validation.error)
    }

    setIsUploading(true)

    try {
      if (pinataJWT && pinataJWT.trim()) {
        console.log("[v0] Using client-side upload with JWT")
        const result = await uploadToIPFSClient(file, pinataJWT, (prog) => {
          console.log("[v0] Upload progress:", prog.percentage + "%")
          setProgress(prog)
        })
        console.log("[v0] Client-side upload complete:", result.ipfsHash)
        setIsUploading(false)
        return result
      }

      console.error("[v0] No PINATA_JWT provided")
      throw new Error(
        "PINATA_JWT not configured. Please add NEXT_PUBLIC_PINATA_JWT to your environment variables or provide your own JWT.",
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      console.error("[v0] Upload error:", errorMessage)
      setError(errorMessage)
      setIsUploading(false)
      throw err
    }
  }

  const reset = () => {
    setProgress(null)
    setIsUploading(false)
    setError(null)
  }

  return {
    upload,
    progress,
    isUploading,
    error,
    reset,
  }
}
