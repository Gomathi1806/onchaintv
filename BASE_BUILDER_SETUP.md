# Base Builder Configuration

Your Creator Paywall app is now registered as a **Base Builder app**!

## Configuration

**Owner Address**: `0xB469223D231C1A0da6B18f9E8e3099364A846d68`

This address is registered in `package.json` under the `baseBuilder` configuration and identifies you as the app owner on the Base Builder platform.

## What This Enables

### Base Builder Features
- **App Discovery**: Your app appears in the Base Builder app directory
- **Verified Ownership**: Your owner address proves you control this app
- **Builder Rewards**: Eligible for Base Builder incentive programs
- **Analytics**: Access to Base Builder analytics dashboard
- **Community**: Join the Base Builder developer community

### Already Configured
- ✅ PWA manifest for mobile installation
- ✅ Base mainnet and testnet support
- ✅ Coinbase Wallet integration
- ✅ Mobile-responsive design
- ✅ Smart contract deployed on Base: `0xce69830d2f14584c368b362d41e9deb9b2e38b8c`

## Deployment Checklist

### 1. Deploy to Production
\`\`\`bash
# Deploy to Vercel (recommended)
vercel --prod

# Or deploy to your preferred hosting
npm run build
\`\`\`

### 2. Add App Icons
Create and add these icons to `/public`:
- `icon-192.png` - 192x192px app icon
- `icon-512.png` - 512x512px app icon
- `favicon.ico` - Standard favicon

### 3. Update Manifest URLs
Edit `/public/manifest.json` and `/public/.well-known/farcaster.json`:
- Replace placeholder URLs with your production domain
- Update icon URLs
- Update splash screen URLs

### 4. Register on Base Builder
1. Visit [Base Builder Portal](https://base.org/builder)
2. Connect wallet with address: `0xB469223D231C1A0da6B18f9E8e3099364A846d68`
3. Submit your app URL
4. Verify ownership via package.json

### 5. Test Mini App Features
- [ ] Test in Coinbase Wallet mobile browser
- [ ] Test PWA installation on iOS/Android
- [ ] Test wallet connection flow
- [ ] Test video upload and purchase
- [ ] Verify smart contract interactions

## Smart Contract Details

**Deployed Contract**: `0xce69830d2f14584c368b362d41e9deb9b2e38b8c` (Base Mainnet)

**Features**:
- Video uploads with IPFS storage
- Micro-payment system (pay-per-view)
- Subscription tiers (Bronze/Silver/Gold)
- Tipping system
- Content bundles
- Referral program
- NFT-gated content

**Platform Fee**: 6% on all transactions

## Environment Variables

Ensure these are set in your production environment:

\`\`\`bash
# Required
PINATA_JWT=your_pinata_jwt_token

# Optional
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
FARCASTER_WEBHOOK_SECRET=your_webhook_secret
\`\`\`

## Testing Your Base Builder App

### On Desktop
1. Visit your deployed URL
2. Connect Coinbase Wallet browser extension
3. Test all features

### On Mobile
1. Open Coinbase Wallet app
2. Navigate to your app URL in the in-app browser
3. App auto-detects Base mini app context
4. Test wallet connection and transactions

### As PWA
1. Visit your app in mobile browser (Safari/Chrome)
2. Tap "Add to Home Screen"
3. Open from home screen (runs in standalone mode)
4. Test offline capabilities

## Resources

- [Base Builder Docs](https://docs.base.org/builder)
- [Base Mini Apps Guide](https://docs.base.org/mini-apps)
- [OnchainKit Documentation](https://onchainkit.xyz)
- [Coinbase Wallet Integration](https://docs.cloud.coinbase.com/wallet-sdk/docs)

## Support

- **Base Discord**: [discord.gg/buildonbase](https://discord.gg/buildonbase)
- **Base Builder Support**: builder@base.org
- **Contract Address**: `0xce69830d2f14584c368b362d41e9deb9b2e38b8c`
- **Owner Address**: `0xB469223D231C1A0da6B18f9E8e3099364A846d68`

## Next Steps

1. Deploy your app to production
2. Add custom app icons
3. Register on Base Builder portal
4. Share your app with the Base community
5. Apply for Base Builder grants/incentives

Your Creator Paywall platform is ready for the Base ecosystem! 🎉
