# Testing Guide for OnChainTV

## Running Tests

### Unit Tests
\`\`\`bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
\`\`\`

### E2E Tests
\`\`\`bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific test file
npm run test:e2e -- tests/e2e/complete-flow.spec.ts
\`\`\`

### Run All Tests
\`\`\`bash
npm run test:all
\`\`\`

## Test Structure

### Unit Tests (`tests/unit/`)
- `ipfs.test.ts` - IPFS utility functions
- `web3-config.test.ts` - Web3 configuration and fee calculations

### Integration Tests (`tests/integration/`)
- `video-upload.test.tsx` - Video upload flow
- Component interaction tests

### E2E Tests (`tests/e2e/`)
- `complete-flow.spec.ts` - Full user journeys
- Cross-browser testing

## Manual Testing Checklist

### Video Upload Flow
1. Connect wallet
2. Navigate to dashboard
3. Click "Upload Video"
4. Choose Pinata JWT option (platform or own)
5. Select video file (test with various formats and sizes)
6. Upload to IPFS
7. Fill in video details (title, description, price)
8. Publish to blockchain
9. Verify video appears in dashboard
10. Check video is accessible via share link

### Video Purchase Flow
1. Browse videos on homepage
2. Click on a video
3. Click "Unlock Video"
4. Approve transaction in wallet
5. Wait for confirmation
6. Verify video plays
7. Check creator earnings updated
8. Check platform fee collected

### Creator Earnings
1. Navigate to dashboard
2. Check earnings display correctly
3. Click "Withdraw Earnings"
4. Approve transaction
5. Verify funds received in wallet
6. Check earnings reset to 0

### Platform Admin
1. Connect with owner wallet
2. Navigate to admin dashboard
3. Check platform fees displayed
4. Click "Withdraw Platform Fees"
5. Approve transaction
6. Verify funds received

### Share Links
1. Upload and publish a video
2. Click "Share" button
3. Copy share link
4. Open link in incognito/private window
5. Verify video details shown
6. Verify "Unlock" button appears for non-owners
7. Test social media share buttons

## Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Chrome (iOS & Android)
- Mobile Safari (iOS)

## Wallet Testing

Test with:
- MetaMask
- Coinbase Wallet
- WalletConnect
- Rainbow Wallet

## Network Testing

Test on:
- Base Mainnet (production)
- Base Sepolia (testnet - for development)

## Performance Testing

1. Run Lighthouse audit
2. Check Core Web Vitals
3. Test with slow 3G network
4. Test with large video files (up to 500MB)
5. Test with many videos (100+)

## Security Testing

1. Test with invalid IPFS hashes
2. Test with malicious file uploads
3. Test transaction replay attacks
4. Test unauthorized access attempts
5. Test XSS vulnerabilities
6. Test CSRF vulnerabilities

## Accessibility Testing

1. Test with screen reader
2. Test keyboard navigation
3. Test color contrast
4. Test with browser zoom (200%)
5. Test with reduced motion preference

## Error Scenarios

Test error handling for:
- Network failures
- Transaction rejections
- Insufficient gas
- Invalid inputs
- IPFS upload failures
- Contract reverts
- Wallet disconnections
