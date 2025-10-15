# Security Best Practices

## API Key Management

### For Creators (IPFS Uploads)

You have **two secure options** for uploading videos:

#### Option 1: User-Provided API Key (Recommended for Public Apps)
- Creators paste their own Pinata JWT when uploading
- No server configuration needed
- Each creator uses their own quota
- Most secure for public deployments

#### Option 2: Server-Side API Key (Recommended for Private/Team Apps)
- Add `PINATA_JWT` to your server environment variables
- API key never exposed to client
- Shared quota across all creators
- Convenient for trusted teams

### Environment Variables

**Server-Only Variables** (Secure):
\`\`\`bash
# .env.local (never commit this file)
PINATA_JWT=your_jwt_here
\`\`\`

**Never use `NEXT_PUBLIC_` prefix for sensitive keys** - this exposes them to the client!

### In Production (Vercel)

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `PINATA_JWT` (without `NEXT_PUBLIC_` prefix)
4. Select "Production" environment
5. Save and redeploy

## Smart Contract Security

### Platform Fee Management

Only the contract owner can:
- Withdraw platform fees
- Update the platform fee percentage
- Change the fee recipient address

**Best Practices:**
- Use a multisig wallet for the owner address
- Set reasonable fee limits (current: 6%)
- Regularly withdraw fees to secure storage

### Access Control

- Video access is verified on-chain
- Payment records are immutable
- No centralized database to hack
- Creators control their content

## Frontend Security

### Wallet Connection

- Never request private keys
- Use established wallet connectors (wagmi)
- Verify network before transactions
- Show clear transaction previews

### IPFS Content

- Videos are public once uploaded to IPFS
- Payment gates access, but content is technically accessible
- For truly private content, consider encryption
- Thumbnails and metadata are always public

## Deployment Checklist

- [ ] Remove all `NEXT_PUBLIC_` prefixes from sensitive keys
- [ ] Use server actions for API calls
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up proper CORS if using custom domains
- [ ] Use environment variables for all secrets
- [ ] Never commit `.env.local` to git
- [ ] Audit smart contract before mainnet deployment
- [ ] Use a hardware wallet for contract owner
- [ ] Set up monitoring for unusual activity

## Reporting Security Issues

If you discover a security vulnerability, please email security@yourapp.com (replace with your contact).

**Do not** open public issues for security vulnerabilities.
