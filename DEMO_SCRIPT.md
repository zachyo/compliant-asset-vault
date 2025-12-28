# Product Demo Script: CompliantAssetVault

**Duration:** 3 - 5 Minutes  
**Target:** Mantle Global Hackathon Judges  
**Theme:** Privacy-focused RWA Tokenization & Yield

---

## 0:00 - 0:45 | Introduction & Problem Statement

- **Visual:** Show the Dashboard with the "Not Verified" status.
- **Script:** "Hi, I'm [Name], and today I'm presenting CompliantAssetVault. Real-world assets are coming on-chain, but they face a massive hurdle: the conflict between regulatory compliance and user privacy. Current solutions often require users to dox their entire identity on-chain just to access a yield-bearing vault. CompliantAssetVault solves this on the Mantle Network by using Zero-Knowledge Proofs for KYC."

## 0:45 - 1:30 | ZK-KYC Verification (The "Wow" Factor)

- **Visual:** Navigate to the **Compliance** tab. Enter a secret and click "Generate ZK Proof".
- **Script:** "First, let's look at compliance. Instead of uploading my passport to a smart contract, I generate a ZK-proof locally in my browser. This proof confirms I meet the requirements—like being non-sanctioned—without revealing my personal data. Watch as we generate the proof off-chain and submit it to Mantle. Once verified, I receive a Soulbound Token that acts as my digital passport for the ecosystem."

## 1:30 - 2:30 | RWA Tokenization

- **Visual:** Navigate to the **Tokenize Asset** tab. Fill in details for an "Invoice #8821" worth $12,000. Click "Mint".
- **Script:** "Now that I'm verified, I can tokenize assets. Here, I'm converting a real-world invoice into a compliant NFT on Mantle. I can specify if the asset is regulated, which triggers different compliance flags. This asset is now a liquid, on-chain representation of real-world value, secured by Mantle's modular L2 performance."

## 2:30 - 3:30 | The Asset Vault & Yield

- **Visual:** Navigate to the **Asset Vault** tab. Show the "Available to Stake" list. Deposit the minted NFT.
- **Script:** "With my tokenized asset, I can now enter the Vault. Because I have my KYC Soulbound Token, the vault permits my deposit. By staking my invoice, I'm providing liquidity and earning yield in Mock Yield Tokens. You can see the yield accruing in real-time. This demonstrates a full-cycle RealFi application: from private verification to asset tokenization and finally, compliant yield generation."

## 3:30 - 4:00 | Conclusion & Technical Stack

- **Visual:** Show the **Dashboard** again, now with "Identity Verified" and "Staked Assets".
- **Script:** "CompliantAssetVault is built using Circom for ZK circuits, Hardhat for Mantle smart contracts, and a premium React frontend integrated with Reown AppKit. We leverage Mantle's low fees and high throughput to make RWA management seamless. Thank you for watching."

---

### 💡 Pro-Tips for the Video:

1.  **Use a Screen Recorder:** Use tools like Loom or OBS.
2.  **Highlight Mantle:** Mention how Mantle's modularity helps with the data availability of RWA metadata.
3.  **Show the Wallet:** Make sure the Reown/WalletConnect modal is visible when you connect.
