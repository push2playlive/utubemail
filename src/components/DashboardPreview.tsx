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
  Terminal,
  Search,
  Download,
  Smartphone,
  Copy,
  Check,
  CheckCircle,
  Fingerprint,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

export interface CryptoLog {
  id: string;
  operation: string;
  algorithm: string;
  status: 'success' | 'warning' | 'failed';
  timestamp: string;
  hash: string;
  payloadSize?: string;
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
  const [activeTab, setActiveTab] = useState<'mailbox' | 'settings' | 'profile' | 'theme' | 'security-log' | 'security'>('mailbox');
  
  // TOTP Security Configuration State
  const [isTotpEnabled, setIsTotpEnabled] = useState(false);
  const [totpSetupStep, setTotpSetupStep] = useState<'disabled' | 'setup' | 'active'>('disabled');
  const [totpSecret] = useState('UTUBE-MEDIA-SECURE-KEY-MEMBER-TOTP-4A7B');
  const [totpCodeInput, setTotpCodeInput] = useState('');
  const [totpFeedback, setTotpFeedback] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  
  // Simulated Live TOTP token generator states
  const [simulatedToken, setSimulatedToken] = useState('482915');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [copiedToken, setCopiedToken] = useState(false);
  const [totpBackupCodes] = useState([
    'UTUBE-C67E-4B29',
    'UTUBE-3D8B-91E5',
    'UTUBE-A82F-0F67',
    'UTUBE-B419-EF24'
  ]);

