#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting ZK-KYC Setup..."

# 1. Compile the circuit
echo "📦 Compiling kyc.circom..."
if ! command -v circom &> /dev/null
then
    echo "❌ Error: 'circom' is not installed. Please install it from https://github.com/iden3/circom"
    exit 1
fi

circom kyc.circom --r1cs --wasm --sym

# 2. Download Power of Tau (if not exists)
if [ ! -f "pot12_final.ptau" ]; then
    echo "📥 Downloading Power of Tau file..."
    curl -L https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau -o pot12_final.ptau
fi

# 3. Groth16 Setup
echo "🛠️ Performing Groth16 setup..."
npx snarkjs groth16 setup kyc.r1cs pot12_final.ptau kyc_0000.zkey

# 4. Contribute to phase 2
echo "✍️ Contributing to phase 2..."
npx snarkjs zkey contribute kyc_0000.zkey kyc_final.zkey --name="First contribution" -v -e="random entropy"

# 5. Export verification key
echo "🔑 Exporting verification key..."
npx snarkjs zkey export verificationkey kyc_final.zkey verification_key.json

# 6. Generate Solidity Verifier
echo "📄 Generating Solidity verifier..."
npx snarkjs zkey export solidityverifier kyc_final.zkey verifier.sol

# 7. Copy Verifier to Contracts
echo "🚚 Copying verifier to contracts..."
cp verifier.sol ../contracts/contracts/Verifier.sol

echo "✅ ZK-KYC Setup Complete!"
