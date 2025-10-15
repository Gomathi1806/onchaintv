"use client"

import { useState } from "react"
import { uploadToIPFSClient, validateVideoFile, type UploadProgress, type IPFSUploadResult } from "@/lib/ipfs-client"
import { uploadToIPFSServer } from "@/app/actions/upload-to-ipfs"

interface UseIPFSUploadReturn {
  uploadWithKey: (file: File, pinataJWT: string) => Promise<IPFSUploadResult>
  uploadWithServer: (file: File) => Promise<IPFSUploadResult>
  progress: UploadProgress | null
  isUploading: boolean
  error: string | null
  reset: () => void
}

export function useIPFSUpload(): UseIPFSUploadReturn {
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload with user-provided API key (client-side with progress)
  const uploadWithKey = async (file: File, pinataJWT: string): Promise<IPFSUploadResult> => {
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
      const result = await uploadToIPFSClient(file, pinataJWT, (prog) => {
        setProgress(prog)
      })

      setIsUploading(false)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setError(errorMessage)
      setIsUploading(false)
      throw err
    }
  }

  // Upload with server-side API key (secure, no progress tracking)
  const uploadWithServer = async (file: File): Promise<IPFSUploadResult> => {
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
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadToIPFSServer(formData)

      if (!result.success || !result.ipfsHash) {
        throw new Error(result.error || "Upload failed")
      }

      setIsUploading(false)
      return {
        ipfsHash: result.ipfsHash,
        pinataUrl: result.pinataUrl || "",
        gatewayUrl: result.gatewayUrl || "",
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
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
    uploadWithKey,
    uploadWithServer,
    progress,
    isUploading,
    error,
    reset,
  }
}
