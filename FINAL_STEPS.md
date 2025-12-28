# Final Steps & Deployment Guide

Follow these instructions to finalize the **CompliantAssetVault** project and deploy it to the Mantle Sepolia Testnet.

## 1. Smart Contract Deployment

### Setup Environment

1. Navigate to the `contracts` directory:
   ```bash
   cd contracts
   ```
2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Add your `PRIVATE_KEY` and ensure the `MANTLE_SEPOLIA_RPC` is correct.

### Deploy

Run the deployment script using Hardhat Ignition:

```bash
npm run deploy:mantle
```

_Note the addresses of the deployed contracts from the terminal output._

### Sync ABIs

Export the ABIs to the frontend:

```bash
npm run export-abi
```

---

## 2. ZK-KYC Circuit Setup

The ZK circuits must be compiled locally to generate the necessary WASM and ZKey files.

1. Navigate to the `circuits` directory:
   ```bash
   cd circuits
   ```
2. Run the automated setup script (requires `circom` installed):
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
3. Move the generated files to the frontend public directory:
   ```bash
   mkdir -p ../frontend/public/zk
   cp kyc_js/kyc.wasm ../frontend/public/zk/
   cp kyc_final.zkey ../frontend/public/zk/
   ```

---

## 3. Frontend Configuration

1. Open `frontend/src/constants.ts`.
2. Update the `CONTRACT_ADDRESSES` with the addresses from Step 1.
3. (Optional) Update the `projectId` in `frontend/src/providers/Web3Provider.tsx` with your own from [Reown Cloud](https://cloud.reown.com/).

---

## 4. Run the Application

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 5. Verification Checklist

- [ ] Wallet connects via Reown AppKit (WalletConnect).
- [ ] ZK-Proof generates successfully in the "Compliance" tab.
- [ ] Assets can be minted in the "Tokenize" tab.
- [ ] Assets can be deposited into the Vault (requires KYC SBT).
- [ ] Yield (MYT) is accruing and can be claimed.

---

## 6. Future Enhancements (Post-Hackathon)

### Yield History & Analytics

- **Dashboard Sparklines**: Integrate a mini-chart next to the "Yield Earned" stat to show 24h/7d performance.
- **Dedicated Analytics Page**: Create a new tab for deep-dive analytics:
  - Historical APY trends.
  - Cumulative yield earned over time.
  - Detailed transaction log (Deposits, Withdrawals, Claims).
- **Subgraphs**: Deploy a Mantle Subgraph to index historical events for faster and more detailed data retrieval.
