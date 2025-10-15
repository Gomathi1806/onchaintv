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
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    const PINATA_JWT = process.env.PINATA_JWT

    if (!PINATA_JWT) {
      return {
        success: false,
        error: "Pinata JWT not configured. Please add PINATA_JWT to your environment variables.",
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

    // Upload to Pinata
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: uploadFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Pinata upload failed:", errorText)
      return {
        success: false,
        error: `Upload failed: ${response.status} ${response.statusText}`,
      }
    }

    const data = await response.json()

    return {
      success: true,
      ipfsHash: data.IpfsHash,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
      gatewayUrl: `https://ipfs.io/ipfs/${data.IpfsHash}`,
    }
  } catch (error) {
    console.error("Server upload error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    }
  }
}
