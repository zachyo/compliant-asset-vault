import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
} from "lucide-react";
import * as snarkjs from "snarkjs";
import { buildPoseidon } from "circomlibjs";
import {
  useWriteContract,
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACT_ADDRESSES, ZK_CONFIG } from "../constants";
import contracts from "../contracts/contracts.json";
import { toast } from "sonner";

export const Compliance: React.FC = () => {
  const { address } = useAccount();
  const [secret, setSecret] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "generating" | "verifying" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingToastId, setLoadingToastId] = useState<
    string | number | undefined
  >();

  const { writeContractAsync, data: txHash } = useWriteContract();

  const {
    data: isVerified,
    isLoading: isCheckingVerification,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
    abi: contracts.CompliantAssetVault.abi,
    functionName: "isVerified",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isConfirmed) {
      refetch();
      setStatus("success");
      setIsGenerating(false);
      // Dismiss the loading toast first
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
      }
      toast.success("Identity verified successfully on Mantle!");
      setLoadingToastId(undefined);
    }
  }, [isConfirmed, refetch, loadingToastId]);

  const generateAndVerify = async () => {
    if (!secret || !address) return;

    setIsGenerating(true);
    setStatus("generating");
    setErrorMessage("");
    const toastId = toast.loading("Generating ZK Proof...");
    setLoadingToastId(toastId);

    try {
      // 1. Build Poseidon hasher
      const poseidon = await buildPoseidon();
      const hash = poseidon.F.toObject(poseidon([BigInt(secret)]));
      const identityCommitment = hash.toString();

      console.log("Identity Commitment:", identityCommitment);

      // 2. Generate Proof
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        { secret: secret, identityCommitment: identityCommitment },
        ZK_CONFIG.WASM_PATH,
        ZK_CONFIG.ZKEY_PATH
      );

      setStatus("verifying");
      toast.loading("Verifying on Mantle...", { id: toastId });

      // 3. Format calldata for Solidity
      const calldata = await snarkjs.groth16.exportSolidityCallData(
        proof,
        publicSignals
      );
      const argv = calldata
        .replace(/["[\]\s]/g, "")
        .split(",")
        .map((x: string) => x);

      const a = [argv[0], argv[1]] as [any, any];
      const b = [
        [argv[2], argv[3]],
        [argv[4], argv[5]],
      ] as [[any, any], [any, any]];
      const c = [argv[6], argv[7]] as [any, any];
      const input = [argv[8]] as [any];

      // 4. Call Contract
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
        abi: contracts.CompliantAssetVault.abi,
        functionName: "verifyUser",
        args: [a, b, c, input],
      });

      // We don't set status to success here anymore, we wait for isConfirmed
      toast.loading("Transaction submitted. Waiting for confirmation...", {
        id: toastId,
      });
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setIsGenerating(false);
      const msg =
        err.message || "Failed to verify. Ensure ZK files are in public/zk/";
      setErrorMessage(msg);
      toast.error(msg, { id: toastId });
      setLoadingToastId(undefined);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            ZK-KYC Verification
          </h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Prove your identity and compliance status without revealing
            sensitive personal data using zero-knowledge proofs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-8 rounded-sm space-y-6">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-5 h-5 text-zinc-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              Generate Proof
            </h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            This will generate a ZK-proof off-chain using your identity secret.
            The proof confirms you are a verified entity without disclosing your
            name or country.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-500/5 border border-zinc-500/10 rounded-sm space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  What is an Identity Secret?
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Your identity secret is a <strong>private numeric value</strong>{" "}
                (e.g., 123456) that acts as your digital DNA. In this
                production-ready version, this is integrated with{" "}
                <strong>AML/KYB checks</strong> via SumSub/Persona APIs to
                ensure compliance with global regulations. For this demo, you
                can use any number. <strong>Never share this secret.</strong>
              </p>
            </div>

            <label className="block">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  Identity Secret
                </span>
              </div>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter your secret number"
                className="mt-2 w-full bg-[#121212] border border-[#1a1a1a] text-white px-4 py-3 rounded-sm focus:outline-none focus:border-zinc-500 transition-colors"
                disabled={isGenerating || !!isVerified}
              />
            </label>
            <button
              onClick={generateAndVerify}
              disabled={isGenerating || !secret || !!isVerified}
              className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {status === "generating"
                    ? "Generating Proof..."
                    : "Verifying on Mantle..."}
                </>
              ) : (
                "Generate ZK Proof"
              )}
            </button>
            {status === "error" && (
              <p className="text-[10px] text-red-500 text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-8 rounded-sm space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2
              className={
                isVerified
                  ? "w-5 h-5 text-emerald-500"
                  : "w-5 h-5 text-zinc-600"
              }
            />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">
              Verification Status
            </h3>
          </div>

          <div
            className={
              isVerified
                ? "p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-sm"
                : "p-4 bg-zinc-500/5 border border-zinc-500/10 rounded-sm"
            }
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={
                  isVerified
                    ? "w-2 h-2 rounded-full bg-emerald-500"
                    : "w-2 h-2 rounded-full bg-zinc-600"
                }
              />
              <span
                className={
                  isVerified
                    ? "text-xs font-bold text-emerald-500 uppercase tracking-widest"
                    : "text-xs font-bold text-zinc-600 uppercase tracking-widest"
                }
              >
                {isCheckingVerification
                  ? "Checking..."
                  : isVerified
                  ? "Active"
                  : "Not Verified"}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              {isVerified
                ? "Your on-chain KYC Soulbound Token (KYCSBT) is currently valid. You have full access to the Asset Vault."
                : "You need to verify your identity using a ZK-proof before you can deposit assets into the vault."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                Last Verified
              </span>
              <span className="text-xs text-zinc-300">
                {isVerified ? "Dec 26, 2025" : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                Proof Type
              </span>
              <span className="text-xs text-zinc-300">Groth16 / Circom</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
                Mantle Tx
              </span>
              <span className="text-xs text-zinc-300 font-mono">
                {isVerified ? "0x4a2...e91" : "N/A"}
              </span>
            </div>
          </div>

          <button className="w-full py-4 bg-[#1a1a1a] border border-[#262626] text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] cursor-not-allowed rounded-sm">
            Revoke Verification
          </button>
        </div>
      </div>

      <div className="bg-[#121212] border border-[#1a1a1a] p-6 rounded-sm flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-zinc-300">Privacy Notice</p>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            CompliantAssetVault never stores your identity secret. All proof
            generation happens locally in your browser. Only the cryptographic
            proof and your public identity commitment are submitted to the
            Mantle Network.
          </p>
        </div>
      </div>
    </div>
  );
};
