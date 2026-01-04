import fs from "fs";
import path from "path";

async function main() {
  const contractsDir = path.join(__dirname, "..", "contracts");
  const frontendDir = path.join(
    __dirname,
    "..",
    "..",
    "frontend",
    "src",
    "contracts"
  );

  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const artifacts = [
    { file: "CompliantAssetVault.sol", name: "CompliantAssetVault" },
    { file: "RWAAsset.sol", name: "RWAAsset" },
    { file: "KYCSBT.sol", name: "KYCSBT" },
    { file: "MockYieldToken.sol", name: "MockYieldToken" },
    { file: "Verifier.sol", name: "Groth16Verifier" },
    { file: "RWARegistry.sol", name: "RWARegistry" },
    { file: "MockPriceFeed.sol", name: "MockPriceFeed" },
    { file: "RWAProofOfReserve.sol", name: "RWAProofOfReserve" },
  ];

  const contractData: any = {};

  for (const item of artifacts) {
    const artifactPath = path.join(
      __dirname,
      "..",
      "artifacts",
      "contracts",
      item.file,
      `${item.name}.json`
    );

    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      contractData[item.name] = {
        abi: artifact.abi,
      };
      console.log(`Exported ABI for ${item.name}`);
    } else {
      console.warn(`Artifact not found: ${artifactPath}`);
    }
  }

  fs.writeFileSync(
    path.join(frontendDir, "contracts.json"),
    JSON.stringify(contractData, null, 2)
  );

  console.log("Finished exporting ABIs to frontend.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
