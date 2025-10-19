# Environment Variables Setup

Your platform needs the `PINATA_JWT` environment variable to handle video uploads automatically.

## Quick Setup

### In v0 (Current Preview)

1. Click the **sidebar icon** on the left
2. Select **"Vars"** from the menu
3. Click **"Add Variable"**
4. Enter:
   - **Name:** `PINATA_JWT`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MGU3OTg2OS0wMzdhLTQ3Y2UtYWE0Yi0zNWMyZDAzOTlmZjgiLCJlbWFpbCI6ImdydW1zMjA4NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYWMwMDllNzI5MjlkM2JjYjQ2YmYiLCJzY29wZWRLZXlTZWNyZXQiOiIzYmEyYjU5OGY0MTUyZmE4YTJjZWJkZGVmNGYzNzllYzJkZjgyODllY2FiMTVhZDUyNWY5YWQyYTYwOWM3MWU5IiwiZXhwIjoxNzkyMTgxODA1fQ.6jo6EF25lXO8kQUavA4EpX3rOCtN4Pj73ozAwTbWJ5M`
5. Click **"Save"**

### In Vercel (After Deployment)

1. Go to your project at [vercel.com](https://vercel.com)
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in sidebar
4. Click **"Add New"**
5. Enter:
   - **Key:** `PINATA_JWT`
   - **Value:** Your Pinata JWT token (see above)
   - **Environment:** Select all (Production, Preview, Development)
6. Click **"Save"**
7. **Redeploy** your app for changes to take effect

## How It Works

### With PINATA_JWT Configured (Recommended)

- Users upload videos through your platform
- Platform handles IPFS upload automatically using your Pinata account
- Users never see or need to know about Pinata
- Seamless experience like YouTube or Vimeo

### Without PINATA_JWT (Fallback)

- Users are prompted to enter their own Pinata JWT
- Each user needs their own Pinata account
- More friction, less user-friendly
- Only use for testing or if you don't want to pay for storage

## Why This Approach?

**Platform-Managed Storage (Recommended):**
- Better user experience
- You control the storage
- Consistent performance
- Professional platform feel

**User-Managed Storage (Fallback):**
- No storage costs for you
- Users need technical knowledge
- Inconsistent experience
- Not recommended for production

## Verifying It Works

After adding the environment variable:

1. Refresh your app
2. Try uploading a video
3. You should NOT see the "Platform IPFS not configured" error
4. Upload should work automatically without asking for JWT

## Troubleshooting

**Still seeing "Platform IPFS not configured"?**

1. Make sure you added the variable in the correct environment (Production/Preview)
2. Redeploy your app after adding the variable
3. Check the browser console for `[v0]` debug logs
4. Verify the JWT token is valid on [Pinata Dashboard](https://app.pinata.cloud)

**Upload fails with "Unauthorized"?**

- Your Pinata JWT may have expired
- Generate a new JWT from Pinata Dashboard
- Update the environment variable

**Upload is slow?**

- Large videos take time to upload to IPFS
- Consider adding a file size limit
- Show progress indicator to users

## Security Notes

- Never commit JWT tokens to git
- Only store in environment variables
- Rotate tokens periodically
- Monitor Pinata usage to prevent abuse

## Your Pinata Credentials

For reference, your Pinata account details:

- **API Key:** `ac009e72929d3bcb46bf`
- **API Secret:** `3ba2b598f4152fa8a2cebddef4f379ec2df8289ecab15ad525f9ad2a609c71e9`
- **JWT:** (See above - this is what you need to add)

**Important:** Only the JWT is needed for uploads. Keep these credentials secure!
