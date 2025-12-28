import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CompliantAssetVaultModule = buildModule(
  "CompliantAssetVaultModule",
  (m) => {
    // 1. Deploy Verifier
    const verifier = m.contract("Verifier");

    // 2. Deploy Mock Yield Token
    const yieldToken = m.contract("MockYieldToken");

    // 3. Deploy KYC SBT
    // The constructor takes the initialOwner address
    const deployer = m.getAccount(0);
    const kycSbt = m.contract("KYCSBT", [deployer]);

    // 4. Deploy RWA Asset
    const rwaAsset = m.contract("RWAAsset", [deployer]);

    // 5. Deploy Compliant Asset Vault
    // constructor(address _verifier, address _yieldToken, address _kycSbt)
    const vault = m.contract("CompliantAssetVault", [
      verifier,
      yieldToken,
      kycSbt,
    ]);

    // 6. Transfer ownership of KYCSBT to the Vault so it can mint tokens
    m.call(kycSbt, "transferOwnership", [vault]);

    return { verifier, yieldToken, kycSbt, rwaAsset, vault };
  }
);

export default CompliantAssetVaultModule;
