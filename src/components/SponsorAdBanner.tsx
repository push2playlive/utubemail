import React, { useState } from 'react';
import { SponsorAd } from '../types';
import { Cpu, ShieldCheck, Database, Server, RefreshCw, Sparkles } from 'lucide-react';

interface SponsorAdBannerProps {
  onInteract?: (adTitle: string) => void;
}

export const SponsorAdBanner: React.FC<SponsorAdBannerProps> = ({ onInteract }) => {
  const ads: SponsorAd[] = [
    {
      id: 'nexus-vps',
      title: 'CommandNexus Hyper-scale Cluster Nodes',
      tagline: 'Instant containerized deployment with guaranteed 10Gbps symmetric pipe bandwidth.',
      sponsor: 'COMMANDNEXUS CLOUD',
      ctaText: 'Deploy Node',
      accent: 'orange'
    },
    {
      id: 'utubechat-pro',
      title: 'UTubeChat Live Multi-user Workspaces',
      tagline: 'Collaborative canvases, real-time shared state streams, and H.265 HD video calls.',
      sponsor: 'UTUBE INTERACTIVE',
      ctaText: 'Launch Workspace',
      accent: 'orange'
    },
    {
      id: 'nexusvault-backup',
      title: 'NexusVault Double-Redundant Archiving',
      tagline: 'Secure cold-storage with offline air-gapped cryptographic validation checks.',
      sponsor: 'NEXUSVAULT SECURE',
      ctaText: 'Secure Backup',
      accent: 'orange'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const rotateAd = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const activeAd = ads[currentIndex];

  const handleCtaClick = () => {
    if (onInteract) {
      onInteract(activeAd.title);
    } else {
      alert(`Connecting to ${activeAd.sponsor} gateway for secure redirect...`);
    }
  };

  const renderIcon = () => {
    switch (currentIndex) {
      case 0: return <Server className="w-5 h-5 text-gray-700 animate-pulse" />;
      case 1: return <Sparkles className="w-5 h-5 text-gray-700" />;
      case 2: return <Database className="w-5 h-5 text-gray-700" />;
      default: return <Cpu className="w-5 h-5 text-gray-700" />;
    }
  };

  return (
    <div className="w-full mt-6 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl p-4 relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Sponsor watermark badge */}
      <div className="absolute top-0 right-0 bg-gray-300 text-gray-700 font-mono text-[8px] font-bold px-2.5 py-0.5 rounded-bl uppercase tracking-widest border-l border-b border-gray-400">
        SPONSOR
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Ad icon and text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="p-2.5 bg-white/80 rounded-lg border border-gray-300 flex items-center justify-center shadow-sm shrink-0">
            {renderIcon()}
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-mono font-bold text-orange-brand/90 uppercase tracking-widest block">
              {activeAd.sponsor}
            </span>
            <h4 className="text-xs font-display font-extrabold text-gray-900 mt-0.5 truncate leading-tight">
              {activeAd.title}
            </h4>
            <p className="text-[11px] text-gray-600 mt-1 line-clamp-1 leading-snug">
              {activeAd.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {/* Rotate Trigger */}
          <button
            onClick={rotateAd}
            className="p-2 text-gray-500 hover:text-orange-brand rounded-lg hover:bg-gray-300 transition-colors border border-transparent hover:border-gray-300"
            title="Next Promotion"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Call to action Button - Highlighted in vibrant dark transparent orange */}
          <button
            onClick={handleCtaClick}
            className="px-3.5 py-1.5 bg-orange-trans hover:bg-orange-brand/20 text-orange-brand border border-orange-brand/35 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200"
          >
            {activeAd.ctaText}
          </button>
        </div>
      </div>
      
      {/* Micro indicator dots */}
      <div className="flex justify-center items-center gap-1 mt-2.5">
        {ads.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-4 bg-orange-brand' : 'bg-gray-400 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
