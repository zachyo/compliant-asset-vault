# CompliantAssetVault

**Privacy-focused RWA Tokenization & Yield on Mantle Network**

CompliantAssetVault is a decentralized platform built for the **Mantle Global Hackathon 2025**. It enables users to tokenize real-world assets (RWAs) like invoices and bonds while maintaining privacy through **Zero-Knowledge KYC (ZK-KYC)**.

![Dashboard Preview](https://via.placeholder.com/800x450?text=CompliantAssetVault+Dashboard)

## 🌟 Key Features

- **ZK-KYC Verification**: Prove compliance (non-sanctioned, age, etc.) without revealing personal identity using Circom-based ZK-proofs.
- **RWA Tokenization**: Mint ERC-721 tokens representing real-world assets with on-chain regulation flags.
- **Compliant Yield Vault**: Stake tokenized assets in a secure vault to earn yields, accessible only to ZK-verified users.
- **Soulbound Compliance**: Verified users receive a non-transferable KYC Soulbound Token (KYCSBT) for seamless ecosystem access.
- **Premium UI**: A mature, dark-themed dashboard built with Tailwind CSS 4 and Reown AppKit.

## 🏗️ Technical Stack

- **Blockchain**: Mantle Sepolia Testnet
- **Smart Contracts**: Solidity (Hardhat, OpenZeppelin)
- **ZK-Proofs**: Circom, SnarkJS (Groth16)
- **Frontend**: React, TypeScript, Vite, Tailwind CSS 4
- **Web3 Library**: Wagmi, Viem, Reown AppKit (WalletConnect)

## 📁 Project Structure

```text
├── circuits/           # ZK-KYC Circom circuits and setup scripts
├── contracts/          # Solidity smart contracts and deployment modules
├── frontend/           # React dashboard and ZK integration
└── README.md           # Project overview
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+)
- Circom (for circuit compilation)
- A Mantle Sepolia wallet with test MNT

### Installation

1.  **Clone the repo**:

    ```bash
    git clone https://github.com/your-repo/mantle-rwa-vault
    cd mantle-rwa-vault
    ```

2.  **Setup Contracts**:

    ```bash
    cd contracts
    npm install
    npx hardhat compile
    ```

3.  **Setup Frontend**:
    ```bash
    cd frontend
    npm install --legacy-peer-deps
    npm run dev
    ```

## � Deployment

### 1. Smart Contracts

1. Navigate to the `contracts` directory and install dependencies:
   ```bash
   cd contracts
   npm install
   ```
2. Configure your environment variables in a `.env` file:
   ```env
   PRIVATE_KEY=your_private_key
   MANTLE_SEPOLIA_RPC=https://rpc.sepolia.mantle.xyz
   ```
3. Deploy to Mantle Sepolia:
   ```bash
   npm run deploy:mantle
   ```
4. Export ABIs to the frontend:
   ```bash
   npm run export-abi
   ```

### 2. ZK Circuits

1. Navigate to the `circuits` directory and run the setup script (requires `circom`):
   ```bash
   cd circuits
   chmod +x setup.sh
   ./setup.sh
   ```
2. Move the generated WASM and ZKey files to `frontend/public/zk/`.

### 📍 Deployed Contract Addresses (Mantle Sepolia)

- **CompliantAssetVault**: `0x...`
- **RWAAsset**: `0x...`
- **KYCSBT**: `0x...`
- **MockYieldToken**: `0x...`
- **Verifier**: `0x...`

## 👥 Team

- **[Your Name]**: Full-stack Developer with [X] years of experience in Web3. Previously built [Project Name].
  - [Twitter](https://twitter.com/yourhandle) | [LinkedIn](https://linkedin.com/in/yourprofile) | [GitHub](https://github.com/yourhandle)
  - **Contact**: [email@example.com] | Discord: [yourhandle]

## 📜 Documentation

- 👉 **[FINAL_STEPS.md](./FINAL_STEPS.md)**: Detailed technical setup.
- 👉 **[PITCH.md](./PITCH.md)**: Business model, problem/solution, and roadmap.
- 👉 **[DEMO_SCRIPT.md](./DEMO_SCRIPT.md)**: 3-5 minute product walkthrough.

## ⚖️ License

This project is licensed under the MIT License.
