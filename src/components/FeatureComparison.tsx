import React from 'react';
import { Check, X, Shield, Star, HardDrive, Mail, Award, AlertTriangle } from 'lucide-react';

interface FeatureComparisonProps {
  currentTier: 'standard' | 'premium';
  onSelectTier: (tier: 'standard' | 'premium') => void;
}

export const FeatureComparison: React.FC<FeatureComparisonProps> = ({
  currentTier,
  onSelectTier
}) => {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-[11px] font-mono font-bold text-orange-brand uppercase tracking-widest bg-orange-trans px-3 py-1 rounded-full border border-orange-brand/20">
          Core Plan Comparison
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mt-3 tracking-tight">
          Symmetrical Security Architecture
        </h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto mt-2 leading-relaxed">
          Choose the storage depth and cryptographic capability required for your CommandNexus node. Toggle plans to preview layouts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* Standard Tier Card */}
        <div 
          className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between border relative ${
            currentTier === 'standard' 
              ? 'bg-white border-gray-400 shadow-lg scale-[1.01]' 
              : 'bg-white/40 border-gray-200 hover:border-gray-300 opacity-90'
          }`}
        >
          {currentTier === 'standard' && (
            <span className="absolute -top-3 left-6 bg-gray-900 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 shadow-sm">
              Current Preview
            </span>
          )}

          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block">Entry Node</span>
                <h3 className="text-xl font-display font-extrabold text-gray-900 mt-1">Standard Core</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-mono font-extrabold text-gray-900">$0</span>
                <span className="text-xs text-gray-500 block">Forever Free</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Provides robust server-side security, synchronized settings, and ad-supported mailbox tools for daily personal operations.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Free Secure Email</h4>
                  <p className="text-[11px] text-gray-500">Fully secured storage with basic SSL/TLS transport transit protocols.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Standard Encryption</h4>
                  <p className="text-[11px] text-gray-500">Industry-standard AES-256 server-side encryption at rest.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">5 GB Cloud Storage</h4>
                  <p className="text-[11px] text-gray-500">Generous baseline allocation for secure text messages and small documents.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
                <div className="p-1 rounded-full bg-amber-100 text-amber-800 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Mailbox Ad Feed</h4>
                  <p className="text-[11px] text-gray-500">Features a compact, non-intrusive sponsor native ad banner at the top of the mailbox inbox.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-gray-100 text-gray-400 shrink-0">
                  <X className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 line-through">Custom Domains</h4>
                  <p className="text-[11px] text-gray-400 line-through">Always displays standard @utubemail.free handle.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => onSelectTier('standard')}
              className={`w-full py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                currentTier === 'standard'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {currentTier === 'standard' ? 'Selected for Preview' : 'Select standard preview'}
            </button>
          </div>
        </div>

        {/* Premium Tier Card */}
        <div 
          className={`p-6 sm:p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between border relative overflow-hidden ${
            currentTier === 'premium' 
              ? 'bg-white border-orange-brand/50 shadow-xl scale-[1.01] glow-orange' 
              : 'bg-white/40 border-gray-200 hover:border-gray-300 opacity-90'
          }`}
        >
          {/* Subtle glow border badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-brand to-amber-500 text-white font-mono text-[8px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow">
            RECOMMENDED
          </div>

          {currentTier === 'premium' && (
            <span className="absolute -top-3 left-6 bg-orange-brand text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 shadow-sm animate-pulse">
              Current Preview
            </span>
          )}

          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-brand uppercase tracking-widest block flex items-center gap-1">
                  <Star className="w-3 h-3 fill-orange-brand text-orange-brand" />
                  Premium Node
                </span>
                <h3 className="text-xl font-display font-extrabold text-gray-900 mt-1">Sovereign Pro</h3>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-2xl font-mono font-extrabold text-gray-900">$4</span>
                  <span className="text-xs text-gray-500 font-mono">.50/mo</span>
                </div>
                <span className="text-[10px] font-mono text-orange-brand font-semibold block">Billed annually</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Unlocks complete cryptographic sovereignty, vast high-performance cloud storage, custom handles, and absolute ad-free interfaces.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-orange-trans text-orange-brand shrink-0">
                  <Shield className="w-3.5 h-3.5 fill-orange-brand/20" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    Military-Grade End-to-End Encryption
                    <span className="text-[8px] bg-orange-brand text-white px-1.5 py-0.2 rounded font-mono font-bold uppercase">Strong</span>
                  </h4>
                  <p className="text-[11px] text-gray-500">Zero-knowledge client-side asymmetric key hashing. Your letters cannot be read by anyone else.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-orange-trans text-orange-brand shrink-0">
                  <HardDrive className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">1 TB Encrypted Storage</h4>
                  <p className="text-[11px] text-gray-500">Gigantic, high-throughput storage partition synced with NexusVault.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-orange-trans text-orange-brand shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Custom Member Email Handles</h4>
                  <p className="text-[11px] text-gray-500">Use customized vanity names such as <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono text-[10px]">yourname@utubemail.com</code>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-orange-trans text-orange-brand shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">100% Ad-Free Experience</h4>
                  <p className="text-[11px] text-gray-500">Pure, uncluttered, focused user interfaces across both desktop and mobile.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-gray-100 pt-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Universal Nexus Benefits</h4>
                  <p className="text-[11px] text-gray-500">Unlocks premium privileges instantly across UTubeChat, CommandFlow, and NexusVault.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => onSelectTier('premium')}
              className={`w-full py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                currentTier === 'premium'
                  ? 'bg-orange-brand text-white shadow-md hover:bg-orange-brand/95 glow-orange'
                  : 'bg-orange-trans text-orange-brand border border-orange-brand/20 hover:bg-orange-brand/20'
              }`}
            >
              {currentTier === 'premium' ? 'Selected for Preview' : 'Select premium preview'}
            </button>
          </div>
        </div>

      </div>

      <div className="mt-8 text-center bg-gray-100 rounded-xl p-4 border border-gray-200">
        <p className="text-xs font-mono text-gray-600">
          🔒 Cryptographic Keys are stored directly inside the user's browser runtime and synced only under zero-knowledge encryption protocols.
        </p>
      </div>
    </section>
  );
};
