"use client"

// Types
export interface UploadProgress {
  percentage: number
  uploaded: number
  total: number
}

export interface IPFSUploadResult {
  ipfsHash: string
  pinataUrl: string
  gatewayUrl: string
}

export interface VideoValidation {
  valid: boolean
  error?: string
}

// Constants
const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]

// Get IPFS URL from hash
export function getIPFSUrl(
  ipfsHash: string | undefined | null,
  gateway: "pinata" | "ipfs" | "cloudflare" = "pinata",
): string {
  // Validate input
  if (!ipfsHash || typeof ipfsHash !== "string") {
    console.error("[v0] getIPFSUrl called with invalid ipfsHash:", ipfsHash)
    return "" // Return empty string instead of crashing
  }

  const hash = ipfsHash.replace("ipfs://", "")

  switch (gateway) {
    case "pinata":
      return `https://gateway.pinata.cloud/ipfs/${hash}`
    case "cloudflare":
      return `https://cloudflare-ipfs.com/ipfs/${hash}`
    case "ipfs":
    default:
      return `https://ipfs.io/ipfs/${hash}`
  }
}

// Format file size to human-readable format
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

// Validate video file
export function validateVideoFile(file: File): VideoValidation {
  // Check file type
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_VIDEO_TYPES.join(", ")}`,
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}`,
    }
  }

  return { valid: true }
}

// Generate thumbnail from video file (client-side only)
export async function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("Could not get canvas context"))
      return
    }

    video.preload = "metadata"
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      // Seek to 1 second or 10% of video duration
      video.currentTime = Math.min(1, video.duration * 0.1)
    }

    video.onseeked = () => {
      // Set canvas dimensions to video dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to data URL
      const thumbnail = canvas.toDataURL("image/jpeg", 0.8)

      // Clean up
      URL.revokeObjectURL(video.src)
      resolve(thumbnail)
    }

    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      reject(new Error("Failed to load video"))
    }

    // Create object URL and set as video source
    video.src = URL.createObjectURL(file)
  })
}

// Upload file to IPFS via Pinata (client-side with progress)
export async function uploadToIPFSClient(
  file: File,
  pinataJWT: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<IPFSUploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append("file", file)

    const xhr = new XMLHttpRequest()

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress({
          percentage: Math.round((e.loaded / e.total) * 100),
          uploaded: e.loaded,
          total: e.total,
        })
      }
    })

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText)
          const ipfsHash = response.IpfsHash

          resolve({
            ipfsHash,
            pinataUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
            gatewayUrl: getIPFSUrl(ipfsHash, "pinata"),
          })
        } catch (err) {
          reject(new Error("Failed to parse Pinata response"))
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    // Handle errors
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"))
    })

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"))
    })

    // Send request
    xhr.open("POST", "https://api.pinata.cloud/pinning/pinFileToIPFS")
    xhr.setRequestHeader("Authorization", `Bearer ${pinataJWT}`)
    xhr.send(formData)
  })
}
