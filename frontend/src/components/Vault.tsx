import React, { useState } from "react";
import {
  Lock,
  Unlock,
  Coins,
  ArrowRight,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useWriteContract, useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES } from "../constants";
import contracts from "../contracts/contracts.json";
import { formatEther } from "viem";

export const Vault: React.FC = () => {
  const { address } = useAccount();
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();

  // 1. Read pending yield
  const { data: yieldAmount, refetch: refetchYield } = useReadContract({
    address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
    abi: contracts.CompliantAssetVault.abi,
    functionName: "pendingYield",
    args: [address],
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  });

  // 2. Check if user is verified
  const { data: isVerified } = useReadContract({
    address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
    abi: contracts.CompliantAssetVault.abi,
    functionName: "isVerified",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const handleDeposit = async (tokenId: number) => {
    if (!address) return;
    setIsActionLoading(`deposit-${tokenId}`);
    try {
      // Step 1: Approve Vault
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.RWAAsset as `0x${string}`,
        abi: contracts.RWAAsset.abi,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.CompliantAssetVault, BigInt(tokenId)],
      });

      // Step 2: Deposit
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
        abi: contracts.CompliantAssetVault.abi,
        functionName: "deposit",
        args: [CONTRACT_ADDRESSES.RWAAsset, BigInt(tokenId)],
      });

      alert("Asset deposited successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Deposit failed: " + err.message);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleWithdraw = async (tokenId: number) => {
    if (!address) return;
    setIsActionLoading(`withdraw-${tokenId}`);
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
        abi: contracts.CompliantAssetVault.abi,
        functionName: "withdraw",
        args: [CONTRACT_ADDRESSES.RWAAsset, BigInt(tokenId)],
      });
      alert("Asset withdrawn successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Withdraw failed: " + err.message);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleClaimYield = async () => {
    if (!address) return;
    setIsActionLoading("claim");
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
        abi: contracts.CompliantAssetVault.abi,
        functionName: "claimYield",
      });
      alert("Yield claimed successfully!");
      refetchYield();
    } catch (err: any) {
      console.error(err);
      alert("Claim failed: " + err.message);
    } finally {
      setIsActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Asset Vault
          </h2>
          <p className="text-zinc-500 text-sm">
            Stake your tokenized assets to earn compliant yields.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
              Current APY
            </p>
            <p className="text-xl font-bold text-emerald-500">5.00%</p>
          </div>
        </div>
      </div>

      {!isVerified && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-sm flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-500" />
          <p className="text-xs text-amber-200">
            You must complete ZK-KYC verification before you can deposit assets.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stakeable Assets */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
            Available to Stake
          </h3>
          <div className="space-y-3">
            {[
              { name: "Corporate Bond A", id: 12, value: "$50,000" },
              { name: "Invoice #9901", id: 45, value: "$15,200" },
            ].map((asset, i) => (
              <div
                key={i}
                className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-sm flex items-center justify-between group hover:border-[#262626] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#121212] border border-[#1a1a1a] flex items-center justify-center rounded-sm">
                    <Coins className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{asset.name}</p>
                    <p className="text-xs text-zinc-500">
                      Token ID: #{asset.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      {asset.value}
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      Value
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeposit(asset.id)}
                    disabled={
                      !isVerified || isActionLoading === `deposit-${asset.id}`
                    }
                    className="p-2 bg-white text-black rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {isActionLoading === `deposit-${asset.id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staked Assets & Yield */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              Your Staked Position
            </h3>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-8 rounded-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                    Total Staked
                  </p>
                  <p className="text-3xl font-bold text-white">$20,500</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                    Yield Accrued
                  </p>
                  <p className="text-3xl font-bold text-emerald-500">
                    {yieldAmount
                      ? parseFloat(formatEther(yieldAmount as bigint)).toFixed(
                          4
                        )
                      : "0.0000"}
                    <span className="text-xs text-emerald-500/50 ml-2">
                      MYT
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={handleClaimYield}
                disabled={
                  !yieldAmount ||
                  (yieldAmount as bigint) === 0n ||
                  isActionLoading === "claim"
                }
                className="w-full py-4 bg-[#1a1a1a] border border-[#262626] text-white text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#262626] transition-colors rounded-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isActionLoading === "claim" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Claim Yield <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              Active Stakes
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: "Invoice #8821",
                  id: 8,
                  value: "$12,000",
                  yield: "72.10 MYT",
                },
                {
                  name: "Invoice #8822",
                  id: 9,
                  value: "$8,500",
                  yield: "52.40 MYT",
                },
              ].map((asset, i) => (
                <div
                  key={i}
                  className="bg-[#0d0d0d] border border-[#1a1a1a] p-4 rounded-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center rounded-sm">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {asset.name}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        Token ID: #{asset.id}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleWithdraw(asset.id)}
                    disabled={isActionLoading === `withdraw-${asset.id}`}
                    className="text-zinc-500 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {isActionLoading === `withdraw-${asset.id}` ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
