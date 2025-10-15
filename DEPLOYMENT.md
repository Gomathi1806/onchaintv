# Deployment Guide

## ✅ Contract Deployed!

Your VideoPaywall contract is live on **Base Mainnet**:
- **Address**: `0xc809c90c8b4b0bc8b6ae0ac3679d8b67651dbfac`
- **Network**: Base (Chain ID: 8453)
- **Explorer**: [View on BaseScan](https://basescan.org/address/0xc809c90c8b4b0bc8b6ae0ac3679d8b67651dbfac)

The frontend is already configured to use this contract!

## Prerequisites

1. **Wallet Setup**
   - Install MetaMask or Coinbase Wallet
   - Get Base Sepolia testnet ETH from [faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

2. **Pinata Account**
   - Sign up at [pinata.cloud](https://pinata.cloud)
   - Get API keys or JWT token

3. **WalletConnect (Optional)**
   - Create project at [cloud.walletconnect.com](https://cloud.walletconnect.com)

## Step 1: Deploy Smart Contract

### Using Foundry

\`\`\`bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Initialize project
cd contracts
forge init --no-commit

# Create .env file
cat > .env << EOF
PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
EOF

# Deploy to Base Sepolia
forge create --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  contracts/VideoPaywall.sol:VideoPaywall \
  --verify --etherscan-api-key $BASESCAN_API_KEY
\`\`\`

### Using Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file `VideoPaywall.sol`
3. Copy contract code from `contracts/VideoPaywall.sol`
4. Compile with Solidity 0.8.20
5. Deploy to Base Sepolia using Injected Provider (MetaMask)
6. Copy deployed contract address

## Step 2: Configure Frontend

The contract address is already configured in `lib/web3-config.ts`:

\`\`\`typescript
export const CONTRACT_ADDRESSES = {
  [baseSepolia.id]: "0x0000000000000000000000000000000000000000",
  [base.id]: "0xc809c90c8b4b0bc8b6ae0ac3679d8b67651dbfac", // ✅ Deployed!
} as const
\`\`\`

## Step 3: Environment Variables (Optional)

The app works without any environment variables! Creators paste their own Pinata JWT when uploading.

### Optional: Platform-Managed Uploads

If you want to provide IPFS uploads for creators, add server-side env var:

\`\`\`bash
# .env.local (server-side only)
PINATA_JWT=your_jwt_token_here

# WalletConnect (optional, for mobile wallet support)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
\`\`\`

**Important**: Never use `NEXT_PUBLIC_` prefix for API keys - it exposes them to the client!

## Step 4: Deploy to Vercel

### Option 1: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables
5. Deploy

### Option 2: Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

# Deploy to production
vercel --prod
\`\`\`

## Step 5: Test the Platform

1. **Connect Wallet**
   - Visit your deployed site
   - Connect MetaMask/Coinbase Wallet
   - Switch to **Base Mainnet** network
   - Ensure you have real ETH on Base

2. **Upload Video**
   - Go to Dashboard
   - Click "Upload Video"
   - Select video file (max 500MB)
   - Set price (e.g., 0.001 ETH)
   - Confirm transaction

3. **Unlock Video**
   - Browse marketplace
   - Click on a video
   - Click "Unlock" button
   - Confirm payment transaction
   - Watch video

## Mainnet Deployment

When ready for production:

1. Deploy contract to Base mainnet
2. Update contract address in `lib/web3-config.ts`
3. Use production Pinata account
4. Test thoroughly on testnet first
5. Deploy frontend to production

## Production Checklist

- [x] Contract deployed to Base mainnet
- [x] Contract verified on BaseScan
- [x] Frontend configured with contract address
- [ ] Test upload and payment flow (creators use their own Pinata JWT)
- [ ] Deploy frontend to Vercel
- [ ] Set up custom domain (optional)

## Important Notes

**You're on Mainnet!** This means:
- All transactions use real ETH
- Videos are permanently stored on IPFS
- Payments go directly to creators
- Platform fees accumulate in the contract

**Next Steps:**
1. Get Pinata JWT for video uploads (free tier available)
2. Deploy frontend to Vercel
3. Test with small amounts first
4. Share with creators!

## Troubleshooting

### Contract Issues
- Verify contract on Basescan
- Check gas limits
- Ensure sufficient ETH balance

### IPFS Upload Fails
- Creators need their own Pinata JWT (free at pinata.cloud)
- Or add server-side PINATA_JWT env var for platform-managed uploads
- Verify file size < 500MB
- Check network connection

### Transaction Fails
- Check wallet has enough ETH
- Verify correct network (Base Sepolia)
- Check contract address is correct

## Security Checklist

- [x] API keys not exposed in frontend (no NEXT_PUBLIC_ prefix)
- [ ] Contract audited (for mainnet)
- [ ] Environment variables secured
- [ ] Rate limiting on IPFS uploads
- [ ] Input validation on all forms
- [ ] Access control properly implemented
