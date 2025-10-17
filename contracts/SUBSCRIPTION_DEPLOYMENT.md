# Subscription Contract Deployment Guide

## Overview
The CreatorSubscriptions contract enables recurring monthly subscriptions with tiered access levels.

## Features
- Multiple subscription tiers per creator
- 30-day subscription periods
- Automatic expiry tracking
- 6% platform fee
- Creator earnings withdrawal
- Subscription cancellation (no refund, expires at period end)

## Deployment Steps

### 1. Deploy Contract

**Using Remix:**
1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `CreatorSubscriptions.sol`
3. Paste the contract code
4. Compile with Solidity 0.8.20+
5. Deploy to Base Mainnet or Base Sepolia
6. Save the deployed contract address

**Gas Settings:**
- Gas Limit: 3,000,000
- Network: Base (Chain ID: 8453) or Base Sepolia (Chain ID: 84532)

### 2. Update Frontend Configuration

After deployment, update the contract address in:
\`\`\`typescript
// hooks/use-subscription.ts
const SUBSCRIPTION_CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS" as `0x${string}`
\`\`\`

### 3. Verify Contract on BaseScan

1. Go to [BaseScan](https://basescan.org/) (or Base Sepolia scan)
2. Find your contract
3. Click "Verify and Publish"
4. Select:
   - Compiler: 0.8.20
   - License: MIT
5. Paste contract code
6. Verify

## Creator Setup

### Creating Subscription Tiers

Creators can create up to 3 tiers (Bronze, Silver, Gold):

```solidity
// Example: Create a $10/month tier
createTier("Bronze Tier", 0.01 ether)
createTier("Silver Tier", 0.05 ether)
createTier("Gold Tier", 0.1 ether)
