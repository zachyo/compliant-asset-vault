# ZK-KYC Circuits

This directory contains the Circom circuits for the CompliantAssetVault ZK-KYC system.

## Prerequisites

1. **Circom 2**: Install from [iden3/circom](https://github.com/iden3/circom).
2. **SnarkJS**: Installed via `npm install`.

## Circuit: kyc.circom

The circuit proves that a user knows a `secret` that hashes to a public `identityCommitment` using the Poseidon hash function.

## Workflow

1. **Compile the circuit**:

   ```bash
   npm run compile
   ```

2. **Power of Tau**:
   You need a `pot12_final.ptau` file. You can download one or generate it.

   ```bash
   snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
   snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
   snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
   ```

3. **Setup and Generate Verifier**:

   ```bash
   npm run setup
   npm run contribute
   npm run export-verifier
   ```

4. **Move Verifier to Contracts**:
   ```bash
   cp verifier.sol ../contracts/contracts/Verifier.sol
   ```
