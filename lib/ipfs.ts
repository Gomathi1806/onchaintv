/**
 * IPFS Integration - Secure wrapper
 * Uses server actions to keep API keys secure
 */

// Re-export client utilities
export { validateVideoFile, formatFileSize, generateThumbnail, getIPFSUrl } from "./ipfs-client"
export type { UploadProgress, IPFSUploadResult } from "./ipfs-client"

// Re-export client upload for user-provided keys
export { uploadToIPFSClient } from "./ipfs-client"
