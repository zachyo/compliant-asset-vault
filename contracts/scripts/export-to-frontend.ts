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
    "CompliantAssetVault",
    "RWAAsset",
    "KYCSBT",
    "MockYieldToken",
    "Verifier",
  ];

  const contractData: any = {};

  for (const name of artifacts) {
    const artifactPath = path.join(
      __dirname,
      "..",
      "artifacts",
      "contracts",
      `${name}.sol`,
      `${name}.json`
    );

    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      contractData[name] = {
        abi: artifact.abi,
      };
      console.log(`Exported ABI for ${name}`);
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
