import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CompliantAssetVaultModule = buildModule(
  "CompliantAssetVaultModule",
  (m) => {
    const deployer = m.getAccount(0);

    // 1. Deploy Verifier
    const verifier = m.contract("Groth16Verifier");

    // 2. Deploy Mock Yield Token
    const yieldToken = m.contract("MockYieldToken");

    // 3. Deploy KYC SBT
    const kycSbt = m.contract("KYCSBT", [deployer]);

    // 4. Deploy RWA Registry
    const registry = m.contract("RWARegistry");

    // 5. Deploy Mock Price Feed (Initial price 1.00 with 8 decimals)
    const priceFeed = m.contract("MockPriceFeed", [100000000], {
      id: "YieldPriceFeed",
    });

    // 5b. Deploy Mock PoR Feed (Initial reserves $2,000,000 with 8 decimals)
    const porFeed = m.contract("MockPriceFeed", [200000000000000], {
      id: "PoRFeed",
    });

    // 6. Deploy RWA Asset
    const rwaAsset = m.contract("RWAAsset", [deployer, registry]);

    // 7. Deploy Compliant Asset Vault
    const vault = m.contract("CompliantAssetVault", [
      verifier,
      yieldToken,
      kycSbt,
      priceFeed,
      registry,
    ]);

    // 7b. Deploy Proof of Reserve
    const por = m.contract("RWAProofOfReserve", [porFeed]);

    // 8. Transfer ownership of KYCSBT to the Vault so it can mint tokens
    m.call(kycSbt, "transferOwnership", [vault]);

    // 9. Transfer ownership of RWAAsset to the Vault (optional, but good for demo)
    // Actually, the user mints assets, so we keep ownership or set it to a minter role.
    // For now, let's keep it as is.

    return {
      verifier,
      yieldToken,
      kycSbt,
      rwaAsset,
      vault,
      registry,
      priceFeed,
      por,
      porFeed,
    };
  }
);

export default CompliantAssetVaultModule;
