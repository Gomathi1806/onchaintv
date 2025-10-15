# Smart Contract Deployment Guide

## Option 1: Remix IDE (Recommended for Beginners)

### Step-by-Step Instructions

1. **Open Remix**
   - Go to https://remix.ethereum.org

2. **Create Contract File**
   - Create new file: `VideoPaywall.sol`
   - Copy the contract code from `contracts/VideoPaywall.sol`

3. **Compile Contract**
   - Go to "Solidity Compiler" tab (left sidebar)
   - Select compiler version: `0.8.20` or higher
   - Click "Compile VideoPaywall.sol"
   - Wait for green checkmark

4. **Configure Network**
   - Go to "Deploy & Run Transactions" tab
   - Environment: Select "Injected Provider - MetaMask"
   - MetaMask will popup - connect your wallet
   - **IMPORTANT**: Switch MetaMask to **Base Sepolia Testnet**
     - Network Name: Base Sepolia
     - RPC URL: https://sepolia.base.org
     - Chain ID: 84532
     - Currency: ETH
     - Block Explorer: https://sepolia.basescan.org

5. **Get Testnet ETH**
   - Go to https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
   - Or https://sepoliafaucet.com
   - Request testnet ETH (you need ~0.01 ETH for deployment)

6. **Deploy Contract**
   - Gas Limit: Set to **3000000** (3 million) - this is important!
   - Value: Leave at 0
   - Click "Deploy" button
   - **If timeout occurs:**
     - Increase gas limit to 5000000
     - Try again during off-peak hours
     - Use a different RPC endpoint

7. **Confirm Transaction**
   - MetaMask will popup
   - Review gas fees
   - Click "Confirm"
   - Wait 10-30 seconds for deployment

8. **Copy Contract Address**
   - After deployment, you'll see the contract under "Deployed Contracts"
   - Click the copy icon to copy the contract address
   - Save this address - you'll need it for the frontend!

### Troubleshooting Remix Timeout

If you get "Timeout for call deployMetadataOf" error:

**Solution 1: Increase Gas Limit**
\`\`\`
Gas Limit: 5000000 (instead of default)
\`\`\`

**Solution 2: Use Different RPC**
- Add custom RPC in MetaMask:
  - https://base-sepolia.blockpi.network/v1/rpc/public
  - https://sepolia.base.org

**Solution 3: Try Different Time**
- Network congestion varies by time of day
- Try early morning or late night UTC

**Solution 4: Use Hardhat (see below)**

---

## Option 2: Hardhat (For Advanced Users)

### Setup

\`\`\`bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
\`\`\`

### Create Deployment Script

Create `scripts/deploy.js`:

\`\`\`javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying VideoPaywall contract...");

  const VideoPaywall = await hre.ethers.getContractFactory("VideoPaywall");
  const videoPaywall = await VideoPaywall.deploy();

  await videoPaywall.waitForDeployment();

  const address = await videoPaywall.getAddress();
  console.log("VideoPaywall deployed to:", address);
  console.log("\nUpdate lib/web3-config.ts with this address!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
\`\`\`

### Configure Hardhat

Edit `hardhat.config.js`:

\`\`\`javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY], // Add your private key to .env
      chainId: 84532,
    },
  },
};
\`\`\`

### Deploy

\`\`\`bash
npx hardhat run scripts/deploy.js --network baseSepolia
\`\`\`

---

## Option 3: Foundry (Fastest)

\`\`\`bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Deploy
forge create VideoPaywall \
  --rpc-url https://sepolia.base.org \
  --private-key YOUR_PRIVATE_KEY
\`\`\`

---

## After Deployment

1. **Copy the contract address**
2. **Update frontend configuration:**

Edit `lib/web3-config.ts`:

\`\`\`typescript
export const CONTRACT_ADDRESS = "0xYourContractAddressHere";
\`\`\`

3. **Verify contract on BaseScan (optional):**
   - Go to https://sepolia.basescan.org
   - Search for your contract address
   - Click "Verify and Publish"
   - Follow the verification wizard

4. **Test the contract:**
   - Upload a test video
   - Try unlocking it with a different wallet
   - Verify IPFS hash is returned after payment

---

## Gas Costs Estimate

- **Deployment**: ~0.003-0.005 ETH on Base Sepolia
- **Upload Video**: ~0.0001 ETH per video
- **Unlock Video**: ~0.00005 ETH per unlock

Base L2 is much cheaper than Ethereum mainnet!

---

## Need Help?

- Remix timeout? Increase gas limit to 5000000
- Out of gas? Get more testnet ETH from faucet
- Wrong network? Switch MetaMask to Base Sepolia (Chain ID: 84532)
- Contract not deploying? Try different RPC endpoint
