# Product Requirements Document (PRD) for CompliantAssetVault

## 1. Product Overview
**Product Name:** CompliantAssetVault  
**Version:** 1.0 (MVP)  
**Description:** CompliantAssetVault is a privacy-focused decentralized vault built on the Mantle Network for tokenizing real-world assets (RWAs) such as invoices and bonds. It integrates zero-knowledge proofs for KYC (ZK-KYC) to ensure regulatory compliance while enabling seamless on-chain custody and yield distribution. Users can tokenize assets, manage custody, and distribute yields in a privacy-preserving manner, leveraging Mantle's modular Ethereum Layer 2 for low fees and high performance.  
**Objective:** Create a winnable MVP for the Mantle Global Hackathon 2025, targeting the RWA/RealFi track (top priority). The MVP must demonstrate core functionality via a working demo on Mantle testnet, with compliance features to highlight real-world applicability.  
**Scope:** MVP to be built in 2 weeks, focusing on essential features for tokenization, ZK-KYC verification, custody, and basic yield distribution. Non-core features (e.g., advanced analytics) are out of scope.  
**Assumptions:** Development team has experience with Solidity, React, and zk-SNARKs libraries. Access to Mantle SDK, testnet, and tools like Circom for ZK proofs.  
**Dependencies:** Mantle Network (execution via Mantle SDK), zk-proof libraries (e.g., Circom or Semaphore), EVM-compatible wallets (e.g., MetaMask).  

## 2. Problem Statement
- **Pain Points:** Traditional RWA tokenization lacks privacy and compliance, exposing user data and risking regulatory issues. Yield distribution is often non-compliant, and on-chain custody is insecure without selective disclosure. Developers struggle with high fees and scalability on Ethereum mainnet.  
- **Market Opportunity:** RWAs are booming (e.g., tokenized real estate market projected to reach $10T by 2030). Mantle's low-cost L2 is ideal for scaling compliant RealFi apps. Hackathon winners like Dobprotocol and HedStone succeeded by blending compliance with on-chain innovation.  
- **User Needs:** Asset owners need a secure way to tokenize and custody RWAs without full identity exposure. Investors seek compliant yield access. Regulators require KYC without compromising privacy.  

## 3. Solution
CompliantAssetVault solves this by:  
- Tokenizing RWAs into ERC-20/721 tokens on Mantle.  
- Using ZK-KYC for verifiable compliance without revealing full user data.  
- Enabling on-chain custody vaults with yield distribution mechanisms (e.g., staking tokenized assets for yields).  
- Ensuring all operations are EVM-compatible, low-fee, and scalable via Mantle's modular stack.  

## 4. Target Audience
- **Primary Users:** Developers/builders in RealFi, asset tokenizers (e.g., invoice financiers, bond issuers), and yield farmers seeking compliant DeFi.  
- **Secondary Users:** Hackathon judges evaluating RWA integration, compliance, and Mantle ecosystem value.  
- **Personas:**  
  - Alice: RWA owner (e.g., small business with invoices) wanting to tokenize for liquidity.  
  - Bob: Investor looking for privacy-protected yield on tokenized bonds.  
  - Charlie: Regulator/auditor verifying compliance via ZK proofs.  

## 5. Key Features (MVP Prioritization)
Prioritize features for 2-week build: Core MVP must include tokenization, ZK-KYC, basic custody, and yield demo. Use MoSCoW method:  
- **Must-Have (Core MVP):**  
  - RWA Tokenization: Upload asset metadata (e.g., invoice PDF hash), mint tokenized asset on Mantle testnet.  
  - ZK-KYC Integration: Off-chain KYC verification with zk-proof generation for on-chain selective disclosure.  
  - On-Chain Custody: Secure vault smart contract for locking tokenized assets.  
  - Compliant Yield Distribution: Basic staking mechanism to distribute yields (e.g., simulated USDT rewards) to verified users.  
- **Should-Have (If Time Allows):**  
  - User Dashboard: Simple frontend for asset upload, KYC proof submission, and yield claiming.  
  - Compliance Declaration: On-chain flag for regulated assets.  
- **Could-Have:** Basic analytics (e.g., yield history).  
- **Won't-Have:** Multi-asset support, advanced privacy (e.g., mixer integration), mainnet deployment.  

## 6. User Stories
- As Alice, I can upload an invoice metadata and tokenize it as an NFT/ERC-20 on Mantle, so I gain on-chain liquidity.  
- As Bob, I can submit a ZK-KYC proof to access the vault, ensuring my identity remains private.  
- As Charlie, I can verify compliance via on-chain ZK proofs without seeing full user data.  
- As a user, I can stake tokenized assets in the vault and claim yields compliantly.  

