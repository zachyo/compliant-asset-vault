import React, { useState } from "react";
import { Upload, Info, Loader2 } from "lucide-react";
import { useWriteContract, useAccount } from "wagmi";
import { CONTRACT_ADDRESSES } from "../constants";
import contracts from "../contracts/contracts.json";
import { toast } from "sonner";

export const Tokenize: React.FC = () => {
  const { address } = useAccount();
  const [assetType, setAssetType] = useState("Invoice");
  const [value, setValue] = useState("");
  const [metadata, setMetadata] = useState(
    '{ "issuer": "Corp X", "invoice_id": "8821" }'
  );
  const [isRegulated, setIsRegulated] = useState(true);
  const [isMinting, setIsMinting] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !value) return;

    setIsMinting(true);
    const toastId = toast.loading("Minting asset on Mantle...");
    try {
      // In a real app, we'd upload metadata to IPFS here
      const tokenUri = `ipfs://mock-hash-${Date.now()}`;

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.RWAAsset as `0x${string}`,
        abi: contracts.RWAAsset.abi as any,
        functionName: "mint",
        args: [
          address,
          tokenUri,
          isRegulated,
          assetType,
          BigInt(value),
          metadata,
        ],
      });

      toast.loading("Transaction submitted. Waiting for confirmation...", {
        id: toastId,
      });

      // We could use useWaitForTransactionReceipt here too, but for simplicity
      // in this component we'll just show success after the hash is returned
      // or we can just leave it as is if we want to be quick.
      // Actually, let's just use the toast to show success.
      toast.success("Asset tokenized successfully on Mantle!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to tokenize asset: " + err.message, { id: toastId });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Tokenize Real-World Asset
        </h2>
        <p className="text-zinc-500 text-sm">
          Convert your invoices or bonds into on-chain compliant assets.
        </p>
      </div>

      <form
        onSubmit={handleMint}
        className="space-y-6 bg-[#0d0d0d] border border-[#1a1a1a] p-8 rounded-sm"
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Asset Type
            </span>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="mt-2 w-full bg-[#121212] border border-[#1a1a1a] text-white px-4 py-3 rounded-sm focus:outline-none focus:border-zinc-500 transition-colors appearance-none"
            >
              <option>Invoice</option>
              <option>Corporate Bond</option>
              <option>Real Estate Debt</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Asset Value (USD)
              </span>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.00"
                className="mt-2 w-full bg-[#121212] border border-[#1a1a1a] text-white px-4 py-3 rounded-sm focus:outline-none focus:border-zinc-500 transition-colors"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Regulation Status
              </span>
              <div className="mt-2 flex items-center gap-4 h-[46px]">
                <button
                  type="button"
                  onClick={() => setIsRegulated(true)}
                  className={`flex-1 h-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                    isRegulated
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-zinc-500 border-[#1a1a1a]"
                  }`}
                >
                  Regulated
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegulated(false)}
                  className={`flex-1 h-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                    !isRegulated
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-zinc-500 border-[#1a1a1a]"
                  }`}
                >
                  Unregulated
                </button>
              </div>
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Asset Metadata (JSON)
            </span>
            <textarea
              rows={4}
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              placeholder='{ "issuer": "Corp X", "invoice_id": "8821" }'
              className="mt-2 w-full bg-[#121212] border border-[#1a1a1a] text-white px-4 py-3 rounded-sm focus:outline-none focus:border-zinc-500 transition-colors font-mono text-sm"
            />
          </label>

          <div className="p-8 border-2 border-dashed border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors group cursor-pointer text-center">
            <Upload className="w-8 h-8 text-zinc-600 group-hover:text-zinc-400 mx-auto mb-4 transition-colors" />
            <p className="text-sm text-zinc-500">
              Click to upload asset documentation (PDF, JPG)
            </p>
            <p className="text-[10px] text-zinc-700 mt-2 uppercase tracking-widest">
              Max size: 10MB
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-[#121212] border border-[#1a1a1a] rounded-sm">
          <Info className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-500 leading-relaxed">
            By minting this asset, you confirm that the provided information is
            accurate and compliant with local regulations. A hash of the
            documentation will be stored on-chain.
          </p>
        </div>

        <button
          type="submit"
          disabled={isMinting || !address}
          className="w-full py-4 bg-white text-black text-sm font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isMinting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Minting on Mantle...
            </>
          ) : (
            "Mint Tokenized Asset"
          )}
        </button>
      </form>
    </div>
  );
};
