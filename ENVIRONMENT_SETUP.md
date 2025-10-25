# Environment Variables Setup

This guide explains how to configure the required environment variables for the OnChainTV platform.

## Required Environment Variables

### PINATA_JWT (Required for Video Uploads)

The platform uses Pinata for IPFS storage. You need to add your Pinata JWT token as an environment variable.

#### Option 1: Platform-Wide Configuration (Recommended)

Add `NEXT_PUBLIC_PINATA_JWT` to your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `NEXT_PUBLIC_PINATA_JWT`
   - **Value**: Your Pinata JWT token (get it from [Pinata Dashboard](https://app.pinata.cloud/developers/api-keys))
   - **Environment**: Production, Preview, Development (select all)

4. Redeploy your application

**Why NEXT_PUBLIC_?** The `NEXT_PUBLIC_` prefix makes the variable available on the client-side, which is necessary for direct browser uploads to IPFS. This is safe because the JWT only has permissions to upload files, not delete or modify existing content.

#### Option 2: User-Provided JWT

If you don't want to configure a platform-wide JWT, users can provide their own Pinata JWT when uploading videos. The upload dialog will prompt them to enter their JWT if the platform JWT is not configured.

### Other Environment Variables

The following environment variables are already configured in your project:

- `PRIVATE_KEY` - Your wallet private key for contract interactions
- `pinata_jwt`, `pinata`, `pinata_secret` - Legacy Pinata configuration (not used)

## Getting Your Pinata JWT

1. Go to [Pinata Dashboard](https://app.pinata.cloud/)
2. Sign up or log in
3. Navigate to **API Keys** in the sidebar
4. Click **New Key**
5. Configure permissions:
   - ✅ **pinFileToIPFS** (required)
   - ✅ **pinJSONToIPFS** (optional)
   - ❌ Unpin (not needed)
6. Give it a name (e.g., "OnChainTV Production")
7. Click **Create Key**
8. Copy the JWT token (you won't be able to see it again!)

## Troubleshooting

### "Failed to communicate with server" Error

This error occurs when:
- `NEXT_PUBLIC_PINATA_JWT` is not set in environment variables
- The JWT is invalid or expired
- The file is too large (max 500MB)

**Solution**: Add `NEXT_PUBLIC_PINATA_JWT` to your Vercel environment variables and redeploy.

### "PINATA_JWT not configured" Error

This means the platform doesn't have a JWT configured. Users can either:
1. Ask the platform owner to add `NEXT_PUBLIC_PINATA_JWT`
2. Use their own Pinata account by clicking "Use My Pinata Account" in the upload dialog

## Security Notes

- The `NEXT_PUBLIC_PINATA_JWT` is safe to expose on the client-side because it only has upload permissions
- Never share your `PRIVATE_KEY` environment variable
- Regularly rotate your API keys for security
- Monitor your Pinata usage to detect any abuse
