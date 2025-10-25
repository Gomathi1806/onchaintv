"use client"

import { useState } from "react"
import { uploadToIPFSClient, validateVideoFile, type UploadProgress, type IPFSUploadResult } from "@/lib/ipfs"
import { uploadToIPFSServer } from "@/app/actions/upload-to-ipfs"

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
    setError(null)
    setProgress(null)

    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      throw new Error(validation.error)
    }

    setIsUploading(true)

    try {
      // If user provided JWT, use client-side upload with progress tracking
      if (pinataJWT) {
        console.log("[v0] Using client-side upload with provided JWT")
        const result = await uploadToIPFSClient(file, pinataJWT, (prog) => {
          setProgress(prog)
        })
        setIsUploading(false)
        return result
      }

      // Otherwise, try server-side upload (uses PINATA_JWT env var)
      console.log("[v0] Using server-side upload")
      const formData = new FormData()
      formData.append("file", file)

      let result
      try {
        result = await uploadToIPFSServer(formData)
      } catch (err) {
        console.error("[v0] Server action error:", err)
        throw new Error("Failed to communicate with server. Please try again.")
      }

      console.log("[v0] Server upload result:", result)

      if (!result || typeof result !== "object") {
        throw new Error("Invalid response from server")
      }

      if (!result.success) {
        throw new Error(result.error || "Server upload failed")
      }

      if (!result.ipfsHash) {
        throw new Error("No IPFS hash returned from server")
      }

      setIsUploading(false)
      return {
        ipfsHash: result.ipfsHash,
        pinataUrl: result.pinataUrl || "",
        gatewayUrl: result.gatewayUrl || "",
      }
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
