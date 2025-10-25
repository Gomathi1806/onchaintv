import { describe, it, expect } from "vitest"
import { calculateFees, formatEth, parseEth, PLATFORM_FEE_BPS, BPS_DENOMINATOR } from "@/lib/web3-config"

describe("Web3 Configuration", () => {
  describe("calculateFees", () => {
    it("should calculate 6% platform fee correctly", () => {
      const price = BigInt(1000000000000000000) // 1 ETH
      const { platformFee, creatorEarning } = calculateFees(price)

      expect(platformFee).toBe(BigInt(60000000000000000)) // 0.06 ETH
      expect(creatorEarning).toBe(BigInt(940000000000000000)) // 0.94 ETH
      expect(platformFee + creatorEarning).toBe(price)
    })

    it("should handle small amounts", () => {
      const price = BigInt(100000000000000) // 0.0001 ETH
      const { platformFee, creatorEarning } = calculateFees(price)

      expect(platformFee + creatorEarning).toBe(price)
    })

    it("should handle zero price", () => {
      const price = BigInt(0)
      const { platformFee, creatorEarning } = calculateFees(price)

      expect(platformFee).toBe(BigInt(0))
      expect(creatorEarning).toBe(BigInt(0))
    })
  })

  describe("formatEth", () => {
    it("should format wei to ETH correctly", () => {
      expect(formatEth(BigInt(1000000000000000000))).toBe("1.000000")
      expect(formatEth(BigInt(500000000000000000))).toBe("0.500000")
      expect(formatEth(BigInt(1500000000000000000))).toBe("1.500000")
    })

    it("should respect decimal places", () => {
      expect(formatEth(BigInt(1000000000000000000), 2)).toBe("1.00")
      expect(formatEth(BigInt(1000000000000000000), 4)).toBe("1.0000")
    })
  })

  describe("parseEth", () => {
    it("should parse ETH to wei correctly", () => {
      expect(parseEth("1")).toBe(BigInt(1000000000000000000))
      expect(parseEth("0.5")).toBe(BigInt(500000000000000000))
      expect(parseEth("1.5")).toBe(BigInt(1500000000000000000))
    })

    it("should handle decimal precision", () => {
      expect(parseEth("0.001")).toBe(BigInt(1000000000000000))
      expect(parseEth("0.0001")).toBe(BigInt(100000000000000))
    })
  })

  describe("Platform Fee Constants", () => {
    it("should have correct fee percentage", () => {
      expect(PLATFORM_FEE_BPS).toBe(600) // 6%
      expect(BPS_DENOMINATOR).toBe(10000)
      expect((PLATFORM_FEE_BPS / BPS_DENOMINATOR) * 100).toBe(6)
    })
  })
})
