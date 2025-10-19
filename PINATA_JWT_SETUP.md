# Pinata JWT Setup Guide

Your Pinata JWT token has been configured for the platform. Users will now be able to upload videos seamlessly without entering their own JWT.

## Environment Variable Configuration

The platform checks for the following environment variable names (in order):
1. `PINATA_JWT` (recommended)
2. `pinata_jwt` (fallback)

**Your JWT Token:**
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZTk2ZGQ0OS1mNzU4LTQ5OTMtOWRlOS1hN2JkMWM4YmViYTQiLCJlbWFpbCI6InRnb21hdGhpMTgwNkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMGIyZGNhYWFjODQ4MDRiNjdlNDYiLCJzY29wZWRLZXlTZWNyZXQiOiI0MGQ4OTYxOTk0MzBmOGMxYTBjMjA0ZjgzZjA1MTY3NjRlNmUwNThlNDM1NjhhMjFhOTliNjU4ZTY1MjJiM2EzIiwiZXhwIjoxNzg2MDE3ODkwfQ.P8cXyqIt_slBGqhz0VU41OudW_E8fpz0-1IdJWYtG-A
\`\`\`

## How to Add to Vercel

### Option 1: Using v0 Sidebar (Easiest)
1. Click the sidebar in v0 chat
2. Select "Vars" tab
3. Find or add `PINATA_JWT`
4. Paste the JWT token above
5. Save

### Option 2: Using Vercel Dashboard
1. Go to your project on Vercel
2. Navigate to Settings → Environment Variables
3. Add new variable:
   - **Name:** `PINATA_JWT`
   - **Value:** (paste the JWT token above)
   - **Environment:** Production, Preview, Development (select all)
4. Click "Save"
5. Redeploy your application

## How It Works

### For Users (Seamless Experience)
1. User clicks "Upload Video"
2. Selects video file
3. Video uploads automatically to IPFS via Pinata
4. No JWT required from user
5. Video is ready to publish

### For Platform Owner (You)
- Platform uses your Pinata account for all uploads
- All videos are stored under your Pinata account
- You can manage/view all uploads in Pinata dashboard
- Users never see or need Pinata credentials

## Fallback Behavior

If `PINATA_JWT` is not configured:
- Users will see: "Platform IPFS not configured"
- Users can click "Use My Pinata Account"
- Users enter their own JWT to upload
- This is a fallback for testing/development

## Verifying Configuration

After adding the environment variable:

1. **Redeploy your app** (Vercel needs to restart to load new env vars)
2. Try uploading a video
3. Check browser console for debug logs:
   - `[v0] PINATA_JWT configured: true` ✅ (Good!)
   - `[v0] PINATA_JWT configured: false` ❌ (Not configured)

## Troubleshooting

### Still seeing "Platform IPFS not configured"?

**Cause:** Environment variable not loaded yet

**Solution:**
1. Verify variable is added in Vercel dashboard
2. Redeploy the application (Settings → Deployments → Redeploy)
3. Wait for deployment to complete
4. Try uploading again

### Upload fails with 401 Unauthorized

**Cause:** Invalid or expired JWT token

**Solution:**
1. Go to [Pinata Dashboard](https://app.pinata.cloud)
2. Navigate to API Keys
3. Generate a new JWT token
4. Update `PINATA_JWT` environment variable
5. Redeploy

### Upload fails with 429 Too Many Requests

**Cause:** Pinata rate limit exceeded

**Solution:**
- Free tier: 100 uploads/month
- Upgrade Pinata plan for more uploads
- Or implement upload queuing

## Your Pinata Account Details

**API Key:** `0b2dcaaac84804b67e46`  
**API Secret:** `40d896199430f8c1a0c204f83f0516764e6e058e43568a21a99b658e6522b3a3`

**Note:** The JWT token is preferred over API Key/Secret for uploads. The code uses JWT authentication.

## Security Best Practices

✅ **DO:**
- Store JWT in environment variables (server-side only)
- Use Vercel's encrypted environment variables
- Rotate JWT tokens periodically
- Monitor Pinata usage in dashboard

❌ **DON'T:**
- Commit JWT to git/GitHub
- Expose JWT in client-side code
- Share JWT publicly
- Use same JWT for multiple projects

## Next Steps

1. Add `PINATA_JWT` to Vercel environment variables
2. Redeploy your application
3. Test video upload
4. Users can now upload seamlessly!

---

**JWT Expires:** January 2027 (check `exp` field in JWT)  
**Pinata Dashboard:** https://app.pinata.cloud  
**Support:** https://docs.pinata.cloud
