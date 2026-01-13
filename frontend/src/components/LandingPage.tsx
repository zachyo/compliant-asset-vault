import React from "react";
import {
  Shield,
  Lock,
  TrendingUp,
  Zap,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5] overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 border-b border-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#1a1a1a] border border-[#262626] rounded-sm flex items-center justify-center">
              <Shield className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              COMPLIANT<span className="text-zinc-500">ASSET</span>
            </span>
          </div>
          <button
            onClick={onGetStarted}
            className="px-6 py-2 bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] rounded-sm transition-colors text-sm font-medium"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm mb-8">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-xs text-zinc-400 uppercase tracking-wider">
              Built on Mantle Network
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tighter">
            Privacy-Focused <span className="text-white">RWA Tokenization</span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Tokenize real-world assets like invoices and bonds while maintaining
            privacy through{" "}
            <span className="text-emerald-500 font-semibold">
              Zero-Knowledge KYC
            </span>
            . Earn compliant yields on Mantle Network.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-white text-black rounded-sm font-bold hover:bg-zinc-200 transition-all duration-200 flex items-center space-x-2 uppercase tracking-wider text-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://github.com/zachyo/compliant-asset-vault"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] rounded-sm font-bold transition-all duration-200 flex items-center space-x-2 uppercase tracking-wider text-sm"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">
                Privacy Preserved
              </div>
            </div>
            <div className="p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="text-3xl font-bold text-emerald-500 mb-2">
                ZK-Proof
              </div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">
                Compliant Verification
              </div>
            </div>
            <div className="p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="text-3xl font-bold text-white mb-2">Low Fees</div>
              <div className="text-xs text-zinc-500 uppercase tracking-wider">
                Mantle L2 Network
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tighter">
            Why Choose{" "}
            <span className="text-zinc-500">CompliantAssetVault</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="w-14 h-14 bg-[#1a1a1a] border border-[#262626] rounded-sm flex items-center justify-center mb-6">
                <Lock className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                Zero-Knowledge KYC
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Prove compliance (non-sanctioned, age verification) without
                revealing your personal identity. Built with Circom-based
                ZK-proofs for maximum privacy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="w-14 h-14 bg-[#1a1a1a] border border-[#262626] rounded-sm flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                RWA Tokenization
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Mint ERC-721 tokens representing real-world assets like invoices
                and bonds. Each token includes on-chain regulation flags for
                compliance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="w-14 h-14 bg-[#1a1a1a] border border-[#262626] rounded-sm flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                Compliant Yield Vault
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Stake your tokenized assets in a secure vault to earn yields.
                Access is restricted to ZK-verified users only, ensuring
                regulatory compliance.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="w-14 h-14 bg-[#1a1a1a] border border-[#262626] rounded-sm flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">
                Soulbound Compliance
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Verified users receive a non-transferable KYC Soulbound Token
                (KYCSBT) for seamless access across the entire ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 border-t border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tighter">
            How It <span className="text-zinc-500">Works</span>
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start space-x-6 p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="shrink-0 w-12 h-12 bg-[#1a1a1a] border border-[#262626] rounded-sm flex items-center justify-center font-bold text-xl text-emerald-500">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">
                  Complete ZK-KYC Verification
                </h3>
                <p className="text-zinc-400 text-sm">
                  Submit your KYC information off-chain and generate a
                  zero-knowledge proof. This proves you're compliant without
                  revealing your identity on-chain.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-6 p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="shrink-0 w-12 h-12 bg-[#1a1a1a] border border-[#262626] rounded-sm flex items-center justify-center font-bold text-xl text-emerald-500">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">
                  Tokenize Your Assets
                </h3>
                <p className="text-zinc-400 text-sm">
                  Upload your real-world asset metadata (invoices, bonds, etc.)
                  and mint them as ERC-721 tokens on the Mantle Network with
                  built-in compliance flags.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-6 p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors">
              <div className="shrink-0 w-12 h-12 bg-[#1a1a1a] border border-[#262626] rounded-sm flex items-center justify-center font-bold text-xl text-emerald-500">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">
                  Stake and Earn Yields
                </h3>
                <p className="text-zinc-400 text-sm">
                  Deposit your tokenized assets into the compliant vault and
                  start earning yields. Only ZK-verified users can access the
                  vault, ensuring regulatory compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 border-t border-[#1a1a1a]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tighter">
            Built With <span className="text-zinc-500">Cutting-Edge Tech</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Mantle Network", desc: "Layer 2 Blockchain" },
              { name: "Solidity", desc: "Smart Contracts" },
              { name: "Circom", desc: "ZK-Proofs" },
              { name: "React", desc: "Frontend" },
              { name: "Wagmi", desc: "Web3 Hooks" },
              { name: "Viem", desc: "Ethereum Library" },
              { name: "Tailwind CSS", desc: "Styling" },
              { name: "Reown AppKit", desc: "Wallet Connect" },
            ].map((tech, index) => (
              <div
                key={index}
                className="p-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm hover:border-[#262626] transition-colors text-center"
              >
                <div className="font-bold mb-1 text-sm">{tech.name}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">
                  {tech.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 border-t border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center p-12 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Join the future of compliant RWA tokenization. Start tokenizing your
            assets and earning yields while maintaining complete privacy.
          </p>
          <button
            onClick={onGetStarted}
            className="group px-10 py-5 bg-white text-black rounded-sm font-bold text-sm hover:bg-zinc-200 transition-all duration-200 flex items-center space-x-2 mx-auto uppercase tracking-wider"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1a1a1a] border border-[#262626] rounded-sm flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xl font-bold tracking-tighter">
                COMPLIANT<span className="text-zinc-500">ASSET</span>
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/zachyo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/zachy_yo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/zacheusio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#1a1a1a] text-center text-zinc-500 text-xs">
            <p>© 2026 CompliantAssetVault. Built by Zacheus Israel.</p>
            <p className="mt-2">
              This is a proof-of-concept for demonstration purposes. No real
              financial instruments are tokenized.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
