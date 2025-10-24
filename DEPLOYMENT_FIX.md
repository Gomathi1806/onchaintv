# Deployment Fix Guide

## Current Issue
Your Vercel deployment is failing because it's deploying from an old GitHub commit (`6e33097`) that has outdated code.

## The Fix is Ready
All code fixes are complete in your v0 workspace:
- `lib/ipfs.ts` now has `"use client"` directive (correct)
- All IPFS functions properly exported
- No `"use server"` directive causing errors

## How to Deploy the Fix

### Step 1: Push to GitHub
You MUST sync your v0 workspace to GitHub first:

1. Look at the **top-right corner** of the v0 interface
2. Find the **GitHub icon** (looks like the GitHub logo)
3. Click it
4. Select **"Push to GitHub"** or **"Sync to GitHub"**
5. Wait for the sync to complete

### Step 2: Verify Deployment
After pushing to GitHub:
1. Go to your Vercel dashboard
2. You should see a new deployment automatically triggered
3. The new deployment will use the updated code
4. Build should succeed

## Alternative: Manual Deployment

If the GitHub sync isn't working:

1. Click the **three dots menu** (⋮) in the top-right of v0
2. Select **"Download ZIP"**
3. Extract the ZIP file
4. Push the code to your GitHub repository manually:
   \`\`\`bash
   cd onchaintv
   git add .
   git commit -m "Fix IPFS module exports"
   git push origin main
   \`\`\`
5. Vercel will automatically detect and deploy

## What Was Fixed

The `lib/ipfs.ts` file now has:
\`\`\`typescript
"use client"  // <-- This line was added at the top

// ... rest of the code
\`\`\`

This tells Next.js that these are client-side utility functions, not Server Actions.

## Verification

After deployment succeeds, your site should:
- Load without build errors
- Display videos on the homepage
- Allow video uploads
- Show video details correctly

## Still Having Issues?

If you continue to see the same error after pushing to GitHub:
1. Check that the new commit appears in your GitHub repository
2. Verify Vercel is deploying the latest commit (not `6e33097`)
3. Try clearing Vercel's build cache in the deployment settings
