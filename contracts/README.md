# VideoPaywall Smart Contract

## Overview
Solidity smart contract for decentralized video platform with micropayments on Base L2.

## Features
- Upload videos with IPFS hash and set price
- Pay-to-unlock mechanism with 6% platform fee
- Access control (only paid viewers can see IPFS hash)
- Creator earnings tracking
- Video deactivation
- Platform fee withdrawal

## Deployment Instructions

### Option 1: Remix IDE (Easiest - Recommended)

1. **Open Remix**: Go to https://remix.ethereum.org

2. **Create Contract**: 
   - New file: `VideoPaywall.sol`
   - Copy contract code from this folder

3. **Compile**:
   - Solidity Compiler tab
   - Version: 0.8.20+
   - Click "Compile"

4. **Setup Network**:
   - Deploy & Run tab
   - Environment: "Injected Provider - MetaMask"
   - Switch MetaMask to **Base Sepolia**:
     - RPC: https://sepolia.base.org
     - Chain ID: 84532

5. **Get Testnet ETH**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

6. **Deploy**:
   - **Gas Limit: 3000000** (important!)
   - Click "Deploy"
   - Confirm in MetaMask

7. **Copy Contract Address** and update `lib/web3-config.ts`

#### Troubleshooting Remix Timeout Error

If you get `"Timeout for call deployMetadataOf"`:

**Fix 1: Increase Gas Limit**
- Set Gas Limit to **5000000** (5 million)
- Try deploying again

**Fix 2: Use Different RPC**
- In MetaMask, change Base Sepolia RPC to:
  - https://base-sepolia.blockpi.network/v1/rpc/public
  - Or: https://base-sepolia.publicnode.com

**Fix 3: Deploy During Off-Peak Hours**
- Try early morning or late night UTC
- Network congestion varies by time

**Fix 4: Use Foundry (see below)**

### Option 2: Foundry (Advanced)

1. Create a `.env` file:
\`\`\`
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
\`\`\`

2. Initialize Foundry project:
\`\`\`bash
forge init --no-commit
\`\`\`

3. Deploy:
\`\`\`bash
forge create --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  contracts/VideoPaywall.sol:VideoPaywall \
  --verify --etherscan-api-key $BASESCAN_API_KEY
\`\`\`

4. Update `lib/web3-config.ts` with deployed contract address

## Contract Functions

### Creator Functions
- `uploadVideo(string ipfsHash, uint256 price)` - Upload new video
- `deactivateVideo(uint256 videoId)` - Deactivate your video
- `getCreatorVideos(address creator)` - Get all videos by creator

### Viewer Functions
- `unlockVideo(uint256 videoId)` - Pay to unlock video
- `checkAccess(uint256 videoId, address viewer)` - Check if has access
- `getVideo(uint256 videoId)` - Get video details (IPFS hash only if has access)
- `getVideos(uint256 offset, uint256 limit)` - Browse all videos

### Platform Functions
- `withdrawPlatformFees()` - Withdraw accumulated fees (owner only)
- `getPlatformBalance()` - Check platform fee balance

## Testing Locally

Use Hardhat or Foundry for local testing:

\`\`\`bash
# Run tests
forge test

# Deploy to local network
anvil
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast
\`\`\`

## Gas Estimates
- Deployment: ~0.003-0.005 ETH on Base Sepolia
- Upload video: ~150k gas (~0.0001 ETH)
- Unlock video: ~80k gas (~0.00005 ETH)
- Check access: view function (free)

## After Deployment

1. Copy your contract address
2. Update `lib/web3-config.ts`:
   \`\`\`typescript
   export const CONTRACT_ADDRESS = "0xYourAddressHere";
   \`\`\`
3. Test by uploading a video from the creator dashboard
4. Verify contract on BaseScan (optional): https://sepolia.basescan.org
