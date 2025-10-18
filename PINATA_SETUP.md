# Pinata JWT Setup Guide

## Why Do Users Need to Enter JWT?

**Short Answer:** They DON'T need to if you configure the platform properly!

## How It Works

### Option 1: Platform-Managed (Recommended)

The platform stores ONE Pinata JWT in environment variables. All users upload through the platform's account.

**Advantages:**
- Users never see or enter JWT tokens
- Seamless upload experience (like YouTube)
- Platform controls storage
- One account to manage

**Setup:**
1. Create a Pinata account at [pinata.cloud](https://pinata.cloud)
2. Generate a JWT token from API Keys section
3. Add to your environment variables:

\`\`\`bash
# .env.local (for local development)
PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel (for production)
# Go to Project Settings → Environment Variables
# Add: PINATA_JWT = your_jwt_token
\`\`\`

4. Redeploy your app
5. Done! Users can now upload without entering any JWT

### Option 2: User-Managed (Fallback)

Each creator uses their own Pinata account and provides their JWT when uploading.

**Advantages:**
- No platform configuration needed
- Each creator manages their own storage
- More decentralized

**Disadvantages:**
- Users need to create Pinata accounts
- More friction in upload process
- Users need to understand IPFS/Pinata

**How It Works:**
- If `PINATA_JWT` is not configured, the upload dialog shows a JWT input field
- Users paste their own JWT token
- Upload happens directly from their browser to Pinata
- JWT is never stored, only used for that upload

## Current Behavior

The app automatically tries **Option 1** first (server-side with `PINATA_JWT`).

If that fails (JWT not configured), it falls back to **Option 2** (asks user for JWT).

## Recommended Setup

For a production platform, use **Option 1**:

1. Add `PINATA_JWT` to Vercel environment variables
2. Users upload seamlessly without any configuration
3. Platform manages all IPFS storage

## Security Notes

- `PINATA_JWT` is server-side only (no `NEXT_PUBLIC_` prefix)
- User-provided JWTs are used directly from browser (never sent to your server)
- Both methods are secure

## Troubleshooting

**"PINATA_JWT not configured" error:**
- Add the environment variable to Vercel
- Make sure it's `PINATA_JWT` not `NEXT_PUBLIC_PINATA_JWT`
- Redeploy after adding

**Users still being asked for JWT:**
- Check that `PINATA_JWT` is set in production environment
- Verify the JWT is valid (test it at pinata.cloud)
- Check server logs for upload errors

## Cost Considerations

**Pinata Free Tier:**
- 1 GB storage
- 100 GB bandwidth/month
- Unlimited pins

For a small platform, the free tier is sufficient. For larger platforms, consider Pinata's paid plans or alternative IPFS providers.
