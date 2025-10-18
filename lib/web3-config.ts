import { http, createConfig } from "wagmi"
import { base, baseSepolia } from "wagmi/chains"
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors"

// Contract addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
  [baseSepolia.id]: "0x0000000000000000000000000000000000000000", // Deploy to Base Sepolia testnet
  [base.id]: "0xce69830d2f14584c368b362d41e9deb9b2e38b8c", // NEW CreatorPlatform contract (deployed)
} as const

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

export const config = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Creator Paywall" }),
    // Only include WalletConnect if project ID is configured
    ...(walletConnectProjectId ? [walletConnect({ projectId: walletConnectProjectId })] : []),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
})

// Platform fee: 6%
export const PLATFORM_FEE_BPS = 600
export const BPS_DENOMINATOR = 10000

// Helper to calculate fees
export function calculateFees(price: bigint) {
  const platformFee = (price * BigInt(PLATFORM_FEE_BPS)) / BigInt(BPS_DENOMINATOR)
  const creatorEarning = price - platformFee
  return { platformFee, creatorEarning }
}

// Format ETH with proper decimals
export function formatEth(wei: bigint, decimals = 6): string {
  const eth = Number(wei) / 1e18
  return eth.toFixed(decimals)
}

// Parse ETH to wei
export function parseEth(eth: string): bigint {
  return BigInt(Math.floor(Number.parseFloat(eth) * 1e18))
}
