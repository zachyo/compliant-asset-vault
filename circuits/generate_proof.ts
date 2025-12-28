import * as snarkjs from "snarkjs";
import * as fs from "fs";
import path from "path";

async function generateProof() {
  const input = JSON.parse(
    fs.readFileSync(path.join(__dirname, "input.json"), "utf8")
  );

  console.log("Generating proof for input:", input);

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    path.join(__dirname, "kyc_js", "kyc.wasm"),
    path.join(__dirname, "kyc_final.zkey")
  );

  console.log("Proof generated successfully");

  fs.writeFileSync(
    path.join(__dirname, "proof.json"),
    JSON.stringify(proof, null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, "public.json"),
    JSON.stringify(publicSignals, null, 2)
  );

  // Generate calldata for Solidity
  const calldata = await snarkjs.groth16.exportSolidityCallData(
    proof,
    publicSignals
  );

  // Parse calldata to a more usable format for the frontend
  const argv = calldata
    .replace(/["[\]\s]/g, "")
    .split(",")
    .map((x: string) => x);

  const solidityProof = {
    a: [argv[0], argv[1]],
    b: [
      [argv[2], argv[3]],
      [argv[4], argv[5]],
    ],
    c: [argv[6], argv[7]],
    input: [argv[8]],
  };

  fs.writeFileSync(
    path.join(__dirname, "solidity_proof.json"),
    JSON.stringify(solidityProof, null, 2)
  );

  console.log("Solidity-compatible proof saved to solidity_proof.json");
}

generateProof()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
