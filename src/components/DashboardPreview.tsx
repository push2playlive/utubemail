import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Palette, 
  Inbox, 
  ShieldAlert, 
  ShieldCheck, 
  HardDrive, 
  Mail, 
  Trash2, 
  Star, 
  Send, 
  Lock, 
  EyeOff, 
  ChevronRight, 
  Key, 
  Sparkles,
  AlertTriangle,
  UserCheck,
  Activity,
  Globe,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { UserProfile, Email } from '../types';

export interface SecurityLog {
  id: string;
  event: string;
  status: 'success' | 'warning' | 'blocked';
  ipAddress: string;
  location: string;
  timestamp: string;
  fingerprint: string;
  device: string;
}

interface DashboardPreviewProps {
  currentTier: 'standard' | 'premium';
  onTierChange: (tier: 'standard' | 'premium') => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({
  currentTier,
  onTierChange,
  userProfile,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'mailbox' | 'settings' | 'profile' | 'theme' | 'security-log'>('mailbox');
  const [draftSubject, setDraftSubject] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      sender: 'CommandNexus Central',
      senderEmail: 'core@commandnexus.net',
      recipient: userProfile.email,
      subject: 'Security Credential Handshake Verification',
      body: 'Your cryptographic handshake has completed successfully. Node connection to CommandNexus is validated. Storage synchronization is online.',
      date: 'Today, 10:42 AM',
      isRead: false,
      isStarred: true,
      isEncrypted: true,
      size: '14.2 KB'
    },
    {
      id: '2',
      sender: 'UTubechat Team',
      senderEmail: 'welcome@utubechat.com',
      recipient: userProfile.email,
      subject: 'Welcome to the UTube Ecosystem Network',
      body: 'Get started with UTubeChat to experience real-time secure communication, instant multi-user messaging boards, and linked global profile settings.',
      date: 'Yesterday',
      isRead: true,
      isStarred: false,
      isEncrypted: true,
      size: '22.8 KB'
    },
    {
      id: '3',
      sender: 'Sponsor Campaign',
      senderEmail: 'promo@partnernetwork.net',
      recipient: userProfile.email,
      subject: 'Special Offer: Expand your Cloud Container Capacity',
      body: 'Get 50% discount on standard high-performance cloud container hosting nodes this month. Click the sponsor button to unlock.',
      date: '2 days ago',
      isRead: true,
      isStarred: false,
      isEncrypted: false,
      size: '4.1 KB'
    }
  ]);

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    {
      id: 'log-1',
      event: 'Cryptographic Handshake Signed',
      status: 'success',
      ipAddress: '192.168.1.144',
      location: 'Stockholm, SE (Nexus Edge)',
      timestamp: 'Just now',
      fingerprint: 'SHA256:09ae38...c8f1',
      device: 'macOS Core / Safari 18'
    },
    {
      id: 'log-2',
      event: 'Successful Session Key Exchange',
      status: 'success',
      ipAddress: '172.56.21.90',
      location: 'Tokyo, JP (Central Relay)',
      timestamp: '5 mins ago',
      fingerprint: 'SHA256:88bc23...3a2f',
      device: 'NexusMobile App / iOS'
    },
    {
      id: 'log-3',
      event: 'Blocked Cross-Node Authorisation',
      status: 'blocked',
      ipAddress: '83.219.14.5',
      location: 'Kiev, UA (Untrusted Proxy)',
      timestamp: '2 hours ago',
      fingerprint: 'SIGN_ERR: INVALID_MAC',
      device: 'Unknown HTTP Client'
    },
    {
      id: 'log-4',
      event: 'Automatic Key Rotation Triggered',
      status: 'success',
      ipAddress: '127.0.0.1 (Loopback)',
      location: 'CommandNexus Central',
      timestamp: '1 day ago',
      fingerprint: 'SHA256:df4912...e3bb',
      device: 'Nexus Daemon Core'
    }
  ]);

  useEffect(() => {
    const events = [
      { event: 'Node Heartbeat Acknowledged', status: 'success', location: 'Frankfurt, DE (Enclave node)', device: 'Daemon core v2.8' },
      { event: 'Key Session Re-verification', status: 'success', location: 'Singapore, SG (East node)', device: 'Chrome / Linux Edge' },
      { event: 'Dynamic Key Rotation Signed', status: 'success', location: 'London, UK (Sovereign node)', device: 'NexusMobile v1.4' },
      { event: 'Cross-Node Authentication Attempt', status: 'warning', location: 'Unknown Proxy, HK', device: 'curl/7.68.0 API' }
    ];

    const interval = setInterval(() => {
      const rawEvent = events[Math.floor(Math.random() * events.length)];
      const randomIP = `185.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const randomHex = Math.random().toString(16).substring(2, 8);
      const now = new Date();
      const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newLog: SecurityLog = {
        id: `log-sim-${Date.now()}`,
        event: rawEvent.event,
        status: rawEvent.status as 'success' | 'warning' | 'blocked',
        ipAddress: randomIP,
        location: rawEvent.location,
        timestamp: `${timestamp} (Live Signal)`,
        fingerprint: `SHA256:${randomHex}...e102`,
        device: rawEvent.device
      };

      setSecurityLogs(prev => [newLog, ...prev.slice(0, 9)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Background style styles
  const getBgStyleClass = () => {
    switch (userProfile.bgGradientStyle) {
      case 'metallic':
        return 'bg-gradient-to-r from-[#d1cfcf] via-[#eae8e8] to-[#9c9a9a]';
      case 'dark-platinum':
        return 'bg-gradient-to-br from-[#4a4949] via-[#706f6f] to-[#262626] text-white';
      case 'stardust':
        return 'bg-gradient-to-tr from-gray-900 via-gray-800 to-slate-900 text-white';
      case 'soft-grey':
      default:
        return 'bg-gradient-to-r from-[#e3e1e1] to-[#cccccc]';
    }
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(emails.map(email => email.id === id ? { ...email, isStarred: !email.isStarred } : email));
  };

  const deleteEmail = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(emails.filter(email => email.id !== id));
    if (selectedEmail?.id === id) {
      setSelectedEmail(null);
    }
  };

  const handleCompose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftSubject || !draftBody) return;

    const newEmail: Email = {
      id: String(Date.now()),
      sender: userProfile.username,
      senderEmail: userProfile.email,
      recipient: 'core@commandnexus.net',
      subject: draftSubject,
      body: draftBody,
      date: 'Just now',
      isRead: true,
      isStarred: false,
      isEncrypted: currentTier === 'premium',
      size: '2.5 KB'
    };

    setEmails([newEmail, ...emails]);
    setDraftSubject('');
    setDraftBody('');
    alert(`Encrypted email dispatched to core@commandnexus.net under ${currentTier === 'premium' ? 'military-grade zero-knowledge key security' : 'standard transport security'}.`);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-300 shadow-xl overflow-hidden transition-all duration-300">
      
      {/* Mock Dashboard Top Control Bar */}
      <div className="bg-gray-900 text-white px-5 py-4 border-b border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-sm tracking-tight text-white uppercase">
                UTube Mail Terminal Preview
              </h3>
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                currentTier === 'premium' ? 'bg-orange-brand text-white glow-orange' : 'bg-gray-700 text-gray-300'
              }`}>
                {currentTier} tier
              </span>
            </div>
            <p className="text-[10px] font-mono text-gray-400">
              User Node: <span className="text-gray-200 font-bold">{userProfile.email}</span>
            </p>
          </div>
        </div>

        {/* Real-time switcher for users to toggle standard / premium view */}
        <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700 self-end sm:self-auto">
          <button
            onClick={() => onTierChange('standard')}
            className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded transition-all duration-200 ${
              currentTier === 'standard' 
                ? 'bg-gray-700 text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Standard View
          </button>
          <button
            onClick={() => onTierChange('premium')}
            className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded transition-all duration-200 ${
              currentTier === 'premium' 
                ? 'bg-orange-brand text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Premium View
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="grid lg:grid-cols-12 min-h-[480px]">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 bg-gray-50 border-r border-gray-200 p-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest block px-2 mb-2">
              Navigation Links
            </span>

            <button
              onClick={() => { setActiveTab('mailbox'); setSelectedEmail(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left ${
                activeTab === 'mailbox'
                  ? 'bg-orange-trans text-orange-brand font-bold border-l-4 border-orange-brand'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Cryptographic Mailbox</span>
              <span className="ml-auto text-[10px] bg-gray-200 text-gray-700 font-mono font-bold px-1.5 py-0.2 rounded-full">
                {emails.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left ${
                activeTab === 'profile'
                  ? 'bg-orange-trans text-orange-brand font-bold border-l-4 border-orange-brand'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Editing</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left ${
                activeTab === 'settings'
                  ? 'bg-orange-trans text-orange-brand font-bold border-l-4 border-orange-brand'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('theme')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left ${
                activeTab === 'theme'
                  ? 'bg-orange-trans text-orange-brand font-bold border-l-4 border-orange-brand'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>UI Theme Customizer</span>
            </button>

            <button
              onClick={() => setActiveTab('security-log')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left ${
                activeTab === 'security-log'
                  ? 'bg-orange-trans text-orange-brand font-bold border-l-4 border-orange-brand'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Security Activity Log</span>
              <span className="ml-auto text-[9px] bg-orange-brand/10 text-orange-brand font-mono font-bold px-1.5 py-0.2 rounded uppercase animate-pulse">
                LIVE
              </span>
            </button>
          </div>

          {/* Quick Profile Widget */}
          <div className="mt-8 pt-4 border-t border-gray-200 flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-brand to-amber-500 text-white font-mono font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
              {userProfile.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-gray-900 truncate flex items-center gap-1">
                {userProfile.username}
                <UserCheck className="w-3.5 h-3.5 text-orange-brand" />
              </h4>
              <p className="text-[10px] text-gray-500 font-mono truncate">{userProfile.email}</p>
            </div>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="lg:col-span-9 p-4 sm:p-6 bg-white flex flex-col justify-between">
          <div>
            
            {/* Tab 1: CRYPTOGRAPHIC MAILBOX */}
            {activeTab === 'mailbox' && (
              <div className="space-y-4">
                
                {/* Standard Tier Ad Banner at the top of the Mailbox list (as specified in guidelines) */}
                {currentTier === 'standard' && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <span className="text-[8px] font-mono font-bold bg-amber-200 text-amber-800 px-1.5 py-0.2 rounded uppercase mr-1.5">
                          Standard Native Ad
                        </span>
                        <span className="text-[11px] font-medium text-gray-700 truncate">
                          Upgrade to Premium Core to permanently strip all ad modules across apps!
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onTierChange('premium')}
                      className="text-[10px] font-mono text-orange-brand hover:underline font-bold shrink-0"
                    >
                      Remove Ads
                    </button>
                  </div>
                )}

                {/* Premium Header Indicators */}
                {currentTier === 'premium' && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                    <div className="text-xs">
                      <strong className="font-bold">Military-Grade End-to-End Encryption Enabled.</strong> Standard transport ads stripped. Zero-knowledge private key signatures active.
                    </div>
                  </div>
                )}

                {/* Email content split screen or single screen */}
                {!selectedEmail ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-display font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <Inbox className="w-4 h-4 text-orange-brand" />
                        Incoming Secure Dispatch
                      </h4>
                      <span className="text-[10px] font-mono text-gray-500">
                        Total Inbox Space: {currentTier === 'premium' ? '0.001% of 1 TB used' : '22.4% of 5 GB used'}
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                      {emails.map((email) => (
                        <div
                          key={email.id}
                          onClick={() => setSelectedEmail(email)}
                          className={`p-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition-all duration-150 ${
                            email.isRead ? 'bg-white' : 'bg-orange-trans/5'
                          }`}
                        >
                          {/* Cryptographic encryption lock icon */}
                          <div className="mt-1">
                            {email.isEncrypted && currentTier === 'premium' ? (
                              <Lock className="w-3.5 h-3.5 text-emerald-600" title="End-to-end encrypted letters" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-gray-400" title="Standard encryption only" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs truncate ${email.isRead ? 'text-gray-600' : 'text-gray-900 font-bold'}`}>
                                {email.sender}
                              </span>
                              <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                                {email.date}
                              </span>
                            </div>
                            <h5 className={`text-xs mt-0.5 truncate ${email.isRead ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>
                              {email.subject}
                            </h5>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5 leading-normal">
                              {email.body}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-center shrink-0">
                            <button
                              onClick={(e) => toggleStar(email.id, e)}
                              className="text-gray-400 hover:text-amber-500 transition-colors"
                            >
                              <Star className={`w-3.5 h-3.5 ${email.isStarred ? 'fill-amber-500 text-amber-500' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => deleteEmail(email.id, e)}
                              className="text-gray-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Compose Quick Form */}
                    <div className="mt-6 border-t border-gray-100 pt-5">
                      <h4 className="text-xs font-mono font-bold text-gray-600 uppercase tracking-widest mb-3">
                        Draft Cryptographic Letter
                      </h4>
                      <form onSubmit={handleCompose} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Subject line"
                          value={draftSubject}
                          onChange={(e) => setDraftSubject(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-brand"
                        />
                        <textarea
                          placeholder="Secure message body..."
                          rows={2}
                          value={draftBody}
                          onChange={(e) => setDraftBody(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-brand resize-none"
                        ></textarea>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                            {currentTier === 'premium' ? (
                              <span className="text-emerald-700 flex items-center gap-1 font-bold">
                                <Lock className="w-3 h-3" /> E2EE Armed
                              </span>
                            ) : (
                              <span className="text-amber-600 flex items-center gap-1">
                                Standard TLS
                              </span>
                            )}
                          </span>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-orange-brand text-white font-mono text-xs font-bold uppercase rounded-lg hover:bg-orange-brand/90 flex items-center gap-1.5 shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Dispatch Letter
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  // Email Details View
                  <div className="space-y-4">
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="text-xs font-mono text-orange-brand hover:underline flex items-center gap-1 mb-2"
                    >
                      ← Return to Cryptographic Inbox
                    </button>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                      <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">
                            {selectedEmail.subject}
                          </h4>
                          <span className="text-xs text-gray-600 block mt-0.5">
                            From: <span className="font-semibold text-gray-900">{selectedEmail.sender}</span> ({selectedEmail.senderEmail})
                          </span>
                          <span className="text-[10px] text-gray-500 block">
                            To: {selectedEmail.recipient}
                          </span>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <span className="text-[10px] font-mono text-gray-500">{selectedEmail.date}</span>
                          <span className="text-[9px] font-mono bg-white px-2 py-0.5 rounded border border-gray-300">
                            {selectedEmail.size}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line pt-2">
                        {selectedEmail.body}
                      </p>

                      <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                          {selectedEmail.isEncrypted ? (
                            <span className="text-emerald-700 flex items-center gap-1 font-bold">
                              <ShieldCheck className="w-3.5 h-3.5" /> Handshake Cipher Active
                            </span>
                          ) : (
                            <span className="text-gray-500 flex items-center gap-1">
                              Standard Transit Protection Only
                            </span>
                          )}
                        </span>
                        
                        <button
                          onClick={() => {
                            alert("Relaying decrypted message payload down to local key manager...");
                          }}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono text-[10px] uppercase font-bold rounded-lg transition-colors"
                        >
                          Decrypt Raw Hex
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: PROFILE EDITING */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h4 className="text-sm font-display font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-brand" />
                  Profile Editing
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Update your identity details linked directly to your global CommandNexus session token.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                      Username / Name Badge
                    </label>
                    <input
                      type="text"
                      value={userProfile.username}
                      onChange={(e) => onUpdateProfile({ username: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                      Secure Mail Address
                    </label>
                    {currentTier === 'premium' ? (
                      <div className="flex">
                        <input
                          type="text"
                          value={userProfile.email.split('@')[0]}
                          onChange={(e) => onUpdateProfile({ email: `${e.target.value}@utubemail.com` })}
                          className="w-full text-xs p-2.5 rounded-l-lg border border-gray-300 border-r-0 focus:outline-none focus:ring-1 focus:ring-orange-brand"
                        />
                        <span className="bg-gray-100 text-gray-600 px-3 flex items-center text-xs border border-gray-300 rounded-r-lg font-mono">
                          @utubemail.com
                        </span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex">
                          <input
                            type="text"
                            disabled
                            value={userProfile.username.toLowerCase()}
                            className="w-full text-xs p-2.5 rounded-l-lg border border-gray-300 border-r-0 bg-gray-50 text-gray-400 cursor-not-allowed"
                          />
                          <span className="bg-gray-100 text-gray-400 px-3 flex items-center text-xs border border-gray-300 rounded-r-lg font-mono">
                            @utubemail.free
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-600 mt-1 block font-mono">
                          ⚠️ Upgrade to Premium to request custom @utubemail.com aliases.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h5 className="text-xs font-bold text-gray-900 mb-1">Ecosystem Avatar</h5>
                  <p className="text-[11px] text-gray-500 mb-3">Your avatar is generated securely based on cryptographic seed tokens synced across apps.</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gray-700 to-gray-900 text-white font-mono text-lg font-bold flex items-center justify-center shadow">
                      {userProfile.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-gray-700 block">Seed Signature</span>
                      <code className="text-[10px] bg-white px-2 py-1 rounded border border-gray-300 text-gray-600 font-mono">
                        NEXUS-TOKEN-{userProfile.username.toUpperCase()}-SECURE
                      </code>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => alert("Ecosystem profile changes successfully committed to CommandNexus identity ledger.")}
                    className="px-4 py-2 bg-orange-brand text-white font-mono text-xs font-bold uppercase rounded-lg hover:bg-orange-brand/90 transition-all"
                  >
                    Commit Profile Changes
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: ACCOUNT SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h4 className="text-sm font-display font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-brand" />
                  Account Settings
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Configure server node allocations and encryption keys powering your secure mailbox.
                </p>

                <div className="space-y-4 mt-4">
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <h5 className="text-xs font-bold text-gray-900 flex items-center justify-between">
                      <span>Server Node Cryptographic Key</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono border border-emerald-200">
                        VALIDATED
                      </span>
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-1 mb-3">
                      Your unique asymmetric server-bound key signature that decrypts letters inside browser sandbox.
                    </p>
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-gray-500" />
                      <code className="text-[10px] font-mono bg-white p-2 rounded border border-gray-300 block w-full truncate text-gray-600">
                        ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDQg6Y30P1D6v6t7jU7x8xP2E3mK...
                      </code>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                    <h5 className="text-xs font-bold text-gray-900">
                      Disk Storage Partition Allocation
                    </h5>
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] font-mono text-gray-600 mb-1">
                        <span>Allocated Space</span>
                        <span>
                          {currentTier === 'premium' ? '41.2 MB / 1 TB' : '1.12 GB / 5 GB'}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-brand transition-all duration-500"
                          style={{ width: currentTier === 'premium' ? '0.01%' : '22.4%' }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 leading-relaxed font-mono">
                        Partition Code: <strong className="text-gray-700">UTUBEMAIL-SVD-{currentTier.toUpperCase()}-0932</strong>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="pr-4">
                      <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-orange-brand" />
                        <span>CommandNexus Security Alerts</span>
                      </h5>
                      <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                        Receive instant cryptographic signals on new node authorizations and key rotation events.
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const nextVal = userProfile.securityNotifications === false;
                        onUpdateProfile({ securityNotifications: nextVal });
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        userProfile.securityNotifications !== false ? 'bg-orange-brand' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          userProfile.securityNotifications !== false ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: THEME CUSTOMIZER */}
            {activeTab === 'theme' && (
              <div className="space-y-4">
                <h4 className="text-sm font-display font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <Palette className="w-4 h-4 text-orange-brand" />
                  UI Theme Customizer
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Real-time interactive color switcher. Click any preset to instantly adjust the theme gradient.
                </p>

                <div className="space-y-4 mt-4">
                  <div>
                    <span className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-2">
                      Gradient Background Preset
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => onUpdateProfile({ bgGradientStyle: 'soft-grey' })}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          userProfile.bgGradientStyle === 'soft-grey'
                            ? 'border-orange-brand bg-white font-bold ring-1 ring-orange-brand shadow-sm'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-xs block font-bold text-gray-900">Soft Grey</span>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">Classic subtle gradient</span>
                      </button>

                      <button
                        onClick={() => onUpdateProfile({ bgGradientStyle: 'metallic' })}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          userProfile.bgGradientStyle === 'metallic'
                            ? 'border-orange-brand bg-white font-bold ring-1 ring-orange-brand shadow-sm'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-xs block font-bold text-gray-900">Metallic Chrome</span>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">Brushed silver styling</span>
                      </button>

                      <button
                        onClick={() => onUpdateProfile({ bgGradientStyle: 'dark-platinum' })}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          userProfile.bgGradientStyle === 'dark-platinum'
                            ? 'border-orange-brand bg-white font-bold ring-1 ring-orange-brand shadow-sm'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-xs block font-bold text-gray-900">Dark Platinum</span>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">Sleek deep charcoal</span>
                      </button>

                      <button
                        onClick={() => onUpdateProfile({ bgGradientStyle: 'stardust' })}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          userProfile.bgGradientStyle === 'stardust'
                            ? 'border-orange-brand bg-white font-bold ring-1 ring-orange-brand shadow-sm'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <span className="text-xs block font-bold text-gray-900">Cosmic Stardust</span>
                        <span className="text-[10px] text-gray-500 font-mono block mt-0.5">Midnight black sky</span>
                      </button>
                    </div>
                  </div>

                  {/* Showcase Theme Contrast box */}
                  <div className="mt-4">
                    <span className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-2">
                      Live Color Card Showcase
                    </span>
                    <div className={`p-4 rounded-xl border border-gray-300 transition-all duration-300 ${getBgStyleClass()}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-bold font-display uppercase tracking-wider">UTube Mail Container</h5>
                          <p className="text-[10px] opacity-80">This is a dynamic render of your selected background gradient.</p>
                        </div>
                        <span className="text-[9px] font-mono bg-black/20 px-2 py-0.5 rounded text-inherit uppercase">
                          {userProfile.bgGradientStyle}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: SECURITY ACTIVITY LOG */}
            {activeTab === 'security-log' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-sm font-display font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-brand animate-pulse" />
                      Security Activity Log
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-normal">
                      Monitor real-time cryptographic handshakes, secure node logins, and proxy authorization attempts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const randomIP = `185.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                        const randomHex = Math.random().toString(16).substring(2, 8);
                        const now = new Date();
                        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                        const newLog: SecurityLog = {
                          id: `log-sim-${Date.now()}`,
                          event: 'Manual Signature Handshake Signed',
                          status: 'success',
                          ipAddress: randomIP,
                          location: 'Berlin, DE (Edge Node)',
                          timestamp: `${timestamp} (Manual)`,
                          fingerprint: `SHA256:${randomHex}...f932`,
                          device: 'Chrome v126 (Sovereign Core)'
                        };
                        setSecurityLogs(prev => [newLog, ...prev]);
                      }}
                      className="px-2.5 py-1.5 bg-orange-brand text-white font-mono text-[10px] font-bold uppercase rounded-lg hover:bg-orange-brand/90 transition-all flex items-center gap-1 shadow-xs cursor-pointer select-none"
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                      Inject Handshake Signal
                    </button>
                    <button
                      type="button"
                      onClick={() => setSecurityLogs([])}
                      className="px-2.5 py-1.5 bg-gray-100 text-gray-600 hover:text-gray-900 font-mono text-[10px] uppercase rounded-lg hover:bg-gray-200 transition-all cursor-pointer select-none"
                    >
                      Clear Logs
                    </button>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">Integrity Ratio</span>
                    <span className="text-sm font-bold font-display text-emerald-600 block mt-0.5">100.0% Protected</span>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">Recorded Signals</span>
                    <span className="text-sm font-bold font-display text-gray-900 block mt-0.5">{securityLogs.length} Events</span>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">Intercepted Relays</span>
                    <span className="text-sm font-bold font-display text-rose-600 block mt-0.5">
                      {securityLogs.filter(l => l.status === 'blocked').length} Terminated
                    </span>
                  </div>
                </div>

                {/* Log Feed */}
                {securityLogs.length === 0 ? (
                  <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Terminal className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-mono text-gray-500">Security buffer cleared. Awaiting live telemetry signals...</p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 grid grid-cols-12 gap-2 text-[9px] font-mono text-gray-500 uppercase tracking-wider font-bold">
                      <div className="col-span-4">Event Signature & Status</div>
                      <div className="col-span-3">Network Location</div>
                      <div className="col-span-2">IP Address</div>
                      <div className="col-span-3">Handshake Timestamp</div>
                    </div>
                    <div className="divide-y divide-gray-100 bg-white max-h-[320px] overflow-y-auto">
                      {securityLogs.map((log) => (
                        <div key={log.id} className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50/70 transition-all">
                          {/* Event & Status Column */}
                          <div className="col-span-4 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${
                                log.status === 'success' ? 'bg-emerald-500' :
                                log.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                              }`} />
                              <span className="text-xs font-bold text-gray-900 truncate">
                                {log.event}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 block pl-4 truncate">
                              {log.fingerprint}
                            </span>
                          </div>

                          {/* Location Column */}
                          <div className="col-span-3 min-w-0">
                            <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                              <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="truncate">{log.location}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 truncate block pl-5 font-mono">
                              {log.device}
                            </span>
                          </div>

                          {/* IP Column */}
                          <div className="col-span-2">
                            <code className="text-[10px] font-mono bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-700">
                              {log.ipAddress}
                            </code>
                          </div>

                          {/* Timestamp Column */}
                          <div className="col-span-3 text-right">
                            <span className="text-[11px] font-mono font-bold text-gray-600 block">
                              {log.timestamp}
                            </span>
                            <span className="text-[9px] font-mono uppercase text-gray-400 block tracking-widest">
                              {log.status === 'success' ? 'VERIFIED' : log.status === 'warning' ? 'ALERTED' : 'BLOCKED'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-orange-brand/[0.02] border border-orange-brand/20 rounded-xl flex items-start gap-2.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-orange-brand shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-600 leading-normal">
                    <strong>Cryptographic Node Synchronization:</strong> All network events are securely broadcast over authenticated WebSockets. Handshake records are stored inside your browser sandbox and synchronized dynamically with the CommandNexus key ledger.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Core branding and Ecosystem Info */}
          <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span>Synchronized with CommandNexus Core</span>
            <span className="flex items-center gap-1 text-orange-brand font-semibold">
              <Sparkles className="w-3 h-3 fill-orange-brand/20" /> Sovereign E2EE Node Verified
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