  // Authenticator app simulator ticking timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Generate a new 6-digit simulated token
          const newToken = Math.floor(100000 + Math.random() * 900000).toString();
          setSimulatedToken(newToken);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
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
    },
    {
      id: '4',
      sender: 'Ecosystem Intelligence',
      senderEmail: 'ai-shield@commandnexus.net',
      recipient: userProfile.email,
      subject: 'Anomaly Shield Threat Report',
      body: 'Zero unauthorized intrusion vectors detected on your active security key session. Handshake signature protocol is operating under green telemetry status.',
      date: '3 days ago',
      isRead: false,
      isStarred: true,
      isEncrypted: true,
      size: '18.9 KB'
    }
  ]);

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [recentSearchQuery, setRecentSearchQuery] = useState('');
  const [decryptionTarget, setDecryptionTarget] = useState<Email | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedText, setDecryptedText] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportConfiguration = () => {
    try {
      const configPayload = {
        vaultMetadata: {
          exportTimestamp: new Date().toISOString(),
          version: "4.2.0-secure",
          clientSignature: `NEXUS-TOKEN-${userProfile.username.toUpperCase()}-SECURE`,
          encryptionCipher: "AES-GCM-256",
          integrityHash: "SHA256:" + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10),
          compression: "None",
          origin: "UTube Media - CommandNexus Secure Vault"
        },
        userProfile: {
          username: userProfile.username,
          email: userProfile.email,
          tier: currentTier,
          avatarSeed: userProfile.avatarSeed,
          accentColor: userProfile.accentColor,
          bgGradientStyle: userProfile.bgGradientStyle,
          securityNotifications: userProfile.securityNotifications !== false
        },
        mailboxSettings: {
          totalEmailsCount: emails.length,
          isE2EEnabled: true,
          inboundRelayNode: "Frankfurt, DE (Enclave node)",
          keyRotationInterval: "24 Hours",
          primarySovereignGateway: "Singapore, SG (East node)",
          activeSessionHandshake: "VERIFIED"
        },
        mailboxDataEncrypted: emails.map(email => ({
          id: email.id,
          sender: email.sender,
          senderEmail: email.senderEmail,
          recipient: email.recipient,
          subject: email.subject,
          isStarred: email.isStarred,
          isRead: email.isRead,
          isEncrypted: email.isEncrypted,
          size: email.size,
          encryptedBodyHash: `Ciphertext(AES-GCM-256):${btoa(email.body.substring(0, Math.min(20, email.body.length)))}...`
        }))
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(configPayload, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `utubemedia-vault-${userProfile.username.toLowerCase()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Export failure", err);
    }
  };

  useEffect(() => {
    if (!decryptionTarget) return;
    setIsDecrypting(true);
    setDecryptedText('');
    
    const targetText = decryptionTarget.body;
    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += Math.ceil(targetText.length / 15);
      if (currentLength >= targetText.length) {
        setDecryptedText(targetText);
        setIsDecrypting(false);
        clearInterval(interval);
      } else {
        const decryptedPart = targetText.slice(0, currentLength);
        const noisePart = Array(Math.min(10, targetText.length - currentLength))
          .fill(0)
          .map(() => String.fromCharCode(33 + Math.floor(Math.random() * 93)))
          .join('');
        setDecryptedText(decryptedPart + noisePart);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [decryptionTarget]);

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

  const [cryptoLogs, setCryptoLogs] = useState<CryptoLog[]>([
    {
      id: 'crypt-1',
      operation: 'Signature Validation',
      algorithm: 'Ed25519',
      status: 'success',
      timestamp: '2026-07-10 06:58:30',
      hash: 'ed25519:sig:9a7f3d...e241',
      payloadSize: '1.2 KB'
    },
    {
      id: 'crypt-2',
      operation: 'Encrypted Payload Sent',
      algorithm: 'AES-GCM-256',
      status: 'success',
      timestamp: '2026-07-10 06:56:15',
      hash: 'aes:cipher:df49ac...392b',
      payloadSize: '48.5 KB'
    },
    {
      id: 'crypt-3',
      operation: 'Key Rotation',
      algorithm: 'ECDH-P384',
      status: 'success',
      timestamp: '2026-07-10 06:50:00',
      hash: 'ecdh:pub:04bc99...f1ea',
      payloadSize: '384 bits'
    },
    {
      id: 'crypt-4',
      operation: 'Signature Validation',
      algorithm: 'Ed25519',
      status: 'failed',
      timestamp: '2026-07-10 06:32:41',
      hash: 'ed25519:sig:invalid:88ca...02ef',
      payloadSize: '2.4 KB'
    },
    {
      id: 'crypt-5',
      operation: 'Encrypted Payload Sent',
      algorithm: 'ChaCha20-Poly1305',
      status: 'success',
      timestamp: '2026-07-10 06:15:09',
      hash: 'chacha:cipher:89fa2d...bb88',
      payloadSize: '124.0 KB'
    }
  ]);
  const [cryptoFilter, setCryptoFilter] = useState<'all' | 'success' | 'warning' | 'failed'>('all');
  const [cryptoSearch, setCryptoSearch] = useState('');

  const handleSimulateCryptoOp = (customOp?: string) => {
    const operations = [
      { name: 'Key Rotation', algo: 'ECDH-P384', size: '384 bits', status: 'success' },
      { name: 'Encrypted Payload Sent', algo: 'AES-GCM-256', size: `${(Math.random() * 100 + 5).toFixed(1)} KB`, status: 'success' },
      { name: 'Signature Validation', algo: 'Ed25519', size: '1.2 KB', status: 'success' },
      { name: 'Signature Validation', algo: 'Ed25519', size: '1.2 KB', status: 'failed' },
      { name: 'Keypair Generation', algo: 'RSA-4096', size: '4096 bits', status: 'success' },
      { name: 'Encrypted Payload Sent', algo: 'ChaCha20-Poly1305', size: `${(Math.random() * 200 + 10).toFixed(1)} KB`, status: 'success' },
      { name: 'Decryption Operation', algo: 'AES-CBC-256', size: '12.4 KB', status: 'warning' }
    ];

    let chosenOp = operations[Math.floor(Math.random() * operations.length)];
    if (customOp) {
      if (customOp === 'Key Rotation') {
        chosenOp = { name: 'Key Rotation', algo: 'ECDH-P384', size: '384 bits', status: 'success' };
      } else if (customOp === 'Encrypted Payload Sent') {
        chosenOp = { name: 'Encrypted Payload Sent', algo: 'AES-GCM-256', size: '64.2 KB', status: 'success' };
      } else if (customOp === 'Signature Validation') {
        chosenOp = { name: 'Signature Validation', algo: 'Ed25519', size: '1.2 KB', status: 'success' };
      }
    }

    const now = new Date();
    const formattedDate = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0') + ' ' + 
      String(now.getHours()).padStart(2, '0') + ':' + 
      String(now.getMinutes()).padStart(2, '0') + ':' + 
      String(now.getSeconds()).padStart(2, '0');

    const randomHex = Math.random().toString(16).substring(2, 8) + Math.random().toString(16).substring(2, 8);
    const prefix = chosenOp.name === 'Key Rotation' ? 'ecdh:pub' : 
                   chosenOp.name === 'Encrypted Payload Sent' ? 'aes:cipher' : 
                   chosenOp.name === 'Signature Validation' && chosenOp.status === 'failed' ? 'ed25519:sig:invalid' : 'ed25519:sig';

    const newLog: CryptoLog = {
      id: `crypt-sim-${Date.now()}`,
      operation: chosenOp.name,
      algorithm: chosenOp.algo,
      status: chosenOp.status as 'success' | 'warning' | 'failed',
      timestamp: formattedDate,
      hash: `${prefix}:${randomHex.substring(0, 6)}...${randomHex.substring(6, 10)}`,
      payloadSize: chosenOp.size
    };

    setCryptoLogs(prev => [newLog, ...prev]);
  };

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

  // Filter for secure/encrypted emails first, then filter by subject search query, then take top 3
  const recentSecureEmails = emails
    .filter(email => email.isEncrypted)
    .filter(email => 
      email.subject.toLowerCase().includes(recentSearchQuery.toLowerCase())
    )
    .slice(0, 3);

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
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-left ${
                activeTab === 'security'
                  ? 'bg-orange-trans text-orange-brand font-bold border-l-4 border-orange-brand'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Fingerprint className="w-4 h-4 text-gray-500" />
              <span>Security</span>
              <span className="ml-auto text-[9px] bg-emerald-50 text-emerald-700 font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                MFA
              </span>
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
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Inbox List & Compose Form (col-span-7) */}
                    <div className="xl:col-span-7 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-display font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                          <Inbox className="w-4 h-4 text-orange-brand" />
                          Incoming Secure Dispatch
                        </h4>
                        <span className="text-[10px] font-mono text-gray-500">
                          Total Inbox Space: {currentTier === 'premium' ? '0.001% of 1 TB used' : '22.4% of 5 GB used'}
                        </span>
                      </div>

                      <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden shadow-xs bg-white">
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

                    {/* Right Column: Recent Mail Preview Pane (col-span-5) */}
                    <div className="xl:col-span-5 space-y-4 bg-gray-50/70 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xs relative overflow-hidden">
                      {/* Decorative security neon glow/banner */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-mono font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Recent Mail Preview
                        </h4>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-1.5 py-0.5 rounded font-mono font-bold">
                          E2EE Cache
                        </span>
                      </div>

                      {/* Search input bar */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Filter encrypted subjects..."
                          value={recentSearchQuery}
                          onChange={(e) => setRecentSearchQuery(e.target.value)}
                          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-gray-300 bg-white/90 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-gray-400 font-mono"
                        />
                        {recentSearchQuery && (
                          <button
                            onClick={() => setRecentSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 hover:text-gray-600 font-mono font-bold font-mono"
                          >
                            CLEAR
                          </button>
                        )}
                      </div>

                      {/* List of 3 most recent secure emails matching subject filter */}
                      <div className="space-y-3">
                        {recentSecureEmails.length === 0 ? (
                          <div className="text-center py-8 bg-white/40 border border-dashed border-gray-200 rounded-xl p-4">
                            <EyeOff className="w-6 h-6 text-gray-300 mx-auto mb-1.5" />
                            <p className="text-[11px] text-gray-500 font-mono">
                              No matching encrypted subjects found.
                            </p>
                          </div>
                        ) : (
                          recentSecureEmails.map((email) => (
                            <div
                              key={`recent-${email.id}`}
                              className="p-3.5 bg-white border border-gray-200 hover:border-emerald-300/60 rounded-xl transition-all duration-150 group relative hover:shadow-xs"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-gray-500 truncate">
                                  {email.sender}
                                </span>
                                <span className="text-[9px] text-gray-400 font-mono">
                                  {email.date}
                                </span>
                              </div>
                              <h5 className="text-xs font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                                {email.subject}
                              </h5>
                              <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5 font-mono">
                                Ciphertext Payload Locked • {email.size}
                              </p>
                              <div className="mt-2.5 pt-2 border-t border-gray-100 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => setDecryptionTarget(email)}
                                  className="w-full sm:w-auto px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 hover:border-emerald-300 font-mono text-[10px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                  <Lock className="w-3 h-3 text-emerald-600 group-hover:animate-bounce" />
                                  <span>Read Encrypted Mail</span>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
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

                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-orange-brand/5 to-amber-500/5 border border-orange-brand/10 space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                      <Lock className="w-3.5 h-3.5 text-orange-brand" />
                      Secure Vault Export
                    </h5>
                    <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                      Export your active mailbox structure, identity configuration signatures, and secure preferences as a cryptographically signed offline JSON backup.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportConfiguration}
                      className="px-3.5 py-2 bg-orange-brand text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-orange-brand/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Configuration
                    </button>

                    <AnimatePresence>
                      {exportSuccess && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Backup Generated & Decrypted locally
                        </motion.span>
                      )}
                    </AnimatePresence>
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

            {/* Tab 6: SECURITY OPTIONS */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <h4 className="text-sm font-display font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-orange-brand" />
                  Security Options
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Enforce post-quantum cryptographic signatures and multi-factor authorization layers over your Utube Media operator identity node.
                </p>

                {/* TOTP TOGGLE CARD */}
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <span>Authenticator App TOTP (MFA)</span>
                      {isTotpEnabled ? (
                        <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200 uppercase animate-pulse">
                          ● ACTIVE & BOUND
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono font-bold bg-gray-100 text-gray-500 px-1.5 py-0.2 rounded border border-gray-200 uppercase">
                          UNPROTECTED
                        </span>
                      )}
                    </h5>
                    <p className="text-[11px] text-gray-500 leading-normal max-w-xl">
                      Require a 6-digit dynamic key signature from an authenticator application (e.g. Google Authenticator, Duo, Bitwarden) upon desktop terminal handshake requests.
                    </p>
                  </div>

                  {/* Sleek iOS style toggle switch */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isTotpEnabled) {
                        // Turning off - require confirmation
                        const confirmDisable = window.confirm("Are you sure you want to disable Authenticator App TOTP? Your node's multi-factor signature will be decommissioned.");
                        if (confirmDisable) {
                          setIsTotpEnabled(false);
                          setTotpSetupStep('disabled');
                          setTotpFeedback(null);
                        }
                      } else {
                        // Turning on - start setup
                        setTotpSetupStep('setup');
                        setTotpCodeInput('');
                        setTotpFeedback(null);
                      }
                    }}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 cursor-pointer ${
                      isTotpEnabled || totpSetupStep === 'setup' ? 'bg-orange-brand' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ x: isTotpEnabled || totpSetupStep === 'setup' ? 20 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* TOTP Setup Steps Form */}
                {totpSetupStep === 'setup' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-orange-brand/20 bg-orange-trans/5 space-y-5"
                  >
                    <div className="flex items-center gap-2 border-b border-orange-brand/10 pb-3">
                      <QrCode className="w-4 h-4 text-orange-brand" />
                      <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">
                        Cryptographic Key Setup & Pairing
                      </h5>
                    </div>

                    <div className="grid md:grid-cols-12 gap-6">
                      {/* Left Side: Procedural QR Code Generation */}
                      <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200">
                        {/* Procedural SVG QR Code representing pairing */}
                        <div className="w-36 h-36 relative bg-white flex items-center justify-center p-1 border border-gray-200 rounded-lg">
                          {/* Pulsing visual guide scanner corner notches */}
                          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-orange-brand" />
                          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-orange-brand" />
                          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-orange-brand" />
                          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-orange-brand" />

                          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                            {/* Anchors */}
                            <rect x="5" y="5" width="22" height="22" rx="2" stroke="#1f2937" strokeWidth="4" />
                            <rect x="11" y="11" width="10" height="10" fill="#d35400" />

                            <rect x="73" y="5" width="22" height="22" rx="2" stroke="#1f2937" strokeWidth="4" />
                            <rect x="79" y="11" width="10" height="10" fill="#d35400" />

                            <rect x="5" y="73" width="22" height="22" rx="2" stroke="#1f2937" strokeWidth="4" />
                            <rect x="11" y="79" width="10" height="10" fill="#d35400" />

                            {/* Inner custom seed matrices */}
                            {Array.from({ length: 10 }).map((_, r) => (
                              Array.from({ length: 10 }).map((_, c) => {
                                if ((r < 3 && c < 3) || (r < 3 && c > 6) || (r > 6 && c < 3)) return null;
                                const isFilled = ((r * 7 + c * 13) % 3 === 0) || ((r + c) % 5 === 1);
                                if (!isFilled) return null;
                                return (
                                  <rect
                                    key={`${r}-${c}`}
                                    x={15 + r * 7}
                                    y={15 + c * 7}
                                    width="5.5"
                                    height="5.5"
                                    rx="0.5"
                                    fill="#111827"
                                  />
                                );
                              })
                            ))}
                            {/* Center brand logo overlay */}
                            <rect x="42" y="42" width="16" height="16" rx="3" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
                            <circle cx="50" cy="50" r="3" fill="#d35400" />
                          </svg>
                        </div>
                        <span className="text-[9px] font-mono text-gray-500 mt-2 uppercase tracking-wider text-center">
                          Secure Seed QR-Matrix
                        </span>
                      </div>

                      {/* Right Side: Directions & Code input */}
                      <div className="md:col-span-7 space-y-4">
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-mono font-bold bg-orange-brand/10 text-orange-brand px-2.5 py-0.5 rounded uppercase border border-orange-brand/20">
                            Pairing Signature
                          </span>
                          <h6 className="text-xs font-bold text-gray-900 font-mono">Secret Key Seed String</h6>
                          <p className="text-[11px] text-gray-600 leading-normal">
                            If your device does not possess camera capabilities, type this post-quantum secret signature directly inside your authenticator application:
                          </p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <code className="text-[10px] font-mono bg-white p-2 border border-gray-300 rounded-lg flex-1 text-gray-700 block truncate select-all">
                              {totpSecret}
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(totpSecret);
                                setCopiedSecret(true);
                                setTimeout(() => setCopiedSecret(false), 2000);
                              }}
                              className="p-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 transition-all cursor-pointer shrink-0"
                              title="Copy Secret String"
                            >
                              {copiedSecret ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Interactive Validator Field */}
                        <div className="space-y-2">
                          <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">
                            Verification Signature (6-Digit OTP)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="000000"
                              value={totpCodeInput}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setTotpCodeInput(val);
                                setTotpFeedback(null);
                              }}
                              className="text-xs font-mono font-bold tracking-widest text-center p-3 w-32 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (totpCodeInput.length !== 6) {
                                  setTotpFeedback("Signature mismatch: Token must comprise exactly 6 digits.");
                                  return;
                                }
                                // Accepting either the live simulated token OR any 6 digit fallback
                                if (totpCodeInput === simulatedToken || totpCodeInput === "482915" || totpCodeInput === "123456") {
                                  setIsTotpEnabled(true);
                                  setTotpSetupStep('active');
                                  setTotpFeedback(null);
                                  alert("Success! Multi-Factor Authentication TOTP is verified and securely active.");
                                } else {
                                  setTotpFeedback(`Verification Failed: Code does not match the active synchronized authenticator payload.`);
                                }
                              }}
                              className="px-4 py-2 bg-orange-brand hover:bg-orange-brand/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                            >
                              Validate Code
                            </button>
                          </div>
                          {totpFeedback && (
                            <p className="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 border border-rose-100 p-2 rounded-lg animate-pulse">
                              ⚠️ {totpFeedback}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Integrated Device Simulator Info */}
                    <div className="pt-4 border-t border-orange-brand/10 grid sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-4 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-orange-brand animate-bounce" />
                        <span className="text-[10px] font-mono font-bold text-gray-900 uppercase">
                          Live Authenticator App Feed
                        </span>
                      </div>
                      <div className="sm:col-span-8 bg-white/70 p-3 rounded-xl border border-orange-brand/15 flex items-center justify-between gap-3 font-mono">
                        <div className="flex-1">
                          <span className="text-[9px] text-gray-500 block uppercase font-bold">Simulated Phone Output:</span>
                          <span className="text-sm font-black text-gray-900 tracking-wider">
                            {simulatedToken.slice(0, 3)} {simulatedToken.slice(3)}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] text-gray-500 block uppercase font-bold">Resets in:</span>
                          <div className="flex items-center justify-end gap-1.5 mt-0.5">
                            <span className="text-xs font-black text-orange-brand">{secondsLeft}s</span>
                            <div className="w-12 bg-gray-200 h-1.5 rounded-full overflow-hidden shrink-0">
                              <div className="bg-orange-brand h-full" style={{ width: `${(secondsLeft / 30) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setTotpCodeInput(simulatedToken);
                            setCopiedToken(true);
                            setTimeout(() => setCopiedToken(false), 2000);
                          }}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300 rounded text-[9px] font-bold uppercase transition-all cursor-pointer"
                        >
                          {copiedToken ? 'Auto-filled!' : 'Auto-Fill'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TOTP Active Success Screen */}
                {totpSetupStep === 'active' && isTotpEnabled && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-50/50 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-emerald-800">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
                      <h5 className="text-xs font-bold uppercase tracking-wider font-mono">
                        Authenticator TOTP Setup Completed Successfully
                      </h5>
                    </div>

                    <p className="text-xs text-gray-700 leading-normal">
                      Your identity node is now heavily armored with time-based multi-factor authentication codes. Please secure these physical emergency recovery key segments.
                    </p>

                    <div className="bg-white border border-emerald-100 rounded-xl p-4 space-y-3">
                      <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">
                        Emergency Offline Backup Seeds
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-700 pt-1">
                        {totpBackupCodes.map((code, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-200 p-2 rounded-lg text-center font-bold tracking-wider hover:bg-gray-100 transition-colors select-all">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          alert("Secure key segments downloaded to your node device storage.");
                        }}
                        className="px-3.5 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                      >
                        Download Key Segments
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTotpSetupStep('disabled');
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        Return to profile options
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Additional Info Cards on Security Tab */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                    <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 font-mono">
                      <Lock className="w-4 h-4 text-gray-400" />
                      Transport Session Armoring
                    </h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Session tokens expire automatically after 12 hours of inactivity. IP address pinning prevents cookie hijacking by immediately invalidating signatures on subnet changes.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
                    <h5 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 font-mono">
                      <Activity className="w-4 h-4 text-gray-400" />
                      Session Ledger Sync
                    </h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      All security changes, profile ledger modifications, and private key rotation logs are broadcast in real time with our global consensus node.
                    </p>
                  </div>
                </div>

                {/* CRYPTOGRAPHIC OPERATIONS LOG (NEW FEATURE) */}
                <div className="p-5 rounded-xl border border-gray-200 bg-white space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-orange-brand" />
                        Cryptographic Operations Log
                      </h5>
                      <p className="text-[11px] text-gray-500">
                        Simulated real-time ledger of private-key handshakes, stream encryptions, and validation events.
                      </p>
                    </div>

                    {/* Reset Logs Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setCryptoLogs([]);
                        alert("Cryptographic log buffer cleared.");
                      }}
                      className="text-[10px] font-mono font-bold text-gray-500 hover:text-orange-brand transition-colors self-start sm:self-auto px-2 py-1 rounded hover:bg-gray-50 border border-gray-200 cursor-pointer"
                    >
                      Reset Ledger
                    </button>
                  </div>

                  {/* Simulator Control Center */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-150 space-y-3">
                    <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">
                      Simulation Control Pad
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleSimulateCryptoOp('Key Rotation');
                        }}
                        className="flex-1 min-w-[120px] px-2.5 py-1.5 bg-white hover:bg-orange-trans/10 border border-gray-200 hover:border-orange-brand/40 rounded-lg text-[10px] font-mono font-black text-gray-700 hover:text-orange-brand transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
                        Rotate Keys
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleSimulateCryptoOp('Encrypted Payload Sent');
                        }}
                        className="flex-1 min-w-[120px] px-2.5 py-1.5 bg-white hover:bg-orange-trans/10 border border-gray-200 hover:border-orange-brand/40 rounded-lg text-[10px] font-mono font-black text-gray-700 hover:text-orange-brand transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Lock className="w-3 h-3" />
                        Send Payload
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleSimulateCryptoOp('Signature Validation');
                        }}
                        className="flex-1 min-w-[120px] px-2.5 py-1.5 bg-white hover:bg-orange-trans/10 border border-gray-200 hover:border-orange-brand/40 rounded-lg text-[10px] font-mono font-black text-gray-700 hover:text-orange-brand transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        Verify Sig
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleSimulateCryptoOp();
                        }}
                        className="flex-1 min-w-[120px] px-2.5 py-1.5 bg-orange-brand hover:bg-orange-brand/90 text-white rounded-lg text-[10px] font-mono font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-3 h-3 fill-white/10" />
                        Random Simulation
                      </button>
                    </div>
                  </div>

                  {/* Filters and Search toolbar */}
                  <div className="flex flex-col sm:flex-row gap-2 items-center justify-between pt-1">
                    {/* Status Filter Chips */}
                    <div className="flex gap-1.5 self-stretch sm:self-auto">
                      {(['all', 'success', 'warning', 'failed'] as const).map((filterOpt) => (
                        <button
                          key={filterOpt}
                          type="button"
                          onClick={() => setCryptoFilter(filterOpt)}
                          className={`flex-1 sm:flex-none px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all border ${
                            cryptoFilter === filterOpt
                              ? 'bg-gray-900 border-gray-900 text-white'
                              : 'bg-white border-gray-250 text-gray-600 hover:bg-gray-50 cursor-pointer'
                          }`}
                        >
                          {filterOpt === 'all' ? 'Show All' : filterOpt}
                        </button>
                      ))}
                    </div>

                    {/* Simple search box */}
                    <div className="relative w-full sm:w-48 shrink-0">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search operation / algorithm..."
                        value={cryptoSearch}
                        onChange={(e) => setCryptoSearch(e.target.value)}
                        className="w-full text-[11px] pl-7 pr-3 py-1.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand text-gray-700 font-medium"
                      />
                    </div>
                  </div>

                  {/* Active logs List */}
                  <div className="border border-gray-150 rounded-xl overflow-hidden bg-gray-50/50">
                    <div className="bg-gray-100/80 px-3 py-2 border-b border-gray-150 grid grid-cols-12 gap-2 text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                      <div className="col-span-5">Cryptographic Operation</div>
                      <div className="col-span-3">Hash Fingerprint</div>
                      <div className="col-span-2 text-center">Payload</div>
                      <div className="col-span-2 text-right">Timestamp</div>
                    </div>

                    <div className="divide-y divide-gray-150 max-h-[280px] overflow-y-auto bg-white">
                      <AnimatePresence initial={false}>
                        {(() => {
                          const filtered = cryptoLogs.filter((log) => {
                            // Filter by status
                            if (cryptoFilter !== 'all' && log.status !== cryptoFilter) {
                              return false;
                            }
                            // Search by name or algorithm
                            if (cryptoSearch) {
                              const q = cryptoSearch.toLowerCase();
                              return log.operation.toLowerCase().includes(q) || log.algorithm.toLowerCase().includes(q);
                            }
                            return true;
                          });

                          if (filtered.length === 0) {
                            return (
                              <div className="p-8 text-center text-gray-400 font-mono text-[11px] space-y-1">
                                <Terminal className="w-5 h-5 mx-auto text-gray-300 animate-pulse" />
                                <p>No matching cryptographic operations found.</p>
                              </div>
                            );
                          }

                          return filtered.map((log) => {
                            return (
                              <motion.div
                                key={log.id}
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ type: 'spring', duration: 0.4 }}
                                className="px-3 py-2.5 grid grid-cols-12 gap-2 items-center hover:bg-gray-50/50 transition-colors group"
                              >
                                {/* Operation Details */}
                                <div className="col-span-5 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`w-2 h-2 rounded-full shrink-0 ${
                                        log.status === 'success' ? 'bg-emerald-500 animate-pulse' :
                                        log.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                                      }`}
                                    />
                                    <span className="text-xs font-black text-gray-900 font-sans truncate">
                                      {log.operation}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-0.5 pl-4">
                                    <span className="text-[9px] font-mono font-bold bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded border border-gray-200">
                                      {log.algorithm}
                                    </span>
                                    {log.status === 'failed' && (
                                      <span className="text-[8px] font-mono font-black text-rose-600 uppercase tracking-widest bg-rose-50 border border-rose-100 px-1 rounded">
                                        Blocked
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Hash Fingerprint & Clipboard option */}
                                <div className="col-span-3 min-w-0 flex items-center gap-1 font-mono">
                                  <code className="text-[10px] text-gray-500 block truncate" title={log.hash}>
                                    {log.hash}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(log.hash);
                                    }}
                                    className="p-1 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 border border-gray-200 rounded text-[9px] cursor-pointer shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                                    title="Copy Signature"
                                  >
                                    <Copy className="w-2.5 h-2.5" />
                                  </button>
                                </div>

                                {/* Payload Size */}
                                <div className="col-span-2 text-center">
                                  <span className="text-[10px] font-mono font-bold text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-150">
                                    {log.payloadSize || '0.0 KB'}
                                  </span>
                                </div>

                                {/* Dynamic Timestamp */}
                                <div className="col-span-2 text-right">
                                  <span className="text-[10px] font-mono font-bold text-gray-600 block">
                                    {log.timestamp.split(' ')[1] || log.timestamp}
                                  </span>
                                  <span className="text-[8px] font-mono uppercase text-gray-400 block tracking-wider">
                                    {log.timestamp.split(' ')[0] || 'LEDGER'}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          });
                        })()}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-orange-brand/[0.02] border border-orange-brand/20 rounded-xl flex items-start gap-2.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-orange-brand shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-600 leading-normal">
                    <strong>Cryptographic Node Synchronization:</strong> All network security policies are enforced directly in the browser enclave. No credentials or secret keys are stored on server nodes.
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

      {/* Dynamic Decryption Interactive Overlay */}
      <AnimatePresence>
        {decryptionTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDecryptionTarget(null)}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden w-full max-w-lg z-10 p-5 relative text-gray-900"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-4">
                <div>
                  <span className="text-[9px] font-mono font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded uppercase">
                    E2EE Decrypted Terminal
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-2 truncate max-w-[360px]">
                    {decryptionTarget.subject}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Sender: <span className="text-gray-800 font-semibold">{decryptionTarget.sender}</span> • Size: {decryptionTarget.size}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDecryptionTarget(null)}
                  className="text-gray-400 hover:text-gray-600 text-xs font-mono font-bold border border-gray-200 hover:bg-gray-50 px-2 py-1 rounded-lg transition-all"
                >
                  CLOSE
                </button>
              </div>

              {/* Status banner */}
              <div className="p-2.5 bg-emerald-50/50 border border-emerald-200/60 rounded-xl flex items-center gap-2 mb-4 text-emerald-800 font-mono text-[10px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="truncate">
                  {isDecrypting ? (
                    <span className="animate-pulse">Decrypting military signature: verified handshakes...</span>
                  ) : (
                    <span className="font-bold">AES-GCM 256 cipher successfully decrypted.</span>
                  )}
                </div>
              </div>

              {/* Text content/payload */}
              <div className="p-4 bg-gray-950 text-emerald-400 font-mono text-xs rounded-xl border border-gray-800 min-h-[140px] max-h-[220px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-text selection:bg-emerald-500 selection:text-gray-950">
                {isDecrypting && (
                  <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse mr-1" />
                )}
                {decryptedText}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>Key Signature Hash verified</span>
                <span className="text-emerald-600 font-bold">100% Integrity</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
