import { describe, it, expect } from "vitest"
import { getIPFSUrl, formatFileSize, validateVideoFile } from "@/lib/ipfs"

describe("IPFS Utilities", () => {
  describe("getIPFSUrl", () => {
    it("should handle valid IPFS hash", () => {
      const hash = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
      const url = getIPFSUrl(hash, "pinata")
      expect(url).toBe(`https://gateway.pinata.cloud/ipfs/${hash}`)
    })

    it("should remove ipfs:// prefix", () => {
      const hash = "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
      const url = getIPFSUrl(hash, "pinata")
      expect(url).toContain("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG")
      expect(url).not.toContain("ipfs://")
    })

    it("should handle empty hash", () => {
      const url = getIPFSUrl("", "pinata")
      expect(url).toBe("")
    })

    it("should support different gateways", () => {
      const hash = "QmTest"
      expect(getIPFSUrl(hash, "pinata")).toContain("gateway.pinata.cloud")
      expect(getIPFSUrl(hash, "cloudflare")).toContain("cloudflare-ipfs.com")
      expect(getIPFSUrl(hash, "ipfs")).toContain("ipfs.io")
    })
  })

  describe("formatFileSize", () => {
    it("should format bytes correctly", () => {
      expect(formatFileSize(0)).toBe("0 Bytes")
      expect(formatFileSize(1024)).toBe("1 KB")
      expect(formatFileSize(1048576)).toBe("1 MB")
      expect(formatFileSize(1073741824)).toBe("1 GB")
    })

    it("should handle decimal values", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB")
      expect(formatFileSize(2621440)).toBe("2.5 MB")
    })
  })

  describe("validateVideoFile", () => {
    it("should accept valid video files", () => {
      const file = new File([""], "test.mp4", { type: "video/mp4" })
      Object.defineProperty(file, "size", { value: 10 * 1024 * 1024 }) // 10MB
      const result = validateVideoFile(file)
      expect(result.valid).toBe(true)
    })

    it("should reject invalid file types", () => {
      const file = new File([""], "test.txt", { type: "text/plain" })
      const result = validateVideoFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain("Invalid file type")
    })

    it("should reject files exceeding size limit", () => {
      const file = new File([""], "test.mp4", { type: "video/mp4" })
      Object.defineProperty(file, "size", { value: 600 * 1024 * 1024 }) // 600MB
      const result = validateVideoFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain("exceeds maximum")
    })
  })
})
