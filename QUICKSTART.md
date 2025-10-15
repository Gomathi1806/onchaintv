# 🚀 Quick Start Guide

Get your Creator Paywall app running in 5 steps:

## Step 1: Deploy Smart Contract

1. Install [Remix IDE](https://remix.ethereum.org) or use Hardhat
2. Copy `contracts/VideoPaywall.sol` to Remix
3. Compile with Solidity 0.8.20+
4. Deploy to **Base Sepolia Testnet**:
   - Network: Base Sepolia
   - RPC: `https://sepolia.base.org`
   - Chain ID: 84532
   - Get testnet ETH: [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

5. **Copy your deployed contract address**

## Step 2: Update Contract Address

Edit `lib/web3-config.ts`:

\`\`\`typescript
export const CONTRACT_ADDRESSES = {
  [baseSepolia.id]: "0xYOUR_CONTRACT_ADDRESS_HERE", // Paste your address
  [base.id]: "0x0000000000000000000000000000000000000000",
}
\`\`\`

## Step 3: Configure IPFS Uploads (Creators Only)

Creators need IPFS access to upload videos. Choose one option:

### Option A: User-Provided API Key (Easiest - No Setup)
1. Creators get their own free Pinata account at [pinata.cloud](https://pinata.cloud)
2. When uploading, paste their Pinata JWT in the upload form
3. No server configuration needed!

### Option B: Server-Side API Key (For Teams)
1. Get a Pinata JWT from [pinata.cloud](https://pinata.cloud)
2. Add to your environment:

**Local Development:**
\`\`\`bash
# .env.local (git-ignored)
PINATA_JWT=your_jwt_here
\`\`\`

**Production (Vercel):**
- Add `PINATA_JWT` in project settings → Environment Variables
- **Important:** Do NOT use `NEXT_PUBLIC_` prefix (security risk!)

## Step 4: Test Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000`

### Test Flow:
1. **Connect Wallet** (MetaMask, Coinbase Wallet, etc.)
2. **Switch to Base Sepolia** network
3. **Upload a Video** (Dashboard → Upload)
   - Add title, description, thumbnail
   - Set price (e.g., 0.001 ETH)
   - Upload video (stored on IPFS)
4. **View Marketplace** (Home page)
5. **Pay to Unlock** a video
6. **Watch** the unlocked content

## Step 5: Deploy to Vercel

\`\`\`bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Deploy to Vercel
# Click "Publish" button in v0 UI
# Or use Vercel CLI: vercel --prod
\`\`\`

### Add Environment Variables in Vercel:
- `NEXT_PUBLIC_PINATA_JWT` (optional - only for server-side uploads)

## Optional: WalletConnect Support

For mobile wallet support (Rainbow, Trust Wallet, etc.):

1. Get free Project ID: [cloud.reown.com](https://cloud.reown.com)
2. Add to Vercel env vars:
   \`\`\`
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   \`\`\`

**Note:** App works fine without WalletConnect - users can still use MetaMask, Coinbase Wallet, and browser wallets.

## Troubleshooting

### "Wrong Network" Error
- Switch to Base Sepolia in your wallet
- Network details: Chain ID 84532, RPC `https://sepolia.base.org`

### "Insufficient Funds"
- Get testnet ETH from [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

### Video Upload Fails
- Check Pinata API key is correct
- Ensure video is under 100MB
- Try a different IPFS provider (see `STORAGE_OPTIONS.md`)

### Contract Not Found
- Verify contract address in `lib/web3-config.ts`
- Ensure you're on the correct network (Base Sepolia)

## Next Steps

- **Go Live**: Deploy contract to Base mainnet
- **Custom Domain**: Add your domain in Vercel
- **Analytics**: Track views and earnings
- **Subscriptions**: Add monthly channel subscriptions (see `contracts/VideoPaywall.sol` for subscription functions)

## Architecture

\`\`\`
┌─────────────┐
│   Viewer    │
└──────┬──────┘
       │ 1. Browse videos
       │ 2. Pay 0.001 ETH
       ▼
┌─────────────────┐      ┌──────────────┐
│ Smart Contract  │◄────►│     IPFS     │
│  (Base Chain)   │      │   (Pinata)   │
└────────┬────────┘      └──────────────┘
         │ 3. Verify payment
         │ 4. Grant access
         ▼
┌─────────────────┐
│  Video Player   │
│  (IPFS Stream)  │
└─────────────────┘
\`\`\`

**Fully Decentralized:**
- ✅ No backend servers
- ✅ No database (all on-chain)
- ✅ No API keys for viewers
- ✅ Permissionless & censorship-resistant

---

**Need Help?** Check `DEPLOYMENT.md` for detailed deployment guide or `STORAGE_OPTIONS.md` for alternative IPFS providers.
