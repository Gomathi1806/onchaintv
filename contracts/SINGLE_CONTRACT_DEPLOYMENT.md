# Single Contract Deployment Guide

## Overview

The `CreatorPlatform.sol` contract consolidates ALL platform features into one contract:
- ✅ Video paywall with individual purchases
- ✅ Subscription tiers (Bronze/Silver/Gold)
- ✅ Tipping system
- ✅ Content bundles
- ✅ Referral program with commissions
- ✅ NFT-gated content (optional)

## Benefits of Single Contract

1. **One deployment** - Deploy once, manage forever
2. **Lower gas costs** - No cross-contract calls
3. **Simpler integration** - One contract address to track
4. **Easier upgrades** - Update one contract instead of four
5. **Better UX** - Users interact with one contract

## Deployment Steps

### 1. Deploy to Base Sepolia (Testnet)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `CreatorPlatform.sol`
3. Paste the contract code
4. Compile with Solidity 0.8.20+
5. Deploy:
   - Environment: "Injected Provider - MetaMask"
   - Network: Base Sepolia
   - Click "Deploy"
   - Confirm transaction in MetaMask

### 2. Verify on BaseScan

\`\`\`bash
# Get your contract address from deployment
CONTRACT_ADDRESS=0x...

# Verify on BaseScan
# Go to: https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
# Click "Verify and Publish"
# Select: Solidity (Single file)
# Compiler: 0.8.20
# Paste contract code
\`\`\`

### 3. Deploy to Base Mainnet (Production)

Same steps as testnet, but:
- Switch MetaMask to Base Mainnet
- Use real ETH (not testnet ETH)
- Verify on https://basescan.org

## Initial Setup

After deployment, creators can:

```solidity
// 1. Create subscription tiers
createTier(0, 0.001 ether, "Bronze");  // Tier 0
createTier(1, 0.005 ether, "Silver");  // Tier 1
createTier(2, 0.01 ether, "Gold");     // Tier 2

// 2. Upload videos
uploadVideo("ipfs://...", 0.001 ether, address(0));

// 3. Create bundles
uint256[] memory videoIds = [0, 1, 2];
createBundle(videoIds, 0.002 ether, "Starter Pack");

// 4. Create referral code
createReferralCode("CREATOR2025");
