# Environment Variables Setup

## Important: RPC Configuration

The app uses Base's public RPC endpoints by default. No API keys needed!

For better performance (optional), you can use Alchemy, but it's not required.

## For Viewers (No Setup Required!)

Viewers don't need any environment variables. They just need:
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Some ETH on Base network for gas fees

## For Creators (Upload Videos)

Creators need Pinata for IPFS uploads:

### Pinata Setup (Server-Side - Secure)

1. Go to [pinata.cloud](https://pinata.cloud)
2. Create free account
3. Generate API JWT token
4. Add to Vercel Environment Variables:

\`\`\`
PINATA_JWT=your_jwt_token_here
\`\`\`

**Important:** Use `PINATA_JWT` (without `NEXT_PUBLIC_` prefix) to keep it server-side only.

## Deployment to Vercel

### Step 1: Deploy the App
1. Push your code to GitHub
2. Import to Vercel
3. Deploy (it will work for viewers immediately)

### Step 2: Add Environment Variables (Optional)

Go to Project Settings → Environment Variables and add:

**For Creator Uploads (Required for uploading videos):**
\`\`\`
PINATA_JWT=your_pinata_jwt
\`\`\`

### Step 3: Redeploy
After adding env vars, trigger a new deployment.

## Security Notes

✅ **Safe to expose (NEXT_PUBLIC_):**
- Smart contract addresses
- Public RPC endpoints
- WalletConnect Project IDs

❌ **Must be server-side only (no NEXT_PUBLIC_):**
- `PINATA_JWT` - Keeps upload API secure
- Any API keys or secrets
- Private keys (never store these anywhere!)

## Local Development

Create `.env.local` in your project root:

\`\`\`env
# Required for uploads only
PINATA_JWT=your_pinata_jwt_here
\`\`\`

Then run:
\`\`\`bash
npm install
npm run dev
\`\`\`

## Testing Without API Keys

You can test the entire viewer experience without any API keys:
1. The app uses public RPC by default
2. Viewers can browse and unlock videos
3. Only uploading requires Pinata JWT

## Getting Your API Keys

### Alchemy (Optional - Better Performance)
1. Go to [alchemy.com](https://alchemy.com)
2. Create free account
3. Create new app → Select "Base" network
4. Copy API key from dashboard

### Pinata (Required for Uploads)
1. Go to [pinata.cloud](https://pinata.cloud)
2. Create free account
3. Go to API Keys → New Key
4. Select "Admin" permissions
5. Copy the JWT token (starts with "eyJ...")

## Troubleshooting

**"Pinata JWT not configured" error:**
- Add `PINATA_JWT` to Vercel environment variables
- Make sure it's `PINATA_JWT` not `NEXT_PUBLIC_PINATA_JWT`
- Redeploy after adding
