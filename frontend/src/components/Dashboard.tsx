import React from "react";
import { TrendingUp, Wallet, Shield, ArrowUpRight } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES } from "../constants";
import contracts from "../contracts/contracts.json";
import { formatEther } from "viem";

export const Dashboard: React.FC = () => {
  const { address } = useAccount();

  const { data: yieldAmount } = useReadContract({
    address: CONTRACT_ADDRESSES.CompliantAssetVault as `0x${string}`,
    abi: contracts.CompliantAssetVault.abi,
    functionName: "pendingYield",
    args: [address],
    query: {
      enabled: !!address,
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

  const stats = [
    {
      label: "Total Value Locked",
      value: "$1,240,500",
      icon: Wallet,
      change: "+12.5%",
    },
    { label: "Your Staked Assets", value: "4", icon: Shield, change: "0%" },
    {
      label: "Yield Earned",
      value: yieldAmount
        ? `${parseFloat(formatEther(yieldAmount as bigint)).toFixed(4)} MYT`
        : "0.0000 MYT",
      icon: TrendingUp,
      change: "+5.2%",
    },
  ];

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
            <button className="text-xs text-zinc-500 hover:text-white transition-colors">
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
                {[
                  {
                    name: "Invoice #8821",
                    type: "Invoice",
                    value: "$12,000",
                    status: "Staked",
                  },
                  {
                    name: "Corporate Bond A",
                    type: "Bond",
                    value: "$50,000",
                    status: "In Wallet",
                  },
                  {
                    name: "Invoice #8822",
                    type: "Invoice",
                    value: "$8,500",
                    status: "Staked",
                  },
                ].map((asset, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[#121212] transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-zinc-200">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{asset.type}</td>
                    <td className="px-6 py-4 text-zinc-300">{asset.value}</td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          asset.status === "Staked"
                            ? "text-emerald-500"
                            : "text-zinc-500"
                        }
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 hover:text-white" />
                      </button>
                    </td>
                  </tr>
                ))}
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
                <span className="text-zinc-500">Expires In</span>
                <span className="text-zinc-300">
                  {isVerified ? "242 Days" : "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Region</span>
                <span className="text-zinc-300">
                  {isVerified ? "European Union" : "N/A"}
                </span>
              </div>
            </div>

            <button
              className={`w-full py-3 border text-xs font-bold uppercase tracking-widest transition-colors rounded-sm ${
                isVerified
                  ? "bg-[#1a1a1a] border-[#262626] text-white hover:bg-[#262626]"
                  : "bg-white text-black hover:bg-zinc-200"
              }`}
            >
              {isVerified ? "Update Proof" : "Verify Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
