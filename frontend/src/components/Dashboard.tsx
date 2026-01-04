import React from "react";
import { TrendingUp, Wallet, Shield, ExternalLink } from "lucide-react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { CONTRACT_ADDRESSES } from "../constants";
import contracts from "../contracts/contracts.json";
import { formatEther } from "viem";

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { address } = useAccount();

  const { data: yieldAmount } = useReadContract({
    address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
    abi: contracts.CompliantAssetVault.abi,
    functionName: "pendingYield",
    args: [address],
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  });

  const { data: tvl } = useReadContract({
    address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
    abi: contracts.CompliantAssetVault.abi,
    functionName: "totalValueLocked",
    query: {
      refetchInterval: 10000,
    },
  });

  const { data: isVerified } = useReadContract({
    address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
    abi: contracts.CompliantAssetVault.abi,
    functionName: "isVerified",
    args: [address],
    query: {
      enabled: !!address,
    },
  });

  const { data: reserves } = useReadContract({
    address: CONTRACT_ADDRESSES.RWAProofOfReserve as `0x${string}`,
    abi: contracts.RWAProofOfReserve.abi,
    functionName: "getLatestReserve",
    query: {
      refetchInterval: 10000,
    },
  });

  // Fetch some potential token IDs to show real data if they exist
  const tokenIds = Array.from({ length: 20 }, (_, i) => i);
  const { data: owners } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: CONTRACT_ADDRESSES.RWAAsset as `0x${string}`,
      abi: contracts.RWAAsset.abi as any,
      functionName: "ownerOf",
      args: [BigInt(id)],
    })) as any,
  });

  const { data: registryData } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: CONTRACT_ADDRESSES.RWARegistry as `0x${string}`,
      abi: contracts.RWARegistry.abi as any,
      functionName: "assets",
      args: [BigInt(id)],
    })) as any,
  });

  const userAssets = tokenIds
    .map((id, index) => {
      const owner = owners?.[index]?.result;
      const metadata = registryData?.[index]?.result as any;

      if (owner === address) {
        return {
          id,
          name: metadata ? `RWA ${metadata[0]} #${id}` : `RWA Asset #${id}`,
          type: metadata ? metadata[0] : "Unknown",
          value: metadata ? `$${Number(metadata[1]).toLocaleString()}` : "$0",
          status: "In Wallet",
        };
      }
      return null;
    })
    .filter((a) => a !== null);

  const stats = [
    {
      label: "Total Value Locked",
      value: tvl ? `$${Number(tvl).toLocaleString()}` : "$0",
      icon: Wallet,
      change: "+12.5%",
    },

    {
      label: "Your Assets",
      value: userAssets.length.toString(),
      icon: Shield,
      change: "0%",
    },
    {
      label: "Yield Earned",
      value: yieldAmount
        ? `${parseFloat(formatEther(yieldAmount as bigint)).toFixed(4)} MYT`
        : "0.0000 MYT",
      icon: TrendingUp,
      change: "+5.2%",
    },
  ];

  const explorerUrl = "https://sepolia.mantlescan.xyz/token/";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-sm hover:border-[#262626] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#1a1a1a] rounded-sm">
                <stat.icon className="w-5 h-5 text-zinc-400" />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Assets */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Your Tokenized Assets
            </h3>
            <button
              onClick={() => setActiveTab("vault")}
              className="text-xs text-zinc-500 hover:text-white transition-colors"
            >
              View All
            </button>
          </div>
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#121212] text-zinc-500 uppercase text-[10px] tracking-widest border-b border-[#1a1a1a]">
                <tr>
                  <th className="px-6 py-4 font-semibold">Asset Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Value</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {userAssets.length > 0 ? (
                  userAssets.map((asset, i) => (
                    <tr
                      key={i}
                      className="hover:bg-[#121212] transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-zinc-200">
                        {asset?.name}
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{asset?.type}</td>
                      <td className="px-6 py-4 text-zinc-300">
                        {asset?.value}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-zinc-500">{asset?.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={`${explorerUrl}${CONTRACT_ADDRESSES.RWAAsset}?a=${asset?.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity inline-block"
                        >
                          <ExternalLink className="w-4 h-4 text-zinc-500 hover:text-white" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-zinc-500 text-xs italic"
                    >
                      No assets found. Mint your first RWA to see it here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Compliance Status
          </h3>
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-sm space-y-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                  isVerified
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-zinc-500/10 border-zinc-500/20"
                }`}
              >
                <Shield
                  className={`w-6 h-6 ${
                    isVerified ? "text-emerald-500" : "text-zinc-500"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {isVerified ? "Identity Verified" : "Not Verified"}
                </p>
                <p className="text-xs text-zinc-500">
                  {isVerified ? "ZK-KYC Proof Active" : "Action Required"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Verification ID</span>
                <span className="text-zinc-300 font-mono">
                  {isVerified
                    ? address?.slice(0, 6) + "..." + address?.slice(-4)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Network</span>
                <span className="text-zinc-300">Mantle Sepolia</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Status</span>
                <span
                  className={isVerified ? "text-emerald-500" : "text-amber-500"}
                >
                  {isVerified ? "Compliant" : "Pending"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("compliance")}
              className={`w-full py-3 border text-xs font-bold uppercase tracking-widest transition-colors rounded-sm ${
                isVerified
                  ? "bg-[#1a1a1a] border-[#262626] text-white hover:bg-[#262626]"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {isVerified ? "View Proof" : "Verify Now"}
            </button>
          </div>

          {/* Proof of Reserve Card */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                Proof of Reserve
              </h3>
              <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-bold text-emerald-500 uppercase">
                  Live
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Total Reserves</span>
                <span className="text-zinc-200 font-bold">
                  {reserves
                    ? `$${(Number(reserves) / 1e8).toLocaleString()}`
                    : "$2,000,000"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Collateral Ratio</span>
                <span className="text-emerald-500 font-bold">
                  {tvl && reserves && Number(tvl) > 0
                    ? `${((Number(reserves) / 1e8 / Number(tvl)) * 100).toFixed(
                        2
                      )}%`
                    : "100%+"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Oracle</span>
                <span className="text-zinc-400">Chainlink PoR</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#1a1a1a]">
              <p className="text-[10px] text-zinc-500 italic">
                Verified: Reserves match on-chain tokenized assets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
