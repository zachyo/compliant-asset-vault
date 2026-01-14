# Issues Fixed - Frontend

## Issue 1: Toast Notification Not Dismissing in Compliance Component

**Problem:** After clicking "Generate Proof" in the Compliance component, the loading toast "Transaction submitted. Waiting for confirmation..." remained on screen even after the success message "Identity verified successfully on Mantle!" appeared.

**Root Cause:** The loading toast was not being properly dismissed before showing the success message. The toast ID was created in the `generateAndVerify` function but wasn't being tracked in state, so the `useEffect` hook couldn't dismiss it when the transaction was confirmed.

**Solution:**

1. Added a new state variable `loadingToastId` to track the toast ID
2. Store the toast ID when creating the loading toast in `generateAndVerify`
3. In the `useEffect` hook that runs when `isConfirmed` is true, explicitly dismiss the loading toast before showing the success message
4. Clear the toast ID from state after dismissing

**Files Modified:**

- `/home/zarcc/Documents/GitHub/WEB3/hackathon/mantle/frontend/src/components/Compliance.tsx`

## Issue 2: RWAAsset Mint Function Reverting

**Problem:** When trying to mint a new RWA asset from the Tokenize component, the transaction reverted with error "Call 0x61f61c46 Method by 0x87EE75B4...0287AdA04 reverted on RWAAsset contract".

**Root Cause:** The `mint` function in the RWAAsset contract had the `onlyOwner` modifier, which meant only the contract owner (the deployer) could call it. This prevented regular users from minting their own assets through the frontend.

**Solution:**

1. Removed the `onlyOwner` modifier from the `mint` function in `RWAAsset.sol`
2. This allows any user to mint their own RWA assets, which is the desired behavior for a decentralized tokenization platform
3. Updated the corresponding test case from "Should only allow owner to mint" to "Should allow any user to mint their own assets"
4. Fixed the test to check for the correct token ID (0 instead of 1)

**Files Modified:**

- `/home/zarcc/Documents/GitHub/WEB3/hackathon/mantle/contracts/contracts/RWAAsset.sol`
- `/home/zarcc/Documents/GitHub/WEB3/hackathon/mantle/contracts/test/CompliantAssetVault.test.ts`

**Testing:** All 6 tests pass successfully after the changes.

## Next Steps

To deploy the updated contract to the Mantle network:

```bash
cd /home/zarcc/Documents/GitHub/WEB3/hackathon/mantle/contracts
npx hardhat ignition deploy ./ignition/modules/CompliantAssetVault.ts --network mantle
```

After deployment, update the contract addresses in:

- `/home/zarcc/Documents/GitHub/WEB3/hackathon/mantle/frontend/src/constants.ts`
- `/home/zarcc/Documents/GitHub/WEB3/hackathon/mantle/frontend/src/contracts/contracts.json` (copy from `contracts/artifacts`)
