/**
 * Client-side IPFS upload with user-provided API key
 * Allows creators to use their own Pinata keys without server configuration
 */

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface IPFSUploadResult {
  ipfsHash: string
  pinataUrl: string
  gatewayUrl: string
}

/**
 * Upload video to IPFS via Pinata with user-provided JWT
 * This is secure because the creator provides their own API key
 */
export async function uploadToIPFSClient(
  file: File,
  pinataJWT: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<IPFSUploadResult> {
  if (!pinataJWT) {
    throw new Error("Pinata JWT is required")
  }

  const formData = new FormData()
  formData.append("file", file)

  // Add metadata
  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      type: "video",
      uploadedAt: new Date().toISOString(),
    },
  })
  formData.append("pinataMetadata", metadata)

  // Pin options
  const options = JSON.stringify({
    cidVersion: 1,
  })
  formData.append("pinataOptions", options)

  try {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          })
        }
      })
    }

    const uploadPromise = new Promise<IPFSUploadResult>((resolve, reject) => {
      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          resolve({
            ipfsHash: response.IpfsHash,
            pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`,
            gatewayUrl: `https://ipfs.io/ipfs/${response.IpfsHash}`,
          })
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"))
      })

      xhr.open("POST", "https://api.pinata.cloud/pinning/pinFileToIPFS")
      xhr.setRequestHeader("Authorization", `Bearer ${pinataJWT}`)
      xhr.send(formData)
    })

    return await uploadPromise
  } catch (error) {
    console.error("IPFS upload error:", error)
    throw new Error("Failed to upload to IPFS")
  }
}

/**
 * Get IPFS gateway URL for a hash
 */
export function getIPFSUrl(ipfsHash: string, gateway: "pinata" | "ipfs" | "cloudflare" = "pinata"): string {
  switch (gateway) {
    case "pinata":
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
    case "cloudflare":
      return `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`
    case "ipfs":
    default:
      return `https://ipfs.io/ipfs/${ipfsHash}`
  }
}

/**
 * Validate video file
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"]
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload MP4, WebM, OGG, or MOV files.",
    }
  }

  // Check file size (max 500MB)
  const maxSize = 500 * 1024 * 1024 // 500MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File too large. Maximum size is 500MB.",
    }
  }

  return { valid: true }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

/**
 * Generate video thumbnail from file
 */
export async function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    video.preload = "metadata"
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration * 0.1)
    }

    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const thumbnail = canvas.toDataURL("image/jpeg", 0.8)
        resolve(thumbnail)
      } else {
        reject(new Error("Failed to get canvas context"))
      }

      URL.revokeObjectURL(video.src)
    }

    video.onerror = () => {
      reject(new Error("Failed to load video"))
      URL.revokeObjectURL(video.src)
    }

    video.src = URL.createObjectURL(file)
  })
}
