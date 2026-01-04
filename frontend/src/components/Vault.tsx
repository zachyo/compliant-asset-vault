import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  Coins,
  ArrowRight,
  Loader2,
  TrendingUp,
  Info,
} from "lucide-react";
import {
  useWriteContract,
  useAccount,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACT_ADDRESSES } from "../constants";
import contracts from "../contracts/contracts.json";
import { formatEther } from "viem";
import { toast } from "sonner";

export const Vault: React.FC = () => {
  const { address } = useAccount();
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync } = useWriteContract();

  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // 1. Read pending yield
  const { data: yieldAmount, refetch: refetchYield } = useReadContract({
    address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
    abi: contracts.CompliantAssetVault.abi as any,
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
    abi: contracts.CompliantAssetVault.abi as any,
    functionName: "isVerified",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  // 3. Fetch potential assets
  const tokenIds = Array.from({ length: 20 }, (_, i) => i);

  // Check ownership
  const { data: owners, refetch: refetchOwners } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: CONTRACT_ADDRESSES.RWAAsset as `0x${string}`,
      abi: contracts.RWAAsset.abi as any,
      functionName: "ownerOf",
      args: [BigInt(id)],
    })) as any,
  });

  // Check stakes
  const { data: stakes, refetch: refetchStakes } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
      abi: contracts.CompliantAssetVault.abi as any,
      functionName: "stakes",
      args: [BigInt(id)],
    })) as any,
  });

  // Check registry data
  const { data: registryData } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: CONTRACT_ADDRESSES.RWARegistry as `0x${string}`,
      abi: contracts.RWARegistry.abi as any,
      functionName: "assets",
      args: [BigInt(id)],
    })) as any,
  });

  useEffect(() => {
    if (isConfirmed) {
      refetchYield();
      refetchOwners();
      refetchStakes();
      setIsActionLoading(null);
      setTxHash(undefined);
    }
  }, [isConfirmed, refetchYield, refetchOwners, refetchStakes]);

  const stakeableAssets = tokenIds
    .map((id, index) => {
      const owner = owners?.[index]?.result;
      const metadata = registryData?.[index]?.result as any;
      if (owner === address) {
        return {
          id,
          name: metadata ? `RWA ${metadata[0]} #${id}` : `RWA Asset #${id}`,
          value: metadata ? `$${Number(metadata[1]).toLocaleString()}` : "$0",
        };
      }
      return null;
    })
    .filter((a) => a !== null);

  const stakedAssets = tokenIds
    .map((id, index) => {
      const stake = stakes?.[index]?.result as any;
      const metadata = registryData?.[index]?.result as any;
      if (stake && stake[1] === address) {
        // stake[1] is the owner address in the Stake struct
        return {
          id,
          name: metadata ? `RWA ${metadata[0]} #${id}` : `RWA Asset #${id}`,
          value: metadata ? `$${Number(metadata[1]).toLocaleString()}` : "$0",
        };
      }
      return null;
    })
    .filter((a) => a !== null);

  const handleDeposit = async (tokenId: number) => {
    if (!address) return;
    setIsActionLoading(`deposit-${tokenId}`);
    const toastId = toast.loading("Approving and depositing asset...");
    try {
      // Step 1: Approve Vault
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.RWAAsset as `0x${string}`,
        abi: contracts.RWAAsset.abi as any,
        functionName: "approve",
        args: [CONTRACT_ADDRESSES.CompliantAssetVault, BigInt(tokenId)],
      });

      // Step 2: Deposit
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
        abi: contracts.CompliantAssetVault.abi as any,
        functionName: "deposit",
        args: [CONTRACT_ADDRESSES.RWAAsset, BigInt(tokenId)],
      });

      setTxHash(hash);
      toast.success("Transaction submitted!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Deposit failed: " + err.message, { id: toastId });
      setIsActionLoading(null);
    }
  };

  const handleWithdraw = async (tokenId: number) => {
    if (!address) return;
    setIsActionLoading(`withdraw-${tokenId}`);
    const toastId = toast.loading("Withdrawing asset...");
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
        abi: contracts.CompliantAssetVault.abi as any,
        functionName: "withdraw",
        args: [CONTRACT_ADDRESSES.RWAAsset, BigInt(tokenId)],
      });
      setTxHash(hash);
      toast.success("Withdrawal submitted!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Withdraw failed: " + err.message, { id: toastId });
      setIsActionLoading(null);
    }
  };

  const handleClaimYield = async () => {
    if (!address) return;
    setIsActionLoading("claim");
    const toastId = toast.loading("Claiming yield...");
    try {
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
        abi: contracts.CompliantAssetVault.abi as any,
        functionName: "claimYield",
      });
      setTxHash(hash);
      toast.success("Claim submitted!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error("Claim failed: " + err.message, { id: toastId });
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
            {stakeableAssets.length > 0 ? (
              stakeableAssets.map((asset, i) => (
                <div
                  key={i}
                  className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-sm flex items-center justify-between group hover:border-[#262626] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#121212] border border-[#1a1a1a] flex items-center justify-center rounded-sm">
                      <Coins className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {asset?.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Token ID: #{asset?.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        {asset?.value}
                      </p>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        Value
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeposit(asset!.id)}
                      disabled={
                        !isVerified ||
                        isActionLoading === `deposit-${asset?.id}`
                      }
                      title={
                        isVerified
                          ? "Deposit asset to start earning yield"
                          : "Verify identity first"
                      }
                      className="p-2 bg-white text-black rounded-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                      {isActionLoading === `deposit-${asset?.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 italic p-4">
                No assets available to stake.
              </p>
            )}
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
                  <p className="text-3xl font-bold text-white">
                    $
                    {stakedAssets
                      .reduce(
                        (acc, asset) =>
                          acc + Number(asset.value.replace(/[^0-9.-]+/g, "")),
                        0
                      )
                      .toLocaleString()}
                  </p>
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
                title="Claim your accrued yield in MYT tokens"
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
              {stakedAssets.length > 0 ? (
                stakedAssets.map((asset, i) => (
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
                          {asset?.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Token ID: #{asset?.id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleWithdraw(asset!.id)}
                      disabled={isActionLoading === `withdraw-${asset?.id}`}
                      title="Withdraw asset from vault"
                      className="text-zinc-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {isActionLoading === `withdraw-${asset?.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Unlock className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic p-4">
                  No active stakes.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
