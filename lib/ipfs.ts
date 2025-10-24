"use server"

export function getIPFSUrl(ipfsHash: string, gateway: "pinata" | "ipfs" | "cloudflare" = "pinata"): string {
  // Remove ipfs:// prefix if present
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
