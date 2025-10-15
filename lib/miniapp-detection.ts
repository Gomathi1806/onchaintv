"use client"

export function isFarcasterMiniApp(): boolean {
  if (typeof window === "undefined") return false

  try {
    // Check for Farcaster SDK
    return (window as any).__FARCASTER_SDK__ !== undefined
  } catch {
    return false
  }
}

export function isBaseMiniApp(): boolean {
  if (typeof window === "undefined") return false

  try {
    // Check for Base/Coinbase Wallet context
    return (window as any).coinbaseWalletExtension !== undefined || (window as any).ethereum?.isCoinbaseWallet === true
  } catch {
    return false
  }
}

export function isMiniApp(): boolean {
  return isFarcasterMiniApp() || isBaseMiniApp()
}

export function getMiniAppPlatform(): "farcaster" | "base" | "web" {
  if (isFarcasterMiniApp()) return "farcaster"
  if (isBaseMiniApp()) return "base"
  return "web"
}
