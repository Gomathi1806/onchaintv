# Creator Paywall - Decentralized Video Platform

A Web3 video platform where creators upload videos to IPFS and set micro-fees for viewing. Built on Base L2 with smart contract payments.

## Features

- Upload videos to IPFS (decentralized storage)
- Set custom viewing prices in ETH
- Pay-to-unlock mechanism with 6% platform fee
- Creator dashboard with earnings tracking
- Video marketplace for discovery
- Wallet-based authentication

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS v4
- **Web3**: wagmi, viem, Base L2
- **Storage**: IPFS via Pinata
- **Smart Contract**: Solidity (VideoPaywall.sol)

## Getting Started

### Prerequisites

- Node.js 18+
- MetaMask or Coinbase Wallet

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### Optional: Platform-Managed IPFS Uploads

If you want to provide IPFS uploads for your users (instead of them using their own Pinata accounts), add a server-side environment variable:

\`\`\`bash
# .env.local (server-side only, NOT exposed to client)
PINATA_JWT=your_jwt_token_here
\`\`\`

**Note**: Without this, creators will paste their own Pinata JWT when uploading videos. This is more secure and decentralized.

## Smart Contract Deployment

See [contracts/README.md](contracts/README.md) for deployment instructions.

After deploying, update the contract address in `lib/web3-config.ts`.

## How It Works

### For Creators
1. Connect wallet
2. Upload video (stored on IPFS)
3. Set viewing price (e.g., 0.001 ETH)
4. Share video link
5. Earn 94% of each unlock (6% platform fee)

### For Viewers
1. Connect wallet
2. Browse videos
3. Pay micro-fee to unlock
4. Watch video instantly

## Project Structure

\`\`\`
├── app/                    # Next.js app router
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── video-upload.tsx   # Video upload component
│   └── video-player.tsx   # IPFS video player
├── contracts/             # Solidity smart contracts
│   └── VideoPaywall.sol   # Main paywall contract
├── hooks/                 # Custom React hooks
│   └── use-ipfs-upload.ts # IPFS upload hook
├── lib/                   # Utilities
│   ├── ipfs.ts           # IPFS integration
│   ├── web3-config.ts    # wagmi configuration
│   └── contract-abi.ts   # Contract ABI
└── public/               # Static assets
\`\`\`

## Roadmap

- [x] Smart contract with micropayments
- [x] IPFS integration
- [ ] Creator dashboard
- [ ] Video marketplace
- [ ] Channel subscriptions
- [ ] Referral rewards
- [ ] Top earners leaderboard

## License

MIT
