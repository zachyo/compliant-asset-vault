import React, { useState } from "react";
import { Upload, Info, Loader2 } from "lucide-react";
import { useWriteContract, useAccount } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { CONTRACT_ADDRESSES } from "../constants";
import contracts from "../contracts/contracts.json";
import { toast } from "sonner";
import { uploadToIPFS, uploadFileToIPFS } from "../utils/ipfs";

interface TokenizeProps {
  setActiveTab: (tab: string) => void;
}

export const Tokenize: React.FC<TokenizeProps> = ({ setActiveTab }) => {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const [assetType, setAssetType] = useState("Invoice");
  const [value, setValue] = useState("");
  const [metadata, setMetadata] = useState(
    '{ "issuer": "Corp X", "invoice_id": "8821" }'
  );
  const [isRegulated, setIsRegulated] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setFileUploadUri] = useState<string>("");

  const { writeContractAsync } = useWriteContract();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF and JPG/PNG files are allowed");
      return;
    }

    setSelectedFile(file);
    toast.success(`${file.name} selected - will upload when you mint`);
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !value) return;

    setIsMinting(true);
    const toastId = toast.loading("Starting minting process...");

    try {
      // Step 1: Upload file to IPFS if selected
      if (selectedFile) {
        toast.loading(`Uploading ${selectedFile.name} to IPFS...`, {
          id: toastId,
        });
        try {
          const uri = await uploadFileToIPFS(selectedFile);
          setFileUploadUri(uri);
          toast.loading("File uploaded! Now uploading metadata...", {
            id: toastId,
          });
        } catch (error: any) {
          console.error("File upload error:", error);
          if (error.message.includes("not configured")) {
            toast.loading(
              "IPFS not configured. Continuing with metadata upload...",
              { id: toastId }
            );
          } else {
            throw new Error(`File upload failed: ${error.message}`);
          }
        }
      } else {
        toast.loading("Uploading metadata to IPFS...", { id: toastId });
      }

      // Step 2: Upload metadata to IPFS
      const tokenUri = await uploadToIPFS({
        assetType,
        value,
        metadata,
        isRegulated,
        timestamp: Date.now(),
        owner: address,
      });

      toast.loading("Metadata uploaded! Minting asset on Mantle...", {
        id: toastId,
      });

      // Step 3: Mint on blockchain
      await writeContractAsync({
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

      // Invalidate queries to refetch dashboard data
      await queryClient.invalidateQueries({ queryKey: ["readContract"] });

      toast.success("Asset tokenized successfully on Mantle!", { id: toastId });

      // Reset form
      setValue("");
      setMetadata('{ "issuer": "Corp X", "invoice_id": "8821" }');
      setSelectedFile(null);
      setFileUploadUri("");

      // Navigate to dashboard after short delay to show success message
      setTimeout(() => {
        setActiveTab("dashboard");
      }, 1500);
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

          <label className="block">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Asset Documentation (Optional)
            </span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="mt-2 block p-8 border-2 border-dashed border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors group cursor-pointer text-center"
            >
              <Upload className="w-8 h-8 text-zinc-600 group-hover:text-zinc-400 mx-auto mb-4 transition-colors" />
              {selectedFile ? (
                <>
                  <p className="text-sm text-emerald-500 font-medium">
                    ✓ {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-2">
                    {(selectedFile.size / 1024).toFixed(2)} KB • Ready to upload
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-500">
                    Click to upload asset documentation (PDF, JPG, PNG)
                  </p>
                  <p className="text-[10px] text-zinc-700 mt-2 uppercase tracking-widest">
                    Max size: 10MB
                  </p>
                </>
              )}
            </label>
          </label>
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
