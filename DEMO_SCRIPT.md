# Product Demo Script: CompliantAssetVault (Production-Ready)

**Duration:** 3 - 5 Minutes  
**Target:** Mantle Global Hackathon Judges  
**Theme:** Privacy-focused RWA Tokenization & Yield with Chainlink Oracles
**Key Tech:** Mantle Network, ZK-Proofs (Circom), Chainlink (Oracles & PoR)

---

## 0:00 - 0:45 | Introduction & Problem Statement

- **Visual:** Show the Dashboard with the "Not Verified" status and the **Proof of Reserve** card showing live reserves.
- **Script:** "Hi, I'm [Name], and today I'm presenting CompliantAssetVault. Real-world assets are the next frontier for DeFi, but they face two massive hurdles: the conflict between **regulatory compliance and user privacy**, and the need for **verifiable off-chain transparency**. CompliantAssetVault solves this on the Mantle Network by combining Zero-Knowledge Proofs for KYC with Chainlink Oracles for real-time asset verification."

## 0:45 - 1:30 | ZK-KYC & AML Verification

- **Visual:** Navigate to the **Compliance** tab. Enter a secret and click "Generate ZK Proof".
- **Script:** "First, let's look at compliance. Instead of doxing my identity on-chain, I generate a ZK-proof locally. In this production-ready version, we've integrated **AML and KYB checks** via SumSub APIs. The proof confirms I'm a verified, non-sanctioned entity without revealing my private data. Watch as we submit the proof to Mantle. Once verified, I receive a Soulbound Token that grants me compliant access to the entire ecosystem."

## 1:30 - 2:15 | RWA Tokenization & On-Chain Registry

- **Visual:** Navigate to the **Tokenize Asset** tab. Fill in details for an "Invoice #8821" worth $12,000. Click "Mint".
- **Script:** "Now that I'm verified, I can tokenize assets. I'm converting a real-world invoice into a compliant NFT. Unlike basic tokens, every asset here is recorded in our **On-Chain RWA Registry**, ensuring full traceability of metadata, value, and regulation status. This asset is now a liquid, verifiable representation of real-world value on Mantle."

## 2:15 - 3:30 | Asset Vault, Dynamic Yield & Proof of Reserve

- **Visual:** Navigate to the **Asset Vault** tab. Deposit the minted NFT. Point to the "Current APY" and the "Proof of Reserve" card on the Dashboard.
- **Script:** "With my tokenized asset, I can enter the Vault. But here's where it gets production-ready. We've integrated **Chainlink Oracles** to replace simulated yields with **dynamic yield rates** based on real-time market data.

(Navigate back to Dashboard)
Look at our **Proof of Reserve** card. Using Chainlink PoR, we provide verifiable transparency that every tokenized asset on Mantle is 100% backed by off-chain reserves. You can see our live collateral ratio here. This isn't just a simulation; it's a trustless bridge between Real-World Assets and DeFi."

## 3:30 - 4:15 | Conclusion & Technical Stack

- **Visual:** Show the **Dashboard** again, now with "Identity Verified", "Staked Assets", and the "Verified Reserves" status.
- **Script:** "CompliantAssetVault is built on Mantle's high-performance L2, leveraging Circom for ZK-privacy and Chainlink for oracle-driven trust. We've moved beyond the MVP by implementing a verifiable registry, dynamic yields, and Proof of Reserve. We are building the future of compliant, private, and transparent RealFi. Thank you."

---

### 💡 Pro-Tips for the Video:

1.  **Highlight the "Live" Indicators:** When showing the Proof of Reserve card, mention that the "Live" pulse indicates real-time oracle heartbeats.
2.  **Mention Mantle Modularity:** Briefly note how Mantle's modular stack allows us to store complex RWA metadata hashes efficiently.
3.  **The "Wow" Moment:** The transition from "Not Verified" to "Identity Verified" after the ZK-proof is your strongest visual hook—don't rush it!
