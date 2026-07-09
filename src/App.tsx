import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Server, 
  Sparkles, 
  ArrowRight, 
  Key, 
  UserPlus, 
  LogIn, 
  HelpCircle,
  Eye,
  EyeOff,
  UserCheck,
  Zap,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { EnvelopeLogo } from './components/EnvelopeLogo';
import { HamburgerMenu } from './components/HamburgerMenu';
import { FeatureComparison } from './components/FeatureComparison';
import { SponsorAdBanner } from './components/SponsorAdBanner';
import { DashboardPreview } from './components/DashboardPreview';
import { UserProfile } from './types';

export default function App() {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [tier, setTier] = useState<'standard' | 'premium'>('premium');
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login flow state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  // Backend verification and session states
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [activeSessionToken, setActiveSessionToken] = useState('');
  const [tempVerificationCode, setTempVerificationCode] = useState<string | null>(null);

  // FAQ state
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  // User Profile State synced to dashboard preview
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'Sovereign Operator',
    email: 'operator@utubemail.com',
    tier: 'premium',
    avatarSeed: 'nexus-operator-seed-982',
    accentColor: '#d35400', // vibrant terracotta orange
    bgGradientStyle: 'soft-grey'
  });

  // Local Time clock for technical aesthetic (CommandNexus style)
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync profile tier to active tier state
  useEffect(() => {
    setUserProfile(prev => ({
      ...prev,
      tier: tier,
      email: tier === 'premium' 
        ? `${prev.username.toLowerCase().replace(/\s+/g, '')}@utubemail.com`
        : `${prev.username.toLowerCase().replace(/\s+/g, '')}@utubemail.free`
    }));
  }, [tier]);

  // Try to restore user session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('utubemail_session');
    if (savedToken) {
      fetch('/api/auth/session', {
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setIsLoggedIn(true);
          setActiveSessionToken(savedToken);
          setUserProfile(data.user);
          setTier(data.user.tier);
        } else {
          localStorage.removeItem('utubemail_session');
        }
      })
      .catch(() => {
        localStorage.removeItem('utubemail_session');
      });
    }
  }, []);

  const handleUpdateProfile = async (newValues: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...newValues };
      if (newValues.username) {
        updated.email = updated.tier === 'premium'
          ? `${newValues.username.toLowerCase().replace(/\s+/g, '')}@utubemail.com`
          : `${newValues.username.toLowerCase().replace(/\s+/g, '')}@utubemail.free`;
      }
      return updated;
    });

    if (isLoggedIn && activeSessionToken) {
      try {
        await fetch('/api/auth/profile/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeSessionToken}`
          },
          body: JSON.stringify(newValues)
        });
      } catch (err) {
        console.error("Failed to sync profile changes to backend", err);
      }
    }
  };

  const handleAccessMailboxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback(null);

    const handleSuffix = tier === 'premium' ? '@utubemail.com' : '@utubemail.free';
    const cleanEmailInput = emailInput.trim();
    const fullEmail = cleanEmailInput.includes('@') 
      ? cleanEmailInput 
      : `${cleanEmailInput || 'operator'}${handleSuffix}`;

    if (isSignUp) {
      // Registration flow with backend hashing & salting
      if (!usernameInput) {
        setLoginFeedback('⚠️ Username is required for registration.');
        return;
      }
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameInput,
            email: fullEmail,
            password: passwordInput,
            tier: tier
          })
        });
        const data = await response.json();
        if (data.success) {
          setIsVerifying(true);
          setVerificationEmail(data.email);
          setTempVerificationCode(data.verificationCode);
          setLoginFeedback(null);
        } else {
          setLoginFeedback(`❌ ${data.error || 'Registration failed.'}`);
        }
      } catch (err) {
        setLoginFeedback('❌ Network handshake failure. Could not contact node auth server.');
      }
    } else {
      // Login flow with backend password hash verification
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: fullEmail,
            password: passwordInput
          })
        });
        const data = await response.json();
        if (data.success) {
          setIsLoggedIn(true);
          setActiveSessionToken(data.sessionToken);
          localStorage.setItem('utubemail_session', data.sessionToken);
          setUserProfile(data.user);
          setTier(data.user.tier);
          setLoginFeedback(null);
          alert(`🔑 Security handshake completed! Cryptographic channel armed for node operator: ${data.user.username}`);
        } else {
          if (data.pendingVerification) {
            setIsVerifying(true);
            setVerificationEmail(data.email);
            // Auto resend/capture code for verification simulation
            try {
              const resendRes = await fetch('/api/auth/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email })
              });
              const resendData = await resendRes.json();
              if (resendData.success) {
                setTempVerificationCode(resendData.verificationCode);
              }
            } catch {}
            setLoginFeedback('⚠️ Node verification required. Enter code dispatched below.');
          } else {
            setLoginFeedback(`❌ ${data.error || 'Access Denied. Signature mismatch.'}`);
          }
        }
      } catch (err) {
        setLoginFeedback('❌ Network handshake failure. Could not contact node auth server.');
      }
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCodeInput) {
      setLoginFeedback('⚠️ Please enter the 6-digit cryptographic activation code.');
      return;
    }
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: verificationEmail,
          code: verificationCodeInput
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('✨ Node verification completed successfully! Handshake authorized. You can now login.');
        setIsVerifying(false);
        setIsSignUp(false);
        setTempVerificationCode(null);
        setVerificationCodeInput('');
        setLoginFeedback('✅ Node verified successfully! Please log in.');
      } else {
        setLoginFeedback(`❌ ${data.error || 'Verification failed.'}`);
      }
    } catch (err) {
      setLoginFeedback('❌ Network error during cryptographic verification check.');
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch('/api/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail })
      });
      const data = await response.json();
      if (data.success) {
        setTempVerificationCode(data.verificationCode);
        setLoginFeedback('📨 A new security passcode has been dispatched.');
      } else {
        setLoginFeedback(`❌ ${data.error || 'Failed to resend code.'}`);
      }
    } catch (err) {
      setLoginFeedback('❌ Network failure trying to dispatch passcode.');
    }
  };

  const handleLogout = async () => {
    if (activeSessionToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${activeSessionToken}`
          }
        });
      } catch (err) {}
    }
    setIsLoggedIn(false);
    setActiveSessionToken('');
    localStorage.removeItem('utubemail_session');
    setPasswordInput('');
    setLoginFeedback(null);
  };

  return (
    <div className="bg-gradient-to-br from-[#b8b6b6] to-[#7a7979] min-h-screen font-sans text-gray-900 selection:bg-orange-brand selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-md border-b border-white/20 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Top-Left Company Logo exactly as described */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/80 rounded-xl border border-gray-300 shadow-xs flex items-center justify-center transition-transform hover:scale-105">
              <EnvelopeLogo size={42} color="#d35400" className="glow-orange" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl tracking-tight text-gray-950 uppercase leading-none">
                  UTube <span className="text-orange-brand">Mail</span>
                </span>
                <span className="text-[9px] font-mono font-bold text-gray-800 bg-white/75 px-1.5 py-0.2 rounded border border-gray-300">
                  v4.2
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-800 tracking-wider uppercase block">
                CommandNexus Partner Node
              </span>
            </div>
          </div>

          {/* Technical Clock/Status Indicator */}
          <div className="hidden md:flex items-center gap-3 bg-white/60 px-3 py-1.5 rounded-lg border border-white/40 shadow-xs font-mono text-[10px] text-gray-800">
            <Clock className="w-3.5 h-3.5 text-orange-brand animate-pulse" />
            <span className="font-bold">SYSTEM TIME:</span>
            <span className="tracking-wide text-gray-900 font-bold">{currentTime || 'SYNCING...'}</span>
          </div>

          {/* Hamburger Menu & Navigation Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTier(prev => prev === 'standard' ? 'premium' : 'standard');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/70 hover:bg-white border border-gray-300 text-xs font-mono font-bold uppercase rounded-lg transition-all"
            >
              <Zap className={`w-3.5 h-3.5 ${tier === 'premium' ? 'text-orange-brand fill-orange-brand/20' : 'text-gray-400'}`} />
              <span>Preview: <strong className="text-orange-brand">{tier.toUpperCase()}</strong></span>
            </button>

            {/* Hamburger App Launcher Drawer */}
            <HamburgerMenu 
              isOpen={isHamburgerOpen} 
              onToggle={() => setIsHamburgerOpen(!isHamburgerOpen)} 
              accentColor="#d35400" 
            />
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 space-y-16">
        
        {/* HERO SECTION & SIGN-IN/SIGN-UP PANEL */}
        <section className="grid lg:grid-cols-12 gap-8 items-center pt-4">
          
          {/* SEO Optimized Hook Column (Left side) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono font-black text-white bg-orange-brand uppercase tracking-widest px-3 py-1 rounded shadow-sm inline-block">
              COMMANDNEXUS NODE ACCELERATED
            </span>
            
            {/* Targeted H1 Tag */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 tracking-tight leading-none">
              Secure Online <br />
              <span className="text-white drop-shadow-sm">Email Server</span> Node
            </h1>

            {/* Targeted H2 Tag */}
            <h2 className="text-lg sm:text-xl font-display font-bold text-gray-800 tracking-tight">
              Encrypted Cloud Mailbox Portal
            </h2>

            <p className="text-gray-800 text-sm sm:text-base leading-relaxed max-w-xl">
              Experience absolute cryptographic privacy. UTube Mail leverages zero-knowledge asymmetric end-to-end encryption protocols powered by the **CommandNexus** secure ledger framework, ensuring no third parties can scan or read your personal messages.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
              <div className="bg-white/45 p-3 rounded-xl border border-white/30 backdrop-blur-xs">
                <Shield className="w-5 h-5 text-orange-brand mb-1" />
                <h4 className="text-xs font-bold text-gray-900">Zero-Knowledge E2EE</h4>
                <p className="text-[11px] text-gray-700 mt-0.5 leading-normal">Your private keys never leave your device.</p>
              </div>
              <div className="bg-white/45 p-3 rounded-xl border border-white/30 backdrop-blur-xs">
                <Server className="w-5 h-5 text-orange-brand mb-1" />
                <h4 className="text-xs font-bold text-gray-900">Distributed Storage</h4>
                <p className="text-[11px] text-gray-700 mt-0.5 leading-normal">Double-redundant file backups on solid state VPS.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-gray-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping"></span>
              <span>ACTIVE SYSTEM SYNC: 100% SECURE COMMANDEERING BY COMMANDNEXUS</span>
            </div>
          </div>

          {/* Central Panel Column - Unified Sign-In / Sign-Up Form (Right side) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-xl overflow-hidden">
              
              {/* Form Tab Header Selector */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => { setIsSignUp(false); setLoginFeedback(null); }}
                  className={`flex-1 py-3 text-center text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    !isSignUp 
                      ? 'bg-white text-orange-brand border-b-2 border-orange-brand' 
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-3.5 h-3.5" />
                    Secure Sign In
                  </span>
                </button>
                <button
                  onClick={() => { setIsSignUp(true); setLoginFeedback(null); }}
                  className={`flex-1 py-3 text-center text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    isSignUp 
                      ? 'bg-white text-orange-brand border-b-2 border-orange-brand' 
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-3.5 h-3.5" />
                    Create Free Node
                  </span>
                </button>
              </div>

              {/* Form Body Container */}
              <div className="p-6">
                
                {isLoggedIn ? (
                  /* Logged-In User Quick Feedback */
                  <div className="space-y-4 text-center py-6">
                    <div className="w-16 h-16 bg-orange-trans text-orange-brand border border-orange-brand/20 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <UserCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-extrabold text-gray-900">
                        Cryptographic Key Armed
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Signed in securely as <span className="font-mono font-bold text-gray-900">{userProfile.username}</span>
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-mono text-gray-600">
                      Signature Session Token: <br />
                      <span className="text-gray-950 font-bold break-all text-[11px] font-mono block mt-1 bg-white/85 p-1.5 rounded border border-gray-300">
                        {activeSessionToken || `NEXUS_SYNC_TOKEN_${userProfile.username.toUpperCase().replace(/\s+/g, '_')}`}
                      </span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          const element = document.getElementById('sandbox-sandbox-panel');
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2 bg-orange-brand text-white text-xs font-mono font-bold uppercase rounded-lg hover:bg-orange-brand/90 transition-all shadow-sm"
                      >
                        Enter Mailbox
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-mono font-bold uppercase rounded-lg transition-all border border-gray-300"
                      >
                        Revoke Key (Logout)
                      </button>
                    </div>
                  </div>
                ) : isVerifying ? (
                  /* Cryptographic activation code entry screen */
                  <form onSubmit={handleVerifySubmit} className="space-y-4">
                    
                    {/* Simulated SMTP Bypass Notification */}
                    {tempVerificationCode && (
                      <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs rounded-xl flex flex-col gap-1.5 shadow-xs animate-pulse">
                        <span className="font-bold font-mono text-[10px] uppercase text-indigo-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          SMTP Bypass: Simulated Security Code
                        </span>
                        <p className="text-[10px] text-indigo-800 leading-normal">
                          The simulated SMTP server successfully dispatched code: <strong className="text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-300 font-mono text-xs">{tempVerificationCode}</strong> to node handle <span className="font-semibold text-indigo-800 break-all">{verificationEmail}</span>.
                        </p>
                      </div>
                    )}

                    {loginFeedback && (
                      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center gap-2">
                        <span>{loginFeedback}</span>
                      </div>
                    )}

                    <div className="text-center py-2">
                      <Lock className="w-8 h-8 text-orange-brand mx-auto mb-2" />
                      <h3 className="text-sm font-display font-extrabold text-gray-900">Activate Secure Node</h3>
                      <p className="text-[11px] text-gray-600 mt-1">
                        Enter the verification code to register your cryptographic signature keys with CommandNexus.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                        6-Digit Security Passcode
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="e.g., 583192"
                        value={verificationCodeInput}
                        onChange={(e) => setVerificationCodeInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center text-lg font-mono tracking-widest p-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all font-bold text-gray-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 bg-orange-trans hover:bg-orange-brand/20 text-orange-brand border border-orange-brand/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-2"
                    >
                      <span>Activate Handshake Signature</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex justify-between items-center pt-2 text-[10px]">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-gray-600 hover:text-orange-brand font-mono underline cursor-pointer"
                      >
                        Resend Code
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsVerifying(false);
                          setLoginFeedback(null);
                        }}
                        className="text-gray-500 hover:text-gray-800 font-mono uppercase tracking-wider"
                      >
                        Cancel Verify
                      </button>
                    </div>

                  </form>
                ) : (
                  /* Sign-In/Sign-Up Form Input Fields */
                  <form onSubmit={handleAccessMailboxSubmit} className="space-y-4">
                    
                    {loginFeedback && (
                      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-center gap-2">
                        <span>{loginFeedback}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                        Username Handle
                      </label>
                      <input
                        type="text"
                        required={isSignUp}
                        placeholder={isSignUp ? "e.g., AliceSmith" : "Default: Sovereign Operator"}
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                        Email Address Handle
                      </label>
                      <div className="flex">
                        <input
                           type="text"
                           placeholder={isSignUp ? "yourname" : "operator"}
                           value={emailInput.split('@')[0]}
                           onChange={(e) => {
                             const val = e.target.value;
                             setEmailInput(tier === 'premium' ? `${val}@utubemail.com` : `${val}@utubemail.free`);
                           }}
                           className="w-full text-xs p-3 rounded-l-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all"
                        />
                        <span className="bg-gray-200 text-gray-600 px-4 flex items-center text-xs font-mono border-y border-r border-gray-300 rounded-r-xl">
                          {tier === 'premium' ? '@utubemail.com' : '@utubemail.free'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 leading-snug">
                        Linked node domain suffix dynamically reflects your active preview tier.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5 flex justify-between">
                        <span>Cryptographic Passkey / Password</span>
                        <span className="text-[9px] text-orange-brand font-semibold lowercase tracking-normal">
                          locally encrypted
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••••"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full text-xs p-3 pr-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {isSignUp && (
                      <div className="flex items-start gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="terms"
                          required
                          className="mt-0.5 rounded text-orange-brand focus:ring-orange-brand border-gray-300"
                        />
                        <label htmlFor="terms" className="text-[11px] text-gray-600 leading-normal">
                          I consent to sync my node security hash credentials across connected UTube network applications under CommandNexus security guidelines.
                        </label>
                      </div>
                    )}

                    {/* Interactive buttons highlighted in striking, vibrant dark transparent orange */}
                    <button
                      type="submit"
                      className="w-full mt-2 py-3 bg-orange-trans hover:bg-orange-brand/20 text-orange-brand border border-orange-brand/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-2"
                    >
                      <span>
                        {isSignUp ? "Deploy Secure Mailbox Node" : "Access Mailbox"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </form>
                )}

              </div>

            </div>

            {/* Premium "Sponsor Ad" Banner Container right below the Central Panel form (as specified) */}
            <SponsorAdBanner onInteract={(adTitle) => {
              alert(`Initializing secure ecosystem sandbox redirect for campaign: "${adTitle}"`);
            }} />
          </div>

        </section>

        {/* INTERACTIVE USER SETTINGS & MAILBOX PREVIEW PANEL (Below the fold) */}
        <section id="sandbox-sandbox-panel" className="scroll-mt-24 space-y-6">
          <div className="border-l-4 border-orange-brand pl-4">
            <span className="text-[11px] font-mono font-extrabold text-orange-brand uppercase tracking-wider block">
              Active Visual Sandboxing
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-gray-900 tracking-tight">
              User Dashboard & Settings Preview Panel
            </h2>
            <p className="text-gray-700 text-xs sm:text-sm mt-1 leading-relaxed">
              Experience the layout first-hand. Change account settings, customize theme gradients, and toggle security tiers using the live preview canvas below.
            </p>
          </div>

          <DashboardPreview 
            currentTier={tier}
            onTierChange={setTier}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        </section>

        {/* FEATURE COMPARISON GRID (Symmetrical Two-column layout) */}
        <FeatureComparison 
          currentTier={tier}
          onSelectTier={setTier}
        />

        {/* FREQUENTLY ASKED QUESTIONS SECTION */}
        <section className="scroll-mt-24 space-y-8 bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column: Title and Accent Details */}
            <div className="lg:w-1/3 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-brand/10 border border-orange-brand/20 rounded-full">
                <HelpCircle className="w-4 h-4 text-orange-brand" />
                <span className="text-[10px] font-mono font-bold text-orange-brand uppercase tracking-wider">
                  Knowledge Hub
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-gray-900 tracking-tight leading-none">
                Frequently Asked <span className="text-orange-brand">Questions</span>
              </h2>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Unlock granular technical details on how CommandNexus manages keys, routing architectures, and post-quantum zero-knowledge encryption models.
              </p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-brand shrink-0 mt-0.5" />
                <div>
                  <span className="font-display font-extrabold text-xs text-gray-900 block">E2EE Protocol Active</span>
                  <span className="text-[10px] text-gray-500 font-mono">Status: Secure Sandbox</span>
                </div>
              </div>
            </div>

            {/* Right Column: Accordion list */}
            <div className="lg:w-2/3 space-y-3">
              {[
                {
                  q: "What is CommandNexus and how does it secure my email?",
                  a: "CommandNexus is our underlying secure ecosystem core. Every email payload, metadata element, and profile setting on utubemail.com is encrypted using AES-GCM-256 and salted pbkdf2 key derivations on the client-side/server edge, preventing unauthenticated routing and zero-knowledge access."
                },
                {
                  q: "Where is my data stored and is it private?",
                  a: "Your cryptographic mail and security settings are stored in decentralized zero-knowledge vault nodes. Neither utubemail.com nor third-party network providers hold decrypted raw keys; only your local key can decrypt your mailbox data."
                },
                {
                  q: "What is the difference between free and premium encryption tiers?",
                  a: "Standard tier offers post-quantum signature verification and basic end-to-end encryption. Premium tier unlocks 4K-integrated multi-device payload signing, real-time dynamic salt rotation, and fully dedicated secure enclave computing instances on the CommandNexus grid."
                },
                {
                  q: "How does the simulated SMTP email bypass work?",
                  a: "For security and testing purposes within our preview, the system bypasses public relays and routes verified activations directly. Authentic production environments route through TLS-hardened, zero-logging transport pipelines."
                },
                {
                  q: "Can anyone access my inbox without my cryptographic passkey?",
                  a: "Absolutely not. Even system administrators and node operators see only salted, non-invertible hashes. Without the passkey to compute the matching PBKDF2 hash, your inbox remains cryptographically inaccessible."
                }
              ].map((faq, index) => {
                const isOpen = activeFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                      isOpen 
                        ? 'border-orange-brand/30 bg-orange-brand/[0.02] shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <button
                      onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left transition-all cursor-pointer select-none"
                    >
                      <span className="font-display font-extrabold text-xs sm:text-sm text-gray-950 pr-4">
                        {faq.q}
                      </span>
                      <span className={`p-1 rounded-lg transition-transform duration-200 ${
                        isOpen ? 'bg-orange-brand/10 text-orange-brand rotate-180' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="px-4 pb-4 pt-1 border-t border-gray-100/50">
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* REAL-TIME SIMULATED AD CAMPAIGN BOARD */}
        <section className="bg-gray-900 text-white rounded-2xl p-6 sm:p-8 border border-gray-800 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 bg-orange-brand text-white font-mono text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow">
            AD CAMPAIGN ANALYTICS
          </div>

          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold text-orange-brand uppercase tracking-wider block">
              CommandNexus Network Portal Integration
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold mt-1 tracking-tight">
              Dynamic Ecosystem Advantage
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm mt-3 leading-relaxed">
              UTube Mail operates inside the broader **CommandNexus** suite. Your single login passkey grants immediate secure federated access to UTubeChat, NexusVault, and partner channels without redundant verification challenges.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                <span className="text-2xl font-mono font-extrabold text-white block">E2EE</span>
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Privacy level</span>
              </div>
              <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                <span className="text-2xl font-mono font-extrabold text-white block">&lt; 3ms</span>
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Handshake speed</span>
              </div>
              <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                <span className="text-2xl font-mono font-extrabold text-white block">Active</span>
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">CommandNexus Sync</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-gray-950 text-white border-t border-gray-800 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand stamp */}
          <div className="flex items-center gap-3">
            <EnvelopeLogo size={32} color="#d35400" />
            <div>
              <span className="font-display font-extrabold text-sm tracking-tight block uppercase">
                UTube <span className="text-orange-brand">Mail</span> Portal
              </span>
              <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                © {new Date().getFullYear()} utubemail.com. All rights reserved.
              </span>
            </div>
          </div>

          {/* Ecosystem affiliation badge */}
          <div className="text-center md:text-right font-mono text-xs text-gray-400 space-y-1">
            <p className="flex items-center justify-center md:justify-end gap-1 text-[11px]">
              <span>Secure platform designed & maintained by</span>
              <span className="text-orange-brand font-bold uppercase tracking-wider">CommandNexus</span>
            </p>
            <p className="text-[10px] text-gray-500">
              Active Session Protocol Handshake SHA-256 Code Commited under military-grade standard validation logs.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
