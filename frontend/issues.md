# Issues

## ✅ RESOLVED

1. ~~in compliance component, when i click on generate proof, after the toast that says "Identity verified successfully on Mantle!", the "transaction submitted. waiting for confirmation" doesn't go out. It stays~~
   - **Fixed:** Added proper toast ID tracking and dismissal in Compliance.tsx
2. ~~Call 0x61f61c46 Method by 0x87EE75B4...0287AdA04 reverted on RWAAsset contract. This was while trying to mint a new RWAAsset on the tokenize asset component~~
   - **Fixed:** Removed `onlyOwner` modifier from RWAAsset.mint() to allow users to mint their own assets

See [FIXES.md](./FIXES.md) for detailed information about the fixes.

## Next Steps

- [ ] Redeploy contracts to Mantle network
- [ ] Update contract addresses in frontend/src/constants.ts
- [ ] Update contract ABIs in frontend/src/contracts/contracts.json
