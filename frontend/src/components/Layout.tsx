import React from "react";
import {
  LayoutDashboard,
  FilePlus,
  ShieldCheck,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { Toaster } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tokenize", label: "Tokenize Asset", icon: FilePlus },
    { id: "vault", label: "Asset Vault", icon: Wallet },
    { id: "compliance", label: "Compliance", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] font-sans selection:bg-white selection:text-black">
      <Toaster position="bottom-right" theme="dark" richColors />
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-[#1a1a1a] bg-[#0d0d0d] hidden lg:flex flex-col">
        <div className="p-8">
          <h1 className="text-xl font-bold tracking-tighter text-white">
            COMPLIANT<span className="text-zinc-500">ASSET</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mt-1">
            Mantle Network
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group",
                activeTab === item.id
                  ? "bg-[#1a1a1a] text-white border border-[#262626]"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-[#121212]"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  activeTab === item.id
                    ? "text-white"
                    : "text-zinc-600 group-hover:text-zinc-400"
                )}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="p-4 bg-[#121212] rounded-sm border border-[#1a1a1a]">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
              Network Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-xs font-medium text-zinc-300">
                Mantle Sepolia
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="fixed top-0 right-0 left-0 lg:left-64 h-20 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-md z-40 flex items-center justify-between px-8">
        <div className="lg:hidden flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6 text-zinc-400" />
          </button>
          <h1 className="text-lg font-bold tracking-tighter text-white">CAV</h1>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-sm font-medium text-zinc-400 capitalize">
            {activeTab.replace("-", " ")}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <appkit-button />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 lg:pl-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 lg:hidden">
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-xl font-bold tracking-tighter text-white">
                COMPLIANT ASSET
              </h1>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>
            <nav className="space-y-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 text-xl font-medium",
                    activeTab === item.id ? "text-white" : "text-zinc-600"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
