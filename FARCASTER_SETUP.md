# Farcaster Mini App Setup

Your Creator Paywall platform is configured as a Farcaster Frame and Mini App.

## Current Configuration

**Splash Background Color:** `#000000` (Black)

This color is used for:
- PWA splash screen when app launches
- Farcaster frame background
- Loading states in mobile apps

## Farcaster JSON Location

The Farcaster configuration is located at:
\`\`\`
/public/.well-known/farcaster.json
\`\`\`

This file is automatically served at:
\`\`\`
https://your-domain.com/.well-known/farcaster.json
\`\`\`

## Configuration Details

### Account Association
- **Owner Address:** `0xB469223D231C1A0da6B18f9E8e3099364A846d68`
- **Type:** Custody wallet
- **Domain:** Your deployment domain

### Frame Configuration
- **Name:** Creator Paywall
- **Version:** next (latest Farcaster Frame spec)
- **Icon:** 512x512 PNG icon
- **Splash Background:** Black (#000000)
- **Home URL:** Your app's homepage
- **Webhook:** `/api/farcaster/webhook` for frame interactions

## Setup Steps

### 1. Update Domain URLs

Replace `your-domain.com` in the following files with your actual domain:

**In `public/.well-known/farcaster.json`:**
\`\`\`json
{
  "frame": {
    "iconUrl": "https://YOUR-DOMAIN.com/icon-512.png",
    "homeUrl": "https://YOUR-DOMAIN.com",
    "imageUrl": "https://YOUR-DOMAIN.com/og-image.png",
    "splashImageUrl": "https://YOUR-DOMAIN.com/splash.png",
    "webhookUrl": "https://YOUR-DOMAIN.com/api/farcaster/webhook"
  }
}
\`\`\`

### 2. Generate Account Association

To properly link your Farcaster account:

1. Go to [Farcaster Developer Portal](https://warpcast.com/~/developers)
2. Create a new app
3. Generate the account association signature
4. Update the `accountAssociation` section in `farcaster.json`

### 3. Create Required Images

Create these images in your `/public` folder:

**Icon (512x512):**
- File: `/public/icon-512.png`
- Size: 512x512 pixels
- Format: PNG with transparency
- Purpose: App icon in Farcaster

**Splash Image (1200x630):**
- File: `/public/splash.png`
- Size: 1200x630 pixels (recommended)
- Format: PNG or JPG
- Purpose: Loading screen image

**OG Image (1200x630):**
- File: `/public/og-image.png`
- Size: 1200x630 pixels
- Format: PNG or JPG
- Purpose: Social media preview

### 4. Deploy to Vercel

\`\`\`bash
# Deploy your app
vercel --prod

# Your Farcaster JSON will be available at:
# https://your-domain.vercel.app/.well-known/farcaster.json
\`\`\`

### 5. Register on Farcaster

1. Visit [Warpcast Developer Portal](https://warpcast.com/~/developers)
2. Click "Register Frame"
3. Enter your domain: `https://your-domain.vercel.app`
4. Verify the `.well-known/farcaster.json` is accessible
5. Submit for approval

## Testing Your Farcaster Frame

### Test in Warpcast

1. Open Warpcast mobile app
2. Create a cast with your domain URL
3. The frame should render with your splash screen
4. Test interactions (upload, view videos, etc.)

### Test Locally

\`\`\`bash
# Start dev server
npm run dev

# Visit in browser
http://localhost:3000/.well-known/farcaster.json

# Should return valid JSON
\`\`\`

### Validate Configuration

Use the Farcaster Frame Validator:
\`\`\`
https://warpcast.com/~/developers/frames
\`\`\`

Enter your domain and check for errors.

## Customizing Splash Background Color

To change the splash background color from black to another color:

**1. Update PWA Manifest (`/public/manifest.json`):**
\`\`\`json
{
  "background_color": "#YOUR_COLOR",
  "theme_color": "#YOUR_COLOR"
}
\`\`\`

**2. Update Farcaster Config (`/public/.well-known/farcaster.json`):**
\`\`\`json
{
  "frame": {
    "splashBackgroundColor": "#YOUR_COLOR"
  }
}
\`\`\`

**3. Update App Layout (`/app/layout.tsx`):**
\`\`\`tsx
<meta name="theme-color" content="#YOUR_COLOR" />
\`\`\`

### Recommended Colors

- **Black:** `#000000` (current) - Professional, high contrast
- **Blue:** `#3b82f6` - Matches your theme color
- **Dark Gray:** `#1a1a1a` - Softer than black
- **Brand Color:** Use your primary brand color

## Webhook Setup (Optional)

If you want to handle Farcaster frame interactions:

**Create `/app/api/farcaster/webhook/route.ts`:**
\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  
  // Handle frame button clicks
  console.log('Farcaster interaction:', body)
  
  return NextResponse.json({ success: true })
}
\`\`\`

## Features Available in Farcaster

Your Creator Paywall platform works fully in Farcaster with:

- Video browsing and discovery
- Crypto payments via Coinbase Wallet
- Creator profiles and channels
- Subscription management
- Tipping and social features
- Mobile-optimized UI

## Troubleshooting

### Frame Not Showing
- Verify `.well-known/farcaster.json` is accessible
- Check all URLs use HTTPS (not HTTP)
- Ensure images are publicly accessible
- Validate JSON syntax

### Images Not Loading
- Check image URLs are absolute (not relative)
- Verify images are in `/public` folder
- Test image URLs in browser
- Check file sizes (keep under 1MB)

### Account Association Failed
- Regenerate signature in Farcaster portal
- Verify owner address matches
- Check domain matches deployment URL

## Support

- Farcaster Docs: https://docs.farcaster.xyz
- Warpcast Developers: https://warpcast.com/~/developers
- Base Docs: https://docs.base.org

Your Creator Paywall platform is now ready for Farcaster!
