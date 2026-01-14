#!/bin/bash

# Script to update frontend contract ABIs after redeployment
# Run this from the contracts directory after deploying

echo "Updating frontend contract ABIs..."

# Define paths
CONTRACTS_DIR="/home/zarcc/Documents/GitHub/WEB3/hackathon/mantle/contracts"
FRONTEND_DIR="/home/zarcc/Documents/GitHub/WEB3/hackathon/mantle/frontend"

# Copy RWAAsset ABI
echo "Copying RWAAsset ABI..."
cp "$CONTRACTS_DIR/artifacts/contracts/RWAAsset.sol/RWAAsset.json" "$FRONTEND_DIR/src/contracts/RWAAsset.json"

# Copy CompliantAssetVault ABI
echo "Copying CompliantAssetVault ABI..."
cp "$CONTRACTS_DIR/artifacts/contracts/CompliantAssetVault.sol/CompliantAssetVault.json" "$FRONTEND_DIR/src/contracts/CompliantAssetVault.json"

# Copy KYCSBT ABI
echo "Copying KYCSBT ABI..."
cp "$CONTRACTS_DIR/artifacts/contracts/KYCSBT.sol/KYCSBT.json" "$FRONTEND_DIR/src/contracts/KYCSBT.json"

# Copy RWARegistry ABI
echo "Copying RWARegistry ABI..."
cp "$CONTRACTS_DIR/artifacts/contracts/RWARegistry.sol/RWARegistry.json" "$FRONTEND_DIR/src/contracts/RWARegistry.json"

# Copy MockYieldToken ABI
echo "Copying MockYieldToken ABI..."
cp "$CONTRACTS_DIR/artifacts/contracts/MockYieldToken.sol/MockYieldToken.json" "$FRONTEND_DIR/src/contracts/MockYieldToken.json"

# Copy Verifier ABI
echo "Copying Verifier ABI..."
cp "$CONTRACTS_DIR/artifacts/contracts/Verifier.sol/Groth16Verifier.json" "$FRONTEND_DIR/src/contracts/Groth16Verifier.json"

# Copy MockPriceFeed ABI
echo "Copying MockPriceFeed ABI..."
cp "$CONTRACTS_DIR/artifacts/contracts/MockPriceFeed.sol/MockPriceFeed.json" "$FRONTEND_DIR/src/contracts/MockPriceFeed.json"

# Copy RWAProofOfReserve ABI
echo "Copying RWAProofOfReserve ABI..."
cp "$CONTRACTS_DIR/artifacts/contracts/RWAProofOfReserve.sol/RWAProofOfReserve.json" "$FRONTEND_DIR/src/contracts/RWAProofOfReserve.json"

echo "✅ All contract ABIs updated successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy contracts: cd contracts && npx hardhat ignition deploy ./ignition/modules/CompliantAssetVault.ts --network mantle"
echo "2. Update contract addresses in: frontend/src/constants.ts"
echo "3. Run this script again if you redeploy: ./scripts/update-frontend-abis.sh"
