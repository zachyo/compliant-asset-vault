# Product Requirements Document (PRD) for CompliantAssetVault

## 1. Product Overview

**Product Name:** CompliantAssetVault  
**Version:** 1.1 (Production-Ready MVP)  
**Description:** CompliantAssetVault is a privacy-focused decentralized vault built on the Mantle Network for tokenizing real-world assets (RWAs) such as invoices and bonds. It integrates zero-knowledge proofs for KYC (ZK-KYC) to ensure regulatory compliance while enabling seamless on-chain custody and yield distribution. Users can tokenize assets, manage custody, and distribute yields in a privacy-preserving manner, leveraging Mantle's modular Ethereum Layer 2 for low fees and high performance. For production-readiness, it incorporates oracles for dynamic data and registries for verifiability.  
**Objective:** Enhance the MVP for submission (with 2 weeks left) or post-hackathon production, targeting RWA/RealFi with real-world elements like oracle-fed yields and AML integration to demonstrate scalability beyond simulation.  
**Scope:** Build in 2 weeks, focusing on essential features for tokenization, ZK-KYC, custody, yield, plus production bridges (oracles, registries). Non-core features (e.g., IoT monitoring) out of scope.  
**Assumptions:** Development team has experience with Solidity, React, zk-SNARKs, and API integrations (e.g., Chainlink). Access to Mantle SDK, testnet, tools like Circom, and free-tier APIs (e.g., SumSub sandbox).  
**Dependencies:** Mantle Network (execution via Mantle SDK), zk-proof libraries (e.g., Circom or Semaphore), EVM-compatible wallets (e.g., MetaMask), oracles (Chainlink/DIA), AML providers (SumSub), registry tools (Centrifuge API).

## 2. Problem Statement

- **Pain Points:** Traditional RWA tokenization lacks privacy, compliance, dynamic valuation, and verifiability, exposing user data, risking regulatory issues, and causing liquidity mismatches. Yield distribution is often non-compliant/simulated, and on-chain custody is insecure without selective disclosure or real data feeds. Developers struggle with high fees and scalability on Ethereum mainnet.
- **Market Opportunity:** RWAs are booming (e.g., tokenized real estate market projected to reach $10T by 2030). Mantle's low-cost L2 is ideal for scaling compliant RealFi apps. Platforms like Plume and RealT succeed with oracles/registries for real ties to off-chain assets. Hackathon winners like Dobprotocol and HedStone blended compliance with on-chain innovation.
- **User Needs:** Asset owners need a secure way to tokenize and custody RWAs without full identity exposure, with verifiable real-world value. Investors seek compliant, dynamic yield access. Regulators require KYC/AML without compromising privacy, plus auditable registries.

## 3. Solution

CompliantAssetVault solves this by:

- Tokenizing RWAs into ERC-20/721 tokens on Mantle, with oracle-fed dynamic valuation.
- Using ZK-KYC for verifiable compliance without revealing full user data, enhanced with AML/KYB APIs.
- Enabling on-chain custody vaults with yield distribution mechanisms (e.g., staking tokenized assets for oracle-triggered yields).
- Ensuring all operations are EVM-compatible, low-fee, and scalable via Mantle's modular stack, with registries for traceability.

## 4. Target Audience

- **Primary Users:** Developers/builders in RealFi, asset tokenizers (e.g., invoice financiers, bond issuers), and yield farmers seeking compliant DeFi.
- **Secondary Users:** Hackathon judges/post-submission evaluators assessing RWA integration, compliance, and Mantle ecosystem value; potential partners like RWA issuers.
- **Personas:**
  - Alice: RWA owner (e.g., small business with invoices) wanting to tokenize for liquidity with real verification.
  - Bob: Investor looking for privacy-protected, dynamic yield on tokenized bonds.
  - Charlie: Regulator/auditor verifying compliance via ZK proofs and registries.

## 5. Key Features (MVP Prioritization)

