# Mini App Setup Guide

Your Creator Paywall app is now compatible with both **Farcaster Mini Apps** and **Base Mini Apps**!

## 🎯 Features Added

### Farcaster Mini App Support
- ✅ Farcaster SDK integration
- ✅ User context (FID, username, profile)
- ✅ Compose cast functionality
- ✅ Native share integration
- ✅ Farcaster manifest file

### Base Mini App Support
- ✅ OnchainKit integration
- ✅ Coinbase Wallet optimization
- ✅ Mobile-first responsive design
- ✅ PWA capabilities

### Progressive Web App (PWA)
- ✅ Web app manifest
- ✅ Mobile optimization
- ✅ Installable on home screen
- ✅ Offline-ready structure

## 📱 Testing Your Mini App

### Test in Farcaster

1. **Enable Developer Mode**
   - Go to https://farcaster.xyz/~/settings/developer-tools
   - Toggle on "Developer Mode"

2. **Update Manifest**
   - Edit `public/.well-known/farcaster.json`
   - Replace URLs with your deployed domain
   - Add your account association signature

3. **Deploy Your App**
   - Deploy to Vercel or your hosting provider
   - Ensure the manifest is accessible at `https://your-domain.com/.well-known/farcaster.json`

4. **Test in Warpcast**
   - Open Warpcast mobile app
   - Navigate to your mini app URL
   - The app will load in mini app mode

### Test as Base Mini App

1. **Install Coinbase Wallet**
   - Download Coinbase Wallet mobile app
   - Create or import a wallet

2. **Access Your App**
   - Open your deployed app URL in Coinbase Wallet browser
   - The app will detect Base mini app context

3. **Test Features**
   - Connect wallet (should use Coinbase Wallet)
   - Upload videos
   - Purchase videos with Base ETH

## 🔧 Configuration

### Environment Variables

No additional environment variables needed! The app auto-detects mini app context.

Optional for enhanced features:
\`\`\`bash
# Farcaster webhook for notifications (optional)
FARCASTER_WEBHOOK_SECRET=your_webhook_secret
\`\`\`

### Manifest Customization

**Farcaster Manifest** (`public/.well-known/farcaster.json`):
- Update `homeUrl` with your domain
- Update `iconUrl` with your app icon (192x192 PNG)
- Update `splashImageUrl` with splash screen (1200x630 PNG)
- Add account association signature

**PWA Manifest** (`public/manifest.json`):
- Already configured with your app details
- Add custom icons to `/public/icon-192.png` and `/public/icon-512.png`

## 🎨 Icons Required

Create and add these icons to your `/public` folder:

1. **icon-192.png** - 192x192px app icon
2. **icon-512.png** - 512x512px app icon
3. **splash.png** - 1200x630px splash screen for Farcaster
4. **favicon.ico** - Standard favicon

## 🚀 Deployment Checklist

- [ ] Deploy app to production (Vercel recommended)
- [ ] Add app icons (192px, 512px)
- [ ] Update Farcaster manifest with production URLs
- [ ] Test in Warpcast mobile app
- [ ] Test in Coinbase Wallet browser
- [ ] Verify PWA installation works
- [ ] Test share functionality

## 📚 Resources

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz/docs)
- [Base Mini Apps Guide](https://docs.base.org/mini-apps)
- [OnchainKit Documentation](https://onchainkit.xyz)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

## 🎯 Next Steps

1. **Customize Icons**: Replace placeholder icons with your brand
2. **Test Thoroughly**: Test on both Farcaster and Base platforms
3. **Add Analytics**: Track mini app usage separately
4. **Optimize Performance**: Ensure fast load times on mobile
5. **Add Deep Links**: Support direct video links in mini apps

Your app is now ready for the decentralized social ecosystem! 🎉
