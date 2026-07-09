import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Layers, 
  MessageSquare, 
  HardDrive, 
  Cpu, 
  Megaphone, 
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { EcosystemApp } from '../types';

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onToggle,
  accentColor
}) => {
  const ecosystemApps: EcosystemApp[] = [
    {
      id: 'nexus-central',
      name: 'CommandNexus Central',
      description: 'Unified core dashboard, network state logs, and identity engine.',
      icon: 'Cpu',
      url: '#',
      isPremiumOnly: false,
    },
    {
      id: 'utubechat',
      name: 'UTubeChat Live',
      description: 'End-to-end encrypted messaging, channels, and real-time workspaces.',
      icon: 'MessageSquare',
      url: '#',
      isPremiumOnly: false,
      isNew: true
    },
    {
      id: 'nexus-vault',
      name: 'NexusVault Storage',
      description: 'Zero-knowledge military-grade asset storage and private cloud drives.',
      icon: 'HardDrive',
      url: '#',
      isPremiumOnly: true
    },
    {
      id: 'nexus-ads',
      name: 'NexusAds Portal',
      description: 'Self-serve advertising manager with privacy-first target audiences.',
      icon: 'Megaphone',
      url: '#',
      isPremiumOnly: false
    }
  ];

  // Helper to resolve icon components
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-gray-700 group-hover:text-orange-brand" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-gray-700 group-hover:text-orange-brand" />;
      case 'HardDrive': return <HardDrive className="w-5 h-5 text-gray-700 group-hover:text-orange-brand" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5 text-gray-700 group-hover:text-orange-brand" />;
      default: return <Layers className="w-5 h-5 text-gray-700" />;
    }
  };

  return (
    <div className="relative z-50">
      {/* Hamburger Toggle Button - Highlighted in dark transparent orange */}
      <button
        id="hamburger-toggle-btn"
        onClick={onToggle}
        className="p-3 rounded-lg transition-all duration-300 flex items-center justify-center border border-orange-brand/20 bg-orange-trans text-orange-brand hover:bg-orange-brand/25 hover:border-orange-brand/40 shadow-sm"
        aria-label="Open App Launcher"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#f2f2f2] border-l border-white/40 shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-gray-300 flex items-center justify-between bg-white/70 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Layers className="w-6 h-6 text-orange-brand" />
                  <div>
                    <h3 className="font-display font-bold text-gray-900 leading-none">Ecosystem Apps</h3>
                    <span className="text-[10px] font-mono text-gray-500 tracking-wider uppercase">Powered by CommandNexus</span>
                  </div>
                </div>
                <button
                  onClick={onToggle}
                  className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Advertisement Banner at the VERY TOP of the drawer list */}
              <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-1 right-2 bg-orange-brand/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Sponsored
                </div>
                <div>
                  <h4 className="text-xs font-mono text-orange-brand font-bold uppercase tracking-wider mb-1">CommandNexus VPS Server</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed max-w-[85%]">
                    Deploy secure, end-to-end encrypted databases instantly. Starting at $4.99/mo.
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">99.99% Guaranteed Uptime</span>
                  <a
                    href="#deploy"
                    onClick={(e) => { e.preventDefault(); alert("Redirecting to CommandNexus Cloud VPS deployment terminal..."); }}
                    className="px-3 py-1 bg-orange-brand hover:bg-orange-brand/90 transition-all text-white text-[10px] font-mono rounded font-bold uppercase tracking-wider"
                  >
                    Deploy Now
                  </a>
                </div>
                
                {/* Visual grid accent line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-brand to-transparent"></div>
              </div>

              {/* Ecosystem App List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-gray-600 uppercase tracking-wider">Connected App Suite</span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Nexus Active
                  </span>
                </div>

                <div className="space-y-3">
                  {ecosystemApps.map((app) => (
                    <div
                      key={app.id}
                      className="group p-4 bg-white hover:bg-white/90 rounded-xl border border-gray-200 hover:border-orange-brand/30 transition-all duration-200 relative overflow-hidden cursor-pointer shadow-sm"
                      onClick={() => {
                        alert(`Launching secure session with ${app.name}...`);
                      }}
                    >
                      {app.isNew && (
                        <div className="absolute -right-8 -top-8 w-16 h-16 bg-orange-brand/10 rotate-45 flex items-end justify-center pb-1">
                          <span className="text-[8px] font-mono font-bold text-orange-brand uppercase tracking-widest">New</span>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-orange-trans transition-colors duration-200 flex items-center justify-center shrink-0">
                          {renderIcon(app.icon)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-display font-bold text-gray-900 group-hover:text-orange-brand transition-colors">
                              {app.name}
                            </h4>
                            {app.isPremiumOnly && (
                              <span className="text-[8px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-mono font-bold uppercase tracking-wider">
                                Premium
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                            {app.description}
                          </p>
                        </div>

                        <div className="self-center text-gray-400 group-hover:text-orange-brand transition-colors duration-200">
                          <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Secure network note */}
                <div className="mt-6 p-4 rounded-xl bg-orange-trans border border-orange-brand/15 text-gray-700 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-brand uppercase tracking-wider font-display">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    Zero-Trust Cryptographic Core
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    UTube Mail settings, user credentials, and ad preference keys are synced using end-to-end zero-knowledge protocols powered by <strong>CommandNexus</strong>. Changing your password updates security credentials across the entire network.
                  </p>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 bg-white border-t border-gray-200 text-center text-xs font-mono text-gray-500">
                <div className="flex justify-center items-center gap-1.5">
                  <span>CommandNexus Network Version 4.12.0</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
