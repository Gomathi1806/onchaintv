# Pre-Launch Checklist for OnChainTV

## Contract Verification
- [x] Contract deployed on Base Mainnet (Chain ID: 8453)
- [x] Contract address: `0xce69830d2f14584c368b362d41e9deb9b2e38b8c`
- [ ] Contract verified on BaseScan
- [ ] Contract ownership transferred to production wallet
- [ ] Platform fee set to 6% (600 BPS)

## Environment Variables
- [ ] `NEXT_PUBLIC_PINATA_JWT` - Set in Vercel production environment
- [ ] `PINATA_JWT` - Set for server-side uploads (optional)
- [ ] `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Set for WalletConnect support
- [ ] All environment variables tested in production

## Security Checks
- [ ] Pinata JWT regenerated (current one was exposed publicly)
- [ ] Smart contract audited or reviewed
- [ ] Rate limiting implemented for API routes
- [ ] CORS policies configured correctly
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF protection enabled

## Testing
- [ ] All unit tests passing (`npm run test`)
- [ ] All E2E tests passing (`npm run test:e2e`)
- [ ] Test coverage above 70% (`npm run test:coverage`)
- [ ] Manual testing completed:
  - [ ] Video upload flow (with platform JWT)
  - [ ] Video upload flow (with user's own JWT)
  - [ ] Video purchase flow
  - [ ] Creator earnings withdrawal
  - [ ] Platform fee withdrawal
  - [ ] Video sharing links
  - [ ] Referral system
  - [ ] Mobile responsiveness
  - [ ] Wallet connection (MetaMask, Coinbase Wallet, WalletConnect)

## Performance
- [ ] Lighthouse score > 90 for Performance
- [ ] Lighthouse score > 90 for Accessibility
- [ ] Lighthouse score > 90 for Best Practices
- [ ] Lighthouse score > 90 for SEO
- [ ] Images optimized and using Next.js Image component
- [ ] Code splitting implemented
- [ ] Bundle size analyzed and optimized

## Content & Legal
- [ ] Terms of Service page created
- [ ] Privacy Policy page created
- [ ] Cookie Policy page created
- [ ] DMCA takedown process documented
- [ ] Content moderation guidelines established
- [ ] Platform fee disclosure clear to users
- [ ] Creator payout terms documented

## Monitoring & Analytics
- [ ] Vercel Analytics enabled
- [ ] Error tracking set up (Sentry or similar)
- [ ] Contract event monitoring set up
- [ ] Uptime monitoring configured
- [ ] Performance monitoring enabled
- [ ] User analytics tracking (privacy-compliant)

## Infrastructure
- [ ] Domain configured and SSL enabled
- [ ] CDN configured for static assets
- [ ] Database backups configured (if applicable)
- [ ] Rate limiting on API endpoints
- [ ] DDoS protection enabled
- [ ] Vercel deployment configured for production

## User Experience
- [ ] Loading states for all async operations
- [ ] Error messages are user-friendly
- [ ] Success confirmations for all actions
- [ ] Help documentation created
- [ ] FAQ page created
- [ ] Contact/support page created
- [ ] Onboarding flow for new users

## Base Mini App Specific
- [ ] Farcaster integration tested
- [ ] Base Builder configuration verified
- [ ] Owner address correct: `0xB469223D231C1A0da6B18f9E8e3099364A846d68`
- [ ] Splash screen configured
- [ ] App metadata (name, description, icons) set

## Final Checks
- [ ] All console.log statements removed from production code
- [ ] All TODO comments addressed
- [ ] All deprecated dependencies updated
- [ ] Build succeeds without warnings
- [ ] No hardcoded secrets in code
- [ ] Git repository cleaned (no sensitive data)
- [ ] Backup of contract ABI and addresses saved
- [ ] Emergency pause mechanism tested (if applicable)

## Post-Launch
- [ ] Monitor first 24 hours closely
- [ ] Have rollback plan ready
- [ ] Customer support team briefed
- [ ] Social media announcements prepared
- [ ] Bug bounty program considered
- [ ] Community feedback channels set up

---

## Critical Issues to Address Before Launch

### 1. Security - Exposed Pinata JWT
**URGENT**: The Pinata JWT was shared publicly in chat. You MUST:
1. Go to https://app.pinata.cloud/developers/api-keys
2. Delete the exposed key
3. Generate a new JWT
4. Add it to Vercel as `NEXT_PUBLIC_PINATA_JWT`
5. Redeploy the application

### 2. Contract Verification
Verify your contract on BaseScan:
\`\`\`bash
# Visit: https://basescan.org/address/0xce69830d2f14584c368b362d41e9deb9b2e38b8c
# Click "Contract" tab → "Verify and Publish"
# Upload your contract source code and constructor arguments
\`\`\`

### 3. Testing
Run all tests before launch:
\`\`\`bash
npm run test:all
\`\`\`

### 4. Performance Audit
\`\`\`bash
npm run build
# Check bundle size and optimize if needed
\`\`\`

---

## Network Information

**Deployed Network**: Base Mainnet (Production)
- Chain ID: 8453
- Contract: `0xce69830d2f14584c368b362d41e9deb9b2e38b8c`
- Explorer: https://basescan.org
- RPC: https://mainnet.base.org

**Supported Features**:
- Video uploads to IPFS via Pinata
- On-chain video metadata and access control
- Creator earnings (94% of sales)
- Platform fees (6% of sales)
- Referral system
- Tips and subscriptions
- NFT-gated content
- Video bundles

**Revenue Streams**:
1. Platform Fee: 6% of all video sales
2. Collected automatically on each purchase
3. Withdrawable by platform owner via admin dashboard
