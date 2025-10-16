"use client"

import { useState } from "react"
import { uploadToIPFSClient, validateVideoFile, type UploadProgress, type IPFSUploadResult } from "@/lib/ipfs"
import { uploadToIPFSServer } from "@/app/actions/upload-to-ipfs"

interface UseIPFSUploadReturn {
  upload: (file: File, pinataJWT?: string) => Promise<IPFSUploadResult>
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

  const upload = async (file: File, pinataJWT?: string): Promise<IPFSUploadResult> => {
    console.log("[v0] Starting upload, file:", file.name, "size:", file.size)

    setError(null)
    setProgress(null)

    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.valid) {
      console.log("[v0] Validation failed:", validation.error)
      setError(validation.error || "Invalid file")
      throw new Error(validation.error)
    }

    console.log("[v0] File validation passed")

    // If user provided JWT, use client-side upload
    if (pinataJWT) {
      console.log("[v0] Using client-side upload with provided JWT")
      return uploadWithKey(file, pinataJWT)
    }

    // Try server-side upload first
    console.log("[v0] Attempting server-side upload")
    try {
      return await uploadWithServer(file)
    } catch (err) {
      console.log("[v0] Server-side upload failed, error:", err)
      // If server-side fails, prompt for JWT
      const errorMessage = "Server upload failed. Please configure PINATA_JWT environment variable."
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // Upload with user-provided API key (client-side with progress)
  const uploadWithKey = async (file: File, pinataJWT: string): Promise<IPFSUploadResult> => {
    console.log("[v0] uploadWithKey called")
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
        console.log("[v0] Upload progress:", prog.percentage + "%")
        setProgress(prog)
      })

      console.log("[v0] Upload successful, IPFS hash:", result.ipfsHash)
      setIsUploading(false)
      return result
    } catch (err) {
      console.error("[v0] Upload error:", err)
      const errorMessage = err instanceof Error ? err.message : "Upload failed"
      setError(errorMessage)
      setIsUploading(false)
      throw err
    }
  }

  // Upload with server-side API key (secure, no progress tracking)
  const uploadWithServer = async (file: File): Promise<IPFSUploadResult> => {
    console.log("[v0] uploadWithServer called")
    setError(null)
    setProgress(null)

    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file")
      throw new Error(validation.error)
    }

    setIsUploading(true)
    console.log("[v0] Creating FormData and calling server action")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadToIPFSServer(formData)
      console.log("[v0] Server action result:", result)

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
      console.error("[v0] Server upload error:", err)
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
    upload,
    uploadWithKey,
    uploadWithServer,
    progress,
    isUploading,
    error,
    reset,
  }
}