## 7. Success Metrics
- **Hackathon Winnability:** High scores on technical excellence (Mantle integration), real-world applicability (RWA compliance), and ecosystem potential (scalable RealFi).  
- **MVP Goals:** Functional demo on testnet, 3-5 min video showing end-to-end flow, GitHub repo with README.  
- **KPIs:** 100% uptime on testnet, <5s transaction times, successful ZK verification in demo.  
- **Risks:** ZK integration complexity—mitigate with pre-built libraries. Time constraints—focus on must-haves.  

## 8. Timeline (2-Week Build)
- **Week 1:**  
  - Days 1-2: Smart contract development (tokenization + vault).  
  - Days 3-4: ZK-KYC circuit and verifier.  
  - Days 5-7: Yield distribution logic + testing.  
- **Week 2:**  
  - Days 8-10: Frontend dashboard + integration.  
  - Days 11-12: End-to-end testing, compliance declaration.  
  - Days 13-14: Demo video, pitch one-pager, GitHub setup.  
**Go-Live:** Deploy to Mantle testnet by end of Week 2.  

## 9. Release Criteria
- All must-have features implemented and tested.  
- No critical bugs (e.g., failed token mints).  
- Compliance with hackathon rules (e.g., disclose regulated assets).  

# Functional Requirements Document (FRD) for CompliantAssetVault

## 1. System Overview
CompliantAssetVault consists of:  
- **Backend:** Solidity smart contracts on Mantle Network for tokenization, custody, and yield.  
- **ZK Layer:** Circom circuits for KYC proofs, with Groth16 verifier on-chain.  
- **Frontend:** React app for user interactions, integrated with Web3.js or ethers.js.  
- **Architecture:** Modular—tokenization contract, vault contract, ZK verifier contract. Use Mantle SDK for deployment and bridging.  
- **Data Flow:** User uploads asset → Hash stored off-chain → Token minted → ZK-KYC proof submitted → Access vault → Stake for yields.  

## 2. Functional Requirements
### 2.1 RWA Tokenization
- **FR-1.1:** User uploads asset metadata (e.g., invoice details: amount, issuer, hash of PDF). System generates ERC-721 NFT or ERC-20 fungible token on Mantle testnet.  
- **FR-1.2:** Input: Asset type (invoice/bond), value, metadata JSON. Output: Token ID, transaction hash.  
- **FR-1.3:** Integration: Use Mantle bridge for any off-chain data if needed; store hashes on-chain for immutability.  

### 2.2 ZK-KYC Integration
- **FR-2.1:** Off-chain: User completes KYC (simulated via form), generates ZK proof using Circom circuit (proves "user is verified" without revealing details).  
- **FR-2.2:** On-chain: Submit proof to verifier contract; if valid, grant access token (e.g., soulbound NFT).  
- **FR-2.3:** Selective Disclosure: Proof reveals only compliance status (e.g., "over 18, non-sanctioned"). Negate with error if invalid.  

### 2.3 On-Chain Custody
- **FR-3.1:** Vault contract locks tokenized assets via transferFrom.  
- **FR-3.2:** Access Control: Only ZK-verified users can deposit/withdraw. Use Ownable or AccessControl from OpenZeppelin.  
- **FR-3.3:** Events: Emit Deposit, Withdraw for frontend tracking.  

### 2.4 Compliant Yield Distribution
- **FR-4.1:** Staking: Users stake tokenized assets in vault; earn yields (simulated: distribute test USDT based on stake duration).  
- **FR-4.2:** Compliance Check: Yield claim requires valid ZK-KYC; flag regulated yields.  
- **FR-4.3:** Calculation: Simple APY (e.g., 5% simulated); distribute via claim function.  

### 2.5 User Dashboard (Frontend)
- **FR-5.1:** Connect wallet, display tokenized assets, submit ZK proof, manage vault (deposit/claim).  
- **FR-5.2:** UI Components: Forms for upload/KYC, buttons for actions, read-only views for yields.  
- **FR-5.3:** Error Handling: Wallet disconnects, invalid proofs.  

### 2.6 Compliance Declaration
- **FR-6.1:** On-chain boolean flag per asset: isRegulated. Users must acknowledge in pitch/demo.  

## 3. Non-Functional Requirements
- **Performance:** Transactions <0.01 USDT gas on Mantle; ZK proof generation <10s off-chain.  
- **Security:** Audit smart contracts for reentrancy; use audited ZK libraries. Privacy via ZK.  
- **Usability:** Intuitive UI; mobile-responsive.  
- **Scalability:** Handle 100 concurrent users in demo (Mantle's high throughput).  
- **Testing:** Unit tests (Hardhat), integration tests; cover 80% code.  
- **Deployment:** Mantle testnet; include deployment scripts in GitHub.  

## 4. Interfaces
- **API:** Smart contract ABIs for frontend.  
- **External:** Mantle SDK for DA/bridges; IPFS for metadata storage if needed.  

This PRD/FRD provides a blueprint for a 2-week MVP build, focusing on hackathon-winning elements like RWA compliance and Mantle integration. Feed this directly to your agent for implementation.
