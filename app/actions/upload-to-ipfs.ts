"use server"

/**
 * Server action for secure IPFS uploads
 * Keeps API keys on the server, never exposed to client
 */

interface UploadResult {
  success: boolean
  ipfsHash?: string
  pinataUrl?: string
  gatewayUrl?: string
  error?: string
}

export async function uploadToIPFSServer(formData: FormData): Promise<UploadResult> {
  try {
    console.log("[v0] Server upload started")

    const file = formData.get("file") as File
    if (!file) {
      console.log("[v0] No file provided")
      return { success: false, error: "No file provided" }
    }

    console.log("[v0] File received:", file.name, file.size, "bytes")

    const PINATA_JWT = process.env.PINATA_JWT
    console.log("[v0] PINATA_JWT configured:", !!PINATA_JWT)

    if (!PINATA_JWT) {
      console.log("[v0] PINATA_JWT not found in environment variables")
      return {
        success: false,
        error: "PINATA_JWT environment variable not configured on server",
      }
    }

    // Prepare upload to Pinata
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    // Add metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: "video",
        uploadedAt: new Date().toISOString(),
      },
    })
    uploadFormData.append("pinataMetadata", metadata)

    // Pin options
    const options = JSON.stringify({
      cidVersion: 1,
    })
    uploadFormData.append("pinataOptions", options)

    console.log("[v0] Uploading to Pinata...")

    // Upload to Pinata
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: uploadFormData,
    })

    console.log("[v0] Pinata response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Pinata upload failed:", errorText)
      return {
        success: false,
        error: `Upload failed: ${response.status} ${response.statusText}`,
      }
    }

    const data = await response.json()
    console.log("[v0] Upload successful, IPFS hash:", data.IpfsHash)

    return {
      success: true,
      ipfsHash: data.IpfsHash,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
      gatewayUrl: `https://ipfs.io/ipfs/${data.IpfsHash}`,
    }
  } catch (error) {
    console.error("[v0] Server upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}