Prioritize features for 2-week build: Core MVP must include tokenization, ZK-KYC, custody, yield, plus high-priority production tech (oracles, registries). Use MoSCoW method:

- **Must-Have (Core MVP):**
  - RWA Tokenization: Upload asset metadata (e.g., invoice PDF hash), mint tokenized asset on Mantle testnet, with basic registry entry.
  - ZK-KYC Integration: Off-chain KYC verification with zk-proof generation for on-chain selective disclosure, enhanced with AML/KYB API checks.
  - On-Chain Custody: Secure vault smart contract for locking tokenized assets.
  - Compliant Yield Distribution: Staking mechanism with oracle-triggered yields (e.g., Chainlink-fed real data instead of simulation).
  - Proof-of-Reserves: Basic oracle integration for asset verification.
- **Should-Have (If Time Allows):**
  - User Dashboard: Simple frontend for asset upload, KYC proof submission, yield claiming, and registry views.
  - Compliance Declaration: On-chain flag for regulated assets, plus verifiable credentials.
  - Liquidity Hooks: Basic DEX integration for token trading.
- **Could-Have:** Basic analytics (e.g., yield history with oracle data).
- **Won't-Have:** Multi-asset support, advanced privacy (e.g., mixer integration), mainnet deployment, full legal SPVs.

## 6. User Stories

- As Alice, I can upload an invoice metadata and tokenize it as an NFT/ERC-20 on Mantle with registry entry, so I gain verifiable on-chain liquidity.
- As Bob, I can submit a ZK-KYC proof (with AML check) to access the vault, ensuring my identity remains private.
- As Charlie, I can verify compliance and asset reserves via on-chain ZK proofs and oracles without seeing full user data.
- As a user, I can stake tokenized assets in the vault and claim dynamic yields compliantly via oracle feeds.

## 7. Success Metrics

- **Submission Winnability:** High scores on technical excellence (Mantle/oracle integration), real-world applicability (dynamic RWAs, compliance), and ecosystem potential (scalable RealFi with registries).
- **MVP Goals:** Functional demo on testnet, 3-5 min video showing end-to-end flow (including oracle updates), GitHub repo with README.
- **KPIs:** 100% uptime on testnet, <5s transaction times, successful ZK/oracle verification in demo, dynamic yield updates.
- **Risks:** Integration complexity (oracles/ZK)—mitigate with pre-built libraries. Time constraints—focus on must-haves. API rate limits—use sandboxes.

## 8. Timeline (2-Week Build)

- **Week 1:**
  - Days 1-2: Smart contract updates (tokenization + vault + basic registry).
  - Days 3-4: ZK-KYC circuit, verifier, and AML/KYB API integration.
  - Days 5-7: Oracle setup (Chainlink) for yields + PoR + testing.
- **Week 2:**
  - Days 8-10: Frontend dashboard + integrations (registry views, liquidity hooks if time).
  - Days 11-12: End-to-end testing, compliance enhancements.
  - Days 13-14: Demo video, pitch one-pager, GitHub setup with audit tool runs.  
    **Go-Live:** Deploy to Mantle testnet by end of Week 2.

## 9. Release Criteria

- All must-have features implemented and tested, including oracle/registry integrations.
- No critical bugs (e.g., failed token mints or oracle calls).
- Compliance with rules (e.g., disclose regulated assets); run basic security audits.

# Functional Requirements Document (FRD) for CompliantAssetVault

## 1. System Overview

CompliantAssetVault consists of:

- **Backend:** Solidity smart contracts on Mantle Network for tokenization, custody, yield, and registries.
- **ZK Layer:** Circom circuits for KYC proofs, with Groth16 verifier on-chain.
- **Frontend:** React app for user interactions, integrated with Web3.js or ethers.js.
- **Architecture:** Modular—tokenization contract, vault contract, ZK verifier, registry contract, oracle consumer. Use Mantle SDK for deployment and bridging.
- **Data Flow:** User uploads asset → Hash stored off-chain → Token minted + registry entry → ZK-KYC/AML proof submitted → Access vault → Stake for oracle-triggered yields.

## 2. Functional Requirements

### 2.1 RWA Tokenization

- **FR-1.1:** User uploads asset metadata (e.g., invoice details: amount, issuer, hash of PDF). System generates ERC-721 NFT or ERC-20 fungible token on Mantle testnet, adds to on-chain registry.
- **FR-1.2:** Input: Asset type (invoice/bond), value, metadata JSON. Output: Token ID, transaction hash, registry ID.
- **FR-1.3:** Integration: Use Mantle bridge for off-chain data; store hashes on-chain. Integrate Centrifuge API for registry if feasible.

### 2.2 ZK-KYC Integration

- **FR-2.1:** Off-chain: User completes KYC (simulated/real via SumSub form), generates ZK proof using Circom circuit (proves "user is verified" without revealing details).
- **FR-2.2:** On-chain: Submit proof to verifier contract; if valid, grant access token (e.g., soulbound NFT). Include AML/KYB checks.
- **FR-2.3:** Selective Disclosure: Proof reveals only compliance status (e.g., "over 18, non-sanctioned"). Negate with error if invalid. Support verifiable credentials.

### 2.3 On-Chain Custody

- **FR-3.1:** Vault contract locks tokenized assets via transferFrom.
- **FR-3.2:** Access Control: Only ZK-verified users can deposit/withdraw. Use Ownable or AccessControl from OpenZeppelin.
- **FR-3.3:** Events: Emit Deposit, Withdraw for frontend tracking.

### 2.4 Compliant Yield Distribution

- **FR-4.1:** Staking: Users stake tokenized assets in vault; earn yields (oracle-fed: e.g., Chainlink data for real USDT-like rewards based on asset value).
- **FR-4.2:** Compliance Check: Yield claim requires valid ZK-KYC/AML; flag regulated yields.
- **FR-4.3:** Calculation: Dynamic APY via oracles (e.g., NAV updates); distribute via claim function.

### 2.5 User Dashboard (Frontend)

- **FR-5.1:** Connect wallet, display tokenized assets/registry, submit ZK/AML proof, manage vault (deposit/claim).
- **FR-5.2:** UI Components: Forms for upload/KYC, buttons for actions, read-only views for yields/PoR.
- **FR-5.3:** Error Handling: Wallet disconnects, invalid proofs, oracle failures.

### 2.6 Compliance Declaration

- **FR-6.1:** On-chain boolean flag per asset: isRegulated. Users must acknowledge in pitch/demo.

### 2.7 Oracle and PoR Integration (New)

- **FR-7.1:** Consume Chainlink feeds for asset data (e.g., invoice value updates).
- **FR-7.2:** PoR: Oracle attests reserves; display in dashboard.
- **FR-7.3:** Triggers: Auto-update yields on oracle events.

### 2.8 Registry Integration (New)

- **FR-8.1:** On-chain contract to register assets with metadata and ownership proofs.
- **FR-8.2:** Query: Frontend views for traceability.

## 3. Non-Functional Requirements

- **Performance:** Transactions <0.01 USDT gas on Mantle; ZK proof generation <10s off-chain; oracle calls <5s.
- **Security:** Audit smart contracts for reentrancy (use Slither/MythX); use audited ZK/oracle libraries. Privacy via ZK.
- **Usability:** Intuitive UI; mobile-responsive.
- **Scalability:** Handle 100 concurrent users in demo (Mantle's high throughput); oracle scalability.
- **Testing:** Unit tests (Hardhat), integration tests (including oracles); cover 80% code.
- **Deployment:** Mantle testnet; include deployment scripts in GitHub.

## 4. Interfaces

- **API:** Smart contract ABIs for frontend; external APIs (Chainlink, SumSub).
- **External:** Mantle SDK for DA/bridges; IPFS for metadata; Centrifuge for registries.
