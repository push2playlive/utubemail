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
  ChevronUp,
  Globe,
  Languages,
  ShieldAlert,
  QrCode,
  Smartphone,
  Fingerprint,
  Scan,
  RefreshCw
} from 'lucide-react';
import { EnvelopeLogo } from './components/EnvelopeLogo';
import { HamburgerMenu } from './components/HamburgerMenu';
import { FeatureComparison } from './components/FeatureComparison';
import { SponsorAdBanner } from './components/SponsorAdBanner';
import { DashboardPreview } from './components/DashboardPreview';
import { UserProfile } from './types';
import { useTranslation, Language, translations } from './lib/i18n';


export default function App() {
  const { language, setLanguage, t } = useTranslation();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
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

  // Password Recovery / Reset simulation states
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verify_reset'>('request');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoveryFeedback, setRecoveryFeedback] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // QR Code Sign-In states
  const [qrSignInMode, setQrSignInMode] = useState<'passkey' | 'qr'>('passkey');
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [qrStatus, setQrStatus] = useState<'pending' | 'scanned' | 'authorized' | 'rejected' | null>(null);
  const [isPhoneSimOpen, setIsPhoneSimOpen] = useState(false);

  // Simulated Phone states
  const [phoneAccount, setPhoneAccount] = useState('operator@utubemail.com');
  const [phoneStatus, setPhoneStatus] = useState<'home' | 'app' | 'scanning' | 'verifying' | 'success' | 'rejected'>('home');
  const [scanProgress, setScanProgress] = useState(0);
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  // Functions for QR initiation
  const handleInitiateQR = async () => {
    try {
      const res = await fetch("/api/auth/qr/initiate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setQrToken(data.qrToken);
          setQrStatus('pending');
          setLoginFeedback(null);
        }
      }
    } catch (err) {
      console.error("QR initiation failure", err);
    }
  };

  useEffect(() => {
    let intervalId: any;
    if (qrSignInMode === 'qr' && qrToken && !isLoggedIn) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`/api/auth/qr/status/${qrToken}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setQrStatus(data.status);
              if (data.status === 'authorized' && data.sessionToken) {
                setActiveSessionToken(data.sessionToken);
                setIsLoggedIn(true);
                setUserProfile(data.user);
                setLoginFeedback(null);
                clearInterval(intervalId);
              } else if (data.status === 'rejected') {
                setLoginFeedback("Mobile signature authentication rejected.");
                clearInterval(intervalId);
              }
            }
          } else if (res.status === 410) {
            setLoginFeedback("QR token session expired. Regenerating secure token...");
            handleInitiateQR();
          }
        } catch (err) {
          console.error("QR check error", err);
        }
      }, 1500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [qrSignInMode, qrToken, isLoggedIn]);

  // New password strength check metrics
  const isNewLengthValid = newPasswordInput.length >= 8;
  const isNewCasingValid = /[a-z]/.test(newPasswordInput) && /[A-Z]/.test(newPasswordInput);
  const isNewNumberValid = /[0-9]/.test(newPasswordInput);
  const isNewSymbolValid = /[^a-zA-Z0-9]/.test(newPasswordInput);
  const newStrengthScore = newPasswordInput ? [isNewLengthValid, isNewCasingValid, isNewNumberValid, isNewSymbolValid].filter(Boolean).length : 0;

  // Real-time Entropy & Dynamic PBKDF2 Iterations calculation
  const getPoolSize = (password: string) => {
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
    return pool;
  };
  const poolSize = getPoolSize(newPasswordInput);
  const passwordEntropy = poolSize > 0 ? Math.round(newPasswordInput.length * Math.log2(poolSize)) : 0;

  const calculatePbkdf2Iterations = (entropy: number, score: number) => {
    if (!newPasswordInput) return 0;
    const base = 100000; // industry standard baseline
    const strengthMultiplier = score * 100000; // dynamic strengthening
    const entropyHardening = entropy * 2500; // entropy-based augmentation
    return Math.min(750000, base + strengthMultiplier + entropyHardening);
  };
  const pbkdf2Iterations = calculatePbkdf2Iterations(passwordEntropy, newStrengthScore);

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

  // Dynamic password strength metrics
  const isLengthValid = passwordInput.length >= 8;
  const isCasingValid = /[a-z]/.test(passwordInput) && /[A-Z]/.test(passwordInput);
  const isNumberValid = /[0-9]/.test(passwordInput);
  const isSymbolValid = /[^a-zA-Z0-9]/.test(passwordInput);
  const strengthScore = passwordInput ? [isLengthValid, isCasingValid, isNumberValid, isSymbolValid].filter(Boolean).length : 0;

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

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryFeedback(null);

    const handleSuffix = tier === 'premium' ? '@utubemail.com' : '@utubemail.free';
    const cleanEmailInput = recoveryEmail.trim();
    const fullEmail = cleanEmailInput.includes('@') 
      ? cleanEmailInput 
      : `${cleanEmailInput || 'operator'}${handleSuffix}`;

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fullEmail })
      });
      const data = await response.json();
      if (data.success) {
        setRecoveryCode(data.recoveryCode);
        setRecoveryStep('verify_reset');
        setRecoveryFeedback(null);
      } else {
        setRecoveryFeedback(`❌ ${data.error || 'Failed to trigger password recovery.'}`);
      }
    } catch (err) {
      setRecoveryFeedback('❌ Network handshake failure. Could not reach node auth server.');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryFeedback(null);

    if (newPasswordInput !== confirmPasswordInput) {
      setRecoveryFeedback('❌ Key signature entries do not match.');
      return;
    }

    if (newStrengthScore < 3) {
      setRecoveryFeedback('❌ New passkey signature must meet at least Armored Strength (3+ requirements).');
      return;
    }

    const handleSuffix = tier === 'premium' ? '@utubemail.com' : '@utubemail.free';
    const cleanEmailInput = recoveryEmail.trim();
    const fullEmail = cleanEmailInput.includes('@') 
      ? cleanEmailInput 
      : `${cleanEmailInput || 'operator'}${handleSuffix}`;

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fullEmail,
          code: recoveryCodeInput,
          newPassword: newPasswordInput
        })
      });
      const data = await response.json();
      if (data.success) {
        setRecoverySuccess(true);
        setRecoveryFeedback(null);
        // Sync inputs back to parent fields so the user can log in immediately
        setPasswordInput(newPasswordInput);
        setEmailInput(recoveryEmail);
      } else {
        setRecoveryFeedback(`❌ ${data.error || 'Password reset failed.'}`);
      }
    } catch (err) {
      setRecoveryFeedback('❌ Network handshake failure during key reset.');
    }
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
                {t('partnerNode')}
              </span>
            </div>
          </div>

          {/* Technical Clock/Status Indicator */}
          <div className="hidden md:flex items-center gap-3 bg-white/60 px-3 py-1.5 rounded-lg border border-white/40 shadow-xs font-mono text-[10px] text-gray-800">
            <Clock className="w-3.5 h-3.5 text-orange-brand animate-pulse" />
            <span className="font-bold">{t('systemTime')}:</span>
            <span className="tracking-wide text-gray-900 font-bold">{currentTime || 'SYNCING...'}</span>
          </div>

          {/* Hamburger Menu & Navigation Action */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/70 hover:bg-white border border-gray-300 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer select-none"
              >
                <Languages className="w-3.5 h-3.5 text-orange-brand" />
                <span>{language.toUpperCase()}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setIsLangDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl overflow-hidden z-40"
                    >
                      <div className="p-1.5 space-y-1">
                        {(['en', 'de', 'es', 'ja'] as Language[]).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => {
                              setLanguage(lang);
                              setIsLangDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs rounded-lg transition-all cursor-pointer ${
                              language === lang
                                ? 'bg-orange-brand/10 text-orange-brand font-bold'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <span className="font-medium">{translations[lang].languageName}</span>
                            <span className="text-[10px] font-mono text-gray-400 uppercase">{lang}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                setTier(prev => prev === 'standard' ? 'premium' : 'standard');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/70 hover:bg-white border border-gray-300 text-xs font-mono font-bold uppercase rounded-lg transition-all"
            >
              <Zap className={`w-3.5 h-3.5 ${tier === 'premium' ? 'text-orange-brand fill-orange-brand/20' : 'text-gray-400'}`} />
              <span>{t('preview')}: <strong className="text-orange-brand">{tier.toUpperCase()}</strong></span>
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
              {t('heroTag')}
            </span>
            
            {/* Targeted H1 Tag */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 tracking-tight leading-none">
              {t('heroTitle1')} <br />
              <span className="text-white drop-shadow-sm">{t('heroTitle2')}</span>
            </h1>

            {/* Targeted H2 Tag */}
            <h2 className="text-lg sm:text-xl font-display font-bold text-gray-800 tracking-tight">
              {t('heroSub')}
            </h2>

            <p className="text-gray-800 text-sm sm:text-base leading-relaxed max-w-xl">
              {t('heroDesc')}
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
              <div className="bg-white/45 p-3 rounded-xl border border-white/30 backdrop-blur-xs">
                <Shield className="w-5 h-5 text-orange-brand mb-1" />
                <h4 className="text-xs font-bold text-gray-900">{t('zeroKnowledge')}</h4>
                <p className="text-[11px] text-gray-700 mt-0.5 leading-normal">{t('zeroKnowledgeDesc')}</p>
              </div>
              <div className="bg-white/45 p-3 rounded-xl border border-white/30 backdrop-blur-xs">
                <Server className="w-5 h-5 text-orange-brand mb-1" />
                <h4 className="text-xs font-bold text-gray-900">{t('distStorage')}</h4>
                <p className="text-[11px] text-gray-700 mt-0.5 leading-normal">{t('distStorageDesc')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-gray-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-ping"></span>
              <span>{t('syncStatus')}</span>
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
                    {t('signInTab')}
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
                    {t('signUpTab')}
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
                        {t('keyArmed')}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {t('identity')}: <span className="font-mono font-bold text-gray-900">{userProfile.username}</span>
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
                        {t('secureDashboard')}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-mono font-bold uppercase rounded-lg transition-all border border-gray-300"
                      >
                        {t('logoutBtn')}
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
                      <h3 className="text-sm font-display font-extrabold text-gray-900">{t('enterActivation')}</h3>
                      <p className="text-[11px] text-gray-600 mt-1">
                        Please enter the 6-digit cryptographic activation code sent to {verificationEmail}.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                        {t('verificationCodeLabel')}
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder={t('verificationPlaceholder')}
                        value={verificationCodeInput}
                        onChange={(e) => setVerificationCodeInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center text-lg font-mono tracking-widest p-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all font-bold text-gray-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 bg-orange-trans hover:bg-orange-brand/20 text-orange-brand border border-orange-brand/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-2"
                    >
                      <span>{t('verifyBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex justify-between items-center pt-2 text-[10px]">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-gray-600 hover:text-orange-brand font-mono underline cursor-pointer"
                      >
                        {t('resendBtn')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsVerifying(false);
                          setLoginFeedback(null);
                        }}
                        className="text-gray-500 hover:text-gray-800 font-mono uppercase tracking-wider"
                      >
                        {t('returnBtn')}
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

                    {!isSignUp && (
                      <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200 mb-2">
                        <button
                          type="button"
                          onClick={() => setQrSignInMode('passkey')}
                          className={`py-2 text-center text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            qrSignInMode === 'passkey'
                              ? 'bg-white text-orange-brand shadow-xs border border-orange-brand/10'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            <Key className="w-3.5 h-3.5" />
                            Passkey Signature
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setQrSignInMode('qr');
                            handleInitiateQR();
                          }}
                          className={`py-2 text-center text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            qrSignInMode === 'qr'
                              ? 'bg-white text-orange-brand shadow-xs border border-orange-brand/10'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            <QrCode className="w-3.5 h-3.5" />
                            Secure QR Handshake
                          </span>
                        </button>
                      </div>
                    )}

                    {!isSignUp && qrSignInMode === 'qr' ? (
                      <div className="space-y-4 py-2 text-center">
                        <div className="relative mx-auto w-48 h-48 bg-white border border-gray-300 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden p-3 group">
                          {/* Pulsing red scanner line */}
                          {qrStatus === 'pending' && (
                            <div className="absolute left-0 right-0 h-[2px] bg-red-500/85 shadow-[0_0_8px_rgba(239,68,68,0.85)] animate-pulse z-10" style={{ top: '35%' }} />
                          )}
                          
                          {/* Animated procedurally generated SVG QR Code */}
                          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                            {/* Corner squares (Anchor patterns) */}
                            <rect x="5" y="5" width="25" height="25" rx="3" stroke="#d35400" strokeWidth="4" />
                            <rect x="11" y="11" width="13" height="13" rx="1.5" fill="#111827" />
                            
                            <rect x="70" y="5" width="25" height="25" rx="3" stroke="#d35400" strokeWidth="4" />
                            <rect x="76" y="11" width="13" height="13" rx="1.5" fill="#111827" />
                            
                            <rect x="5" y="70" width="25" height="25" rx="3" stroke="#d35400" strokeWidth="4" />
                            <rect x="11" y="76" width="13" height="13" rx="1.5" fill="#111827" />

                            {/* Small sync pattern */}
                            <rect x="75" y="75" width="10" height="10" rx="1" stroke="#111827" strokeWidth="2" />
                            
                            {/* Random pixel matrix mapping the token for real uniqueness */}
                            {Array.from({ length: 12 }).map((_, r) => {
                              return Array.from({ length: 12 }).map((_, c) => {
                                // Skip corner anchor areas
                                if ((r < 4 && c < 4) || (r < 4 && c > 7) || (r > 7 && c < 4)) return null;
                                // Deterministic pseudorandom block generator based on token
                                const seedVal = qrToken ? qrToken.charCodeAt((r * 12 + c) % qrToken.length) : (r * 13 + r * 19);
                                const isActive = (seedVal % 3) === 0 || (seedVal % 7) === 2;
                                if (!isActive) return null;
                                return (
                                  <rect
                                    key={`${r}-${c}`}
                                    x={10 + r * 6.6}
                                    y={10 + c * 6.6}
                                    width="5"
                                    height="5"
                                    rx="0.5"
                                    fill={qrStatus === 'scanned' ? '#059669' : '#1f2937'}
                                  />
                                );
                              });
                            })}

                            {/* Center branding icon badge */}
                            <rect x="42" y="42" width="16" height="16" rx="3" fill="#d35400" stroke="#ffffff" strokeWidth="2" />
                            <circle cx="50" cy="50" r="4" fill="#ffffff" />
                          </svg>

                          {/* Quick scanning feedback overlay */}
                          {qrStatus === 'scanned' && (
                            <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-white text-center">
                              <Fingerprint className="w-10 h-10 animate-pulse text-white mb-2" />
                              <span className="text-xs font-mono font-bold uppercase tracking-wider">Device Synced</span>
                              <span className="text-[9px] font-mono text-emerald-100 mt-1">Accept the signature payload on your mobile device</span>
                            </div>
                          )}
                        </div>

                        {/* Status message */}
                        <div className="text-center space-y-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 block">
                            Secure Handshake Status:
                          </span>
                          <span className={`text-xs font-mono font-black uppercase ${
                            qrStatus === 'scanned' ? 'text-emerald-600 animate-pulse' :
                            qrStatus === 'rejected' ? 'text-rose-600' :
                            'text-orange-brand'
                          }`}>
                            {qrStatus === 'pending' && '● Awaiting Camera Scan...'}
                            {qrStatus === 'scanned' && '● Biometric confirmation required...'}
                            {qrStatus === 'authorized' && '● Session Authorized! Entering...'}
                            {qrStatus === 'rejected' && '⚠️ Verification Rejected'}
                          </span>
                        </div>

                        {/* Prompt scanner phone simulation block */}
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-left">
                          <div className="flex items-center gap-2 text-gray-800">
                            <Smartphone className="w-4 h-4 text-orange-brand" />
                            <span className="text-xs font-bold font-mono uppercase tracking-wider text-gray-900">Simulated Authenticator App</span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                            Because you are running in an isolated container sandbox, you can simulate scanning this secure QR signature key with your phone.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsPhoneSimOpen(true);
                              if (phoneStatus === 'home') {
                                setPhoneStatus('app');
                              }
                            }}
                            className="w-full py-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:shadow-sm"
                          >
                            <Scan className="w-3.5 h-3.5 text-orange-brand" />
                            Launch Phone Authenticator
                          </button>
                        </div>

                        {/* Re-initiate button */}
                        <div className="flex justify-center pt-1">
                          <button
                            type="button"
                            onClick={handleInitiateQR}
                            className="text-[10px] font-mono text-gray-400 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Regenerate Signature Key</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                            {t('usernameLabel')}
                          </label>
                          <input
                            type="text"
                            required={isSignUp}
                            placeholder={isSignUp ? "e.g., AliceSmith" : t('usernamePlaceholder')}
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                            {t('emailLabel')}
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
                            <span>{t('passwordLabel')}</span>
                            <span className="text-[9px] text-orange-brand font-semibold lowercase tracking-normal">
                              {t('locallyEncrypted')}
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
                              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Real-time Password Strength Visual Indicator */}
                          {isSignUp && passwordInput && (
                            <div className="mt-2.5 p-3.5 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5 transition-all duration-300">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="font-mono text-gray-500 uppercase tracking-wider font-bold">{t('keyStrength')}:</span>
                                <span className={`font-mono font-black uppercase tracking-wider text-[11px] ${
                                  strengthScore === 1 ? 'text-rose-600 animate-pulse' :
                                  strengthScore === 2 ? 'text-amber-600' :
                                  strengthScore === 3 ? 'text-indigo-600 font-bold' :
                                  'text-emerald-600 font-black'
                                }`}>
                                  {strengthScore === 1 && 'Critical Vulnerability ⚠️'}
                                  {strengthScore === 2 && 'Susceptible / Weak'}
                                  {strengthScore === 3 && 'Armored Key Pair'}
                                  {strengthScore === 4 && 'Post-Quantum Secure ⚡'}
                                </span>
                              </div>

                              {/* 4 Segmented bar */}
                              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                                {[1, 2, 3, 4].map((seg) => (
                                  <div
                                    key={seg}
                                    className={`h-full rounded-full transition-all duration-300 ${
                                      seg <= strengthScore
                                        ? strengthScore === 1 ? 'bg-rose-500' :
                                          strengthScore === 2 ? 'bg-amber-500' :
                                          strengthScore === 3 ? 'bg-indigo-500' :
                                          'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                        : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>

                              {/* Requirements list with active colored badges */}
                              <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1 text-[10px] font-mono">
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isLengthValid ? 'bg-emerald-500 scale-125' : 'bg-gray-300'}`} />
                                  <span className={isLengthValid ? 'text-gray-900 font-extrabold' : 'text-gray-500'}>8+ Characters</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isCasingValid ? 'bg-emerald-500 scale-125' : 'bg-gray-300'}`} />
                                  <span className={isCasingValid ? 'text-gray-900 font-extrabold' : 'text-gray-500'}>Aa-Zz Casing</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isNumberValid ? 'bg-emerald-500 scale-125' : 'bg-gray-300'}`} />
                                  <span className={isNumberValid ? 'text-gray-900 font-extrabold' : 'text-gray-500'}>0-9 Number</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isSymbolValid ? 'bg-emerald-500 scale-125' : 'bg-gray-300'}`} />
                                  <span className={isSymbolValid ? 'text-gray-900 font-extrabold' : 'text-gray-500'}>Special Symbol</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {!isSignUp && (
                            <div className="flex justify-end mt-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsRecoveryOpen(true);
                                  setRecoveryStep('request');
                                  setRecoveryEmail(emailInput);
                                  setRecoveryFeedback(null);
                                  setRecoveryCode(null);
                                  setRecoverySuccess(false);
                                  setNewPasswordInput('');
                                  setConfirmPasswordInput('');
                                  setRecoveryCodeInput('');
                                }}
                                className="text-[10px] font-mono text-orange-brand hover:text-orange-brand/80 hover:underline transition-colors focus:outline-none cursor-pointer uppercase tracking-wider font-bold"
                              >
                                Forgot Passkey Signature?
                              </button>
                            </div>
                          )}
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
                              {t('termsConsent')}
                            </label>
                          </div>
                        )}

                        {/* Interactive buttons highlighted in striking, vibrant dark transparent orange */}
                        <button
                          type="submit"
                          className="w-full mt-2 py-3 bg-orange-trans hover:bg-orange-brand/20 text-orange-brand border border-orange-brand/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>
                            {isSignUp ? t('signUpBtn') : t('signInBtn')}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

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
              {t('activeSandboxing')}
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-gray-900 tracking-tight">
              {t('dashboardTitle')}
            </h2>
            <p className="text-gray-700 text-xs sm:text-sm mt-1 leading-relaxed">
              {t('dashboardSub')}
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
                  q: t('faq1Q'),
                  a: t('faq1A')
                },
                {
                  q: t('faq2Q'),
                  a: t('faq2A')
                },
                {
                  q: t('faq3Q'),
                  a: t('faq3A')
                },
                {
                  q: t('faq4Q'),
                  a: t('faq4A')
                },
                {
                  q: t('faq5Q'),
                  a: t('faq5A')
                },
                {
                  q: t('faqSecQ'),
                  a: (
                    <div className="space-y-3 font-sans">
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {t('faqSecA')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 flex flex-col gap-1 shadow-2xs hover:border-orange-brand/30 transition-all">
                          <span className="text-[10px] font-mono font-extrabold text-orange-brand uppercase tracking-wider">
                            {t('faqSecSymmetric')}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-display">AES-GCM-256</span>
                          <span className="text-[10px] text-gray-500 leading-normal font-mono">
                            {t('faqSecSymmetricDesc')}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 flex flex-col gap-1 shadow-2xs hover:border-indigo-500/30 transition-all">
                          <span className="text-[10px] font-mono font-extrabold text-indigo-600 uppercase tracking-wider">
                            {t('faqSecDerivation')}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-display">PBKDF2 HMAC-SHA256</span>
                          <span className="text-[10px] text-gray-500 leading-normal font-mono">
                            {t('faqSecDerivationDesc')}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 flex flex-col gap-1 shadow-2xs hover:border-emerald-500/30 transition-all">
                          <span className="text-[10px] font-mono font-extrabold text-emerald-600 uppercase tracking-wider">
                            {t('faqSecAsymmetric')}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-display">ECDH-P384 & Ed25519</span>
                          <span className="text-[10px] text-gray-500 leading-normal font-mono">
                            {t('faqSecAsymmetricDesc')}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 flex flex-col gap-1 shadow-2xs hover:border-amber-500/30 transition-all">
                          <span className="text-[10px] font-mono font-extrabold text-amber-600 uppercase tracking-wider">
                            {t('faqSecTransit')}
                          </span>
                          <span className="text-xs font-bold text-gray-900 font-display">TLS 1.3 / Forward Secrecy</span>
                          <span className="text-[10px] text-gray-500 leading-normal font-mono">
                            {t('faqSecTransitDesc')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
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
                            <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                              {faq.a}
                            </div>
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

      {/* PASSWORD RECOVERY EMAIL SIMULATION MODAL */}
      <AnimatePresence>
        {isRecoveryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRecoveryOpen(false)}
              className="absolute inset-0 bg-gray-950/60 backdrop-blur-xs"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-2xl border border-orange-brand/30 shadow-2xl overflow-hidden w-full max-w-lg z-10 p-6 relative text-gray-900"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-brand via-amber-500 to-orange-brand" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsRecoveryOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-mono text-[10px] font-bold border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg transition-all"
              >
                CLOSE
              </button>

              {/* Header */}
              <div className="border-b border-gray-100 pb-4 mb-4">
                <span className="text-[9px] font-mono font-bold bg-orange-trans border border-orange-brand/20 text-orange-brand px-2 py-0.5 rounded uppercase tracking-wider">
                  CommandNexus Key Recovery System
                </span>
                <h3 className="text-base sm:text-lg font-display font-black text-gray-950 mt-2">
                  {recoverySuccess ? "Signature Recovery Succeeded" : "Security Passkey Signature Reset"}
                </h3>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase tracking-wide">
                  Secure Zero-Knowledge Password Reset Handshake
                </p>
              </div>

              {recoveryFeedback && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-950 text-xs rounded-xl flex items-center gap-2 mb-4 font-mono">
                  <span>{recoveryFeedback}</span>
                </div>
              )}

              {recoverySuccess ? (
                /* SUCCESS FLOW */
                <div className="space-y-4 py-2">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2.5 text-emerald-950 text-xs">
                    <span className="font-bold font-mono text-[11px] uppercase text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      Handshake Complete: Key Restored
                    </span>
                    <p className="leading-relaxed">
                      Your cryptographic asymmetric signature hash has been rotated successfully. The simulated ledger is now armed with your new passkey credentials.
                    </p>
                  </div>

                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono space-y-1.5 text-gray-600">
                    <div className="flex justify-between">
                      <span>Restored Node Handle:</span>
                      <strong className="text-gray-900">{recoveryEmail.includes('@') ? recoveryEmail : `${recoveryEmail}${tier === 'premium' ? '@utubemail.com' : '@utubemail.free'}`}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>PBKDF2 Salting Rotation:</span>
                      <strong className="text-emerald-600">SUCCESSFUL</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Post-Quantum Key Validation:</span>
                      <strong className="text-emerald-600 font-bold uppercase">Armed</strong>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-500 leading-snug">
                    Your login input has been pre-filled with your restored node address and credentials.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryOpen(false);
                      setIsSignUp(false);
                    }}
                    className="w-full py-3 bg-orange-brand hover:bg-orange-brand/90 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Access Node</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : recoveryStep === 'request' ? (
                /* REQUEST CODE FORM */
                <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Provide your cryptographic node handle. The simulated SMTP relay will immediately dispatch a 6-digit recovery bypass signature code to authorize rotation.
                  </p>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                      Registered Node Address
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        required
                        placeholder="operator"
                        value={recoveryEmail.split('@')[0]}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full text-xs p-3 rounded-l-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all font-mono"
                      />
                      <span className="bg-gray-200 text-gray-600 px-4 flex items-center text-xs font-mono border-y border-r border-gray-300 rounded-r-xl">
                        {tier === 'premium' ? '@utubemail.com' : '@utubemail.free'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-trans hover:bg-orange-brand/20 text-orange-brand border border-orange-brand/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Dispatch Recovery Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* VERIFY & RESET PASSWORD FORM */
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  
                  {/* Simulated SMTP Code Banner inside Modal */}
                  {recoveryCode && (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs rounded-xl flex flex-col gap-1.5 shadow-xs animate-pulse">
                      <span className="font-bold font-mono text-[10px] uppercase text-indigo-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        SMTP Simulation: Secure Recovery Key
                      </span>
                      <p className="text-[10px] text-indigo-800 leading-normal">
                        Simulated secure relay dispatched security token: <strong className="text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-300 font-mono text-xs">{recoveryCode}</strong> to handle <span className="font-semibold text-indigo-800">{recoveryEmail.includes('@') ? recoveryEmail : `${recoveryEmail}${tier === 'premium' ? '@utubemail.com' : '@utubemail.free'}`}</span>.
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-700 leading-relaxed">
                    Verify your secure code and configure your rotated asymmetric passkey signature below.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                        6-Digit Security Token
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="Enter recovery code"
                        value={recoveryCodeInput}
                        onChange={(e) => setRecoveryCodeInput(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center text-base font-mono tracking-widest p-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all font-bold text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5 flex justify-between">
                        <span>New Passkey Signature</span>
                        <span className="text-[9px] text-orange-brand font-semibold lowercase">
                          locally encrypted
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder="••••••••••••"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          className="w-full text-xs p-3 pr-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                        Confirm New Passkey Signature
                      </label>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Real-time Strength display for new password */}
                  {newPasswordInput && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-3.5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-mono">
                          <span className="text-gray-500 uppercase tracking-wider font-bold">Key Strength:</span>
                          <span className={`font-black uppercase tracking-wider text-[10px] ${
                            newStrengthScore === 1 ? 'text-rose-600 animate-pulse' :
                            newStrengthScore === 2 ? 'text-amber-600' :
                            newStrengthScore === 3 ? 'text-indigo-600 font-bold' :
                            'text-emerald-600 font-black'
                          }`}>
                            {newStrengthScore === 1 && 'Critical Vulnerability ⚠️'}
                            {newStrengthScore === 2 && 'Susceptible / Weak'}
                            {newStrengthScore === 3 && 'Armored Key Pair'}
                            {newStrengthScore === 4 && 'Post-Quantum Secure ⚡'}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 h-1">
                          {[1, 2, 3, 4].map((seg) => (
                            <div
                              key={seg}
                              className={`h-full rounded-full transition-all duration-300 ${
                                seg <= newStrengthScore
                                  ? newStrengthScore === 1 ? 'bg-rose-500' :
                                    newStrengthScore === 2 ? 'bg-amber-500' :
                                    newStrengthScore === 3 ? 'bg-indigo-500' :
                                    'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1 text-[9px] font-mono">
                          <div className="flex items-center gap-1">
                            <span className={`w-1 h-1 rounded-full ${isNewLengthValid ? 'bg-emerald-500 scale-110' : 'bg-gray-300'}`} />
                            <span className={isNewLengthValid ? 'text-gray-900 font-bold' : 'text-gray-500'}>8+ Characters</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`w-1 h-1 rounded-full ${isNewCasingValid ? 'bg-emerald-500 scale-110' : 'bg-gray-300'}`} />
                            <span className={isNewCasingValid ? 'text-gray-900 font-bold' : 'text-gray-500'}>Aa-Zz Casing</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`w-1 h-1 rounded-full ${isNewNumberValid ? 'bg-emerald-500 scale-110' : 'bg-gray-300'}`} />
                            <span className={isNewNumberValid ? 'text-gray-900 font-bold' : 'text-gray-500'}>0-9 Number</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`w-1 h-1 rounded-full ${isNewSymbolValid ? 'bg-emerald-500 scale-110' : 'bg-gray-300'}`} />
                            <span className={isNewSymbolValid ? 'text-gray-900 font-bold' : 'text-gray-500'}>Special Symbol</span>
                          </div>
                        </div>
                      </div>

                      {/* PBKDF2 Entropy Stretching Real-Time Indicator */}
                      <div className="pt-2.5 border-t border-gray-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-orange-brand" />
                            PBKDF2 HMAC-SHA256 Stretching
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 bg-gray-200/50 px-1.5 py-0.5 rounded">
                            Work Factor
                          </span>
                        </div>

                        {/* Interactive dynamic visual metrics grid */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 bg-white border border-gray-200 rounded-lg text-center">
                            <div className="text-[8px] uppercase tracking-wider text-gray-400 font-mono font-bold">Entropy</div>
                            <div className="text-[11px] font-mono font-black text-gray-900 mt-0.5">
                              {passwordEntropy} <span className="text-[8px] font-normal text-gray-500">bits</span>
                            </div>
                          </div>
                          <div className="p-2 bg-white border border-gray-200 rounded-lg text-center">
                            <div className="text-[8px] uppercase tracking-wider text-gray-400 font-mono font-bold">Pool Size</div>
                            <div className="text-[11px] font-mono font-black text-gray-900 mt-0.5">
                              {poolSize} <span className="text-[8px] font-normal text-gray-500">chars</span>
                            </div>
                          </div>
                          <div className="p-2 bg-white border border-gray-200 rounded-lg text-center">
                            <div className="text-[8px] uppercase tracking-wider text-gray-400 font-mono font-bold">Hashing Rounds</div>
                            <div className="text-[11px] font-mono font-black text-orange-brand mt-0.5">
                              {pbkdf2Iterations.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Stretching depth thermometer gauge */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[8px] font-mono text-gray-400">
                            <span>Industry Baseline (100k)</span>
                            <span>Deep Fortified (750k)</span>
                          </div>
                          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            {/* Target value dynamic fill indicator */}
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: `${Math.min(100, Math.max(0, ((pbkdf2Iterations - 100000) / 650000) * 100))}%` }}
                              transition={{ type: "spring", stiffness: 80 }}
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 via-orange-brand to-emerald-500 rounded-full"
                            />
                            {/* Dynamic dot marker */}
                            <motion.div 
                              animate={{ left: `calc(${Math.min(100, Math.max(0, ((pbkdf2Iterations - 100000) / 650000) * 100))}% - 4px)` }}
                              className="absolute top-0.5 w-1 h-1 bg-white rounded-full shadow-md"
                            />
                          </div>
                          <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 pt-0.5">
                            <span>Hash Depth Multiplier:</span>
                            <span className="font-bold text-gray-800">{(pbkdf2Iterations / 100000).toFixed(2)}x standard toughness</span>
                          </div>
                        </div>

                        {/* Technical Entropy Explanation text block */}
                        <div className="p-2 bg-orange-trans/5 border border-orange-brand/10 rounded-lg text-[9px] text-gray-600 leading-relaxed font-mono">
                          <span className="font-bold text-orange-brand">Zero-Knowledge Stretching Rule:</span>{' '}
                          {passwordEntropy < 40 ? (
                            <span>Low entropy detected ({passwordEntropy} bits). Dynamic salting is actively scaling iterations to compensate for password susceptibility and resist brute-force dictionaries.</span>
                          ) : (
                            <span>High entropy verified. Excellent resistance against off-line brute force. The enclave stretches your key depth to <strong className="text-gray-900">{pbkdf2Iterations.toLocaleString()} HMAC rounds</strong> for armored security integrity.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-brand hover:bg-orange-brand/90 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Update Key Signature & Reset</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryStep('request');
                        setRecoveryFeedback(null);
                        setRecoveryCode(null);
                      }}
                      className="text-[10px] font-mono text-gray-500 hover:text-gray-800 underline uppercase tracking-wider font-bold cursor-pointer"
                    >
                      Back to Code Request
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMMERSIVE SMARTPHONE SIMULATOR WIDGET FOR SECURE QR CODE LOGIN SCANNING */}
      <AnimatePresence>
        {isPhoneSimOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-6 right-6 w-[320px] h-[580px] bg-[#0c0d10] border-4 border-[#232630] rounded-[40px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden z-50 flex flex-col font-sans select-none"
            style={{ boxShadow: "0 0 35px rgba(211,84,0,0.2)" }}
          >
            {/* Top Notch / Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-center p-1">
              <div className="w-3 h-3 bg-gray-950 rounded-full border border-gray-800 ml-auto mr-1" />
            </div>

            {/* Simulated Phone Header Status Bar */}
            <div className="h-10 bg-black text-white px-6 flex items-center justify-between text-[11px] font-mono z-20 shrink-0">
              <span className="font-bold">04:55 AM</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] bg-orange-brand/20 text-orange-brand px-1 rounded border border-orange-brand/30">LTE</span>
                <span className="text-[10px]">🔋 88%</span>
              </div>
            </div>

            {/* Main Phone Screen Frame */}
            <div className="flex-1 bg-gradient-to-b from-[#111319] to-[#08090d] text-white p-5 flex flex-col relative overflow-hidden">
              
              {/* Wallpaper backdrop accents */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-brand/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Close Phone button */}
              <button
                type="button"
                onClick={() => setIsPhoneSimOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors cursor-pointer z-30 text-[10px] bg-white/5 px-2.5 py-1 rounded-full border border-white/10"
              >
                Dismiss Phone
              </button>

              {/* PHONE SCREEN STATES */}
              {phoneStatus === 'home' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pt-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-brand to-amber-500 flex items-center justify-center shadow-lg shadow-orange-brand/20 animate-pulse">
                    <QrCode className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-mono tracking-wider uppercase text-gray-100">UTube Authenticator</h3>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed px-4">
                      Deploy your cryptographic biometric keychain signatures instantly to authorize node terminals.
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setPhoneStatus('app')}
                    className="px-6 py-3 bg-orange-brand hover:bg-orange-brand/90 text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-orange-brand/10"
                  >
                    Launch Authenticator App
                  </button>
                </div>
              )}

              {phoneStatus === 'app' && (
                <div className="flex-1 flex flex-col pt-8 justify-between">
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-[9px] font-mono font-bold tracking-widest text-orange-brand uppercase bg-orange-brand/10 px-2.5 py-1 rounded-full border border-orange-brand/10">
                        Secure Enclave Node
                      </span>
                      <h3 className="text-sm font-black font-mono tracking-wider text-white uppercase mt-2.5">
                        Handshake Controller
                      </h3>
                    </div>

                    <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div>
                        <label className="block text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                          Operator Account (Email Handle)
                        </label>
                        <select
                          value={phoneAccount}
                          onChange={(e) => setPhoneAccount(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-white/10 bg-gray-950 text-white focus:outline-none focus:ring-1 focus:ring-orange-brand transition-all"
                        >
                          <option value="operator@utubemail.com">Sovereign Operator (operator@utubemail.com)</option>
                          <option value="administrator@utubemail.com">Global Administrator (administrator@utubemail.com)</option>
                          <option value="custom@utubemail.com">Custom Operator (custom@utubemail.com)</option>
                        </select>
                      </div>

                      <div className="text-[10px] text-gray-400 leading-normal font-mono">
                        This email will be bound to the authorized session token upon biometric approval.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pb-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!qrToken) {
                          alert("Please generate a QR Code on the desktop sign-in form first!");
                          return;
                        }
                        setPhoneStatus('scanning');
                        setScanProgress(0);
                        const interval = setInterval(() => {
                          setScanProgress((prev) => {
                            if (prev >= 100) {
                              clearInterval(interval);
                              // Trigger scanning API endpoint
                              fetch("/api/auth/qr/scan", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ token: qrToken, email: phoneAccount })
                              })
                              .then((res) => {
                                if (res.ok) {
                                  setPhoneStatus('verifying');
                                } else {
                                  alert("Scanning sync error. Make sure QR on screen is valid!");
                                  setPhoneStatus('app');
                                }
                              })
                              .catch((err) => {
                                console.error(err);
                                setPhoneStatus('app');
                              });
                              return 100;
                            }
                            return prev + 20;
                          });
                        }, 300);
                      }}
                      className="w-full py-3.5 bg-orange-brand hover:bg-orange-brand/90 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Scan className="w-4 h-4" />
                      Scan Desktop QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhoneStatus('home')}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-mono text-[10px] uppercase rounded-lg transition-all cursor-pointer"
                    >
                      Back to Home Lockscreen
                    </button>
                  </div>
                </div>
              )}

              {phoneStatus === 'scanning' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pt-10">
                  <div className="relative w-44 h-44 border-2 border-dashed border-orange-brand/60 rounded-3xl overflow-hidden flex items-center justify-center bg-gray-950">
                    {/* Laser line effect */}
                    <div className="absolute left-0 right-0 h-1 bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-bounce z-10" />
                    
                    <QrCode className="w-20 h-20 text-gray-700 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-orange-brand">
                      Scanning Screen Matrix...
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Aligning camera aperture to read cryptotoken signatures.
                    </p>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden px-1">
                    <div className="bg-orange-brand h-full rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }} />
                  </div>
                </div>
              )}

              {phoneStatus === 'verifying' && (
                <div className="flex-1 flex flex-col pt-8 justify-between">
                  <div className="space-y-4">
                    <div className="text-center">
                      <Shield className="w-10 h-10 text-orange-brand mx-auto mb-2" />
                      <h4 className="text-sm font-black font-mono uppercase tracking-wider text-white">
                        Access Request Verified
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Cryptographic handshakes match. Awaiting validation.
                      </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2.5 font-mono text-[10px] text-left">
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">CLIENT APP:</span>
                        <span className="font-bold text-gray-300 text-right">UTube Media Desktop Web</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">OPERATOR:</span>
                        <span className="font-bold text-orange-brand text-right truncate max-w-[150px]">{phoneAccount}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">PREV ADDR:</span>
                        <span className="font-bold text-gray-300 text-right">10.142.0.19 Enclave</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">CRYPTOTOKEN:</span>
                        <span className="font-bold text-gray-300 text-right truncate max-w-[150px]">{qrToken?.slice(0, 15)}...</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pb-2">
                    {isBiometricScanning ? (
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center space-y-3">
                        <Fingerprint className="w-10 h-10 text-emerald-500 animate-pulse mx-auto" />
                        <span className="text-xs font-mono font-bold text-emerald-400 block animate-pulse">
                          Verifying FaceID/Fingerprint Signature...
                        </span>
                        <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-200" style={{ width: `${biometricProgress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsBiometricScanning(true);
                            setBiometricProgress(0);
                            const interval = setInterval(() => {
                              setBiometricProgress((prev) => {
                                if (prev >= 100) {
                                  clearInterval(interval);
                                  // Call authorization API endpoint with approve: true
                                  fetch("/api/auth/qr/authorize", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ token: qrToken, email: phoneAccount, approve: true })
                                  })
                                  .then((res) => {
                                    if (res.ok) {
                                      setPhoneStatus('success');
                                      setIsBiometricScanning(false);
                                    }
                                  })
                                  .catch((err) => console.error(err));
                                  return 100;
                                }
                                return prev + 10;
                              });
                            }, 150);
                          }}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
                        >
                          <Fingerprint className="w-4 h-4" />
                          Approve Handshake
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            fetch("/api/auth/qr/authorize", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ token: qrToken, email: phoneAccount, approve: false })
                            })
                            .then(() => {
                              setPhoneStatus('rejected');
                            })
                            .catch((err) => console.error(err));
                          }}
                          className="w-full py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-mono text-[10px] uppercase rounded-lg transition-all cursor-pointer"
                        >
                          Reject Access Request
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {phoneStatus === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pt-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/5 animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-mono tracking-wider text-emerald-400 uppercase">
                      Signature Transmitted
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed px-2">
                      Authentication payload successfully authorized and dispatched to desktop node.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPhoneStatus('home');
                    }}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-[10px] uppercase tracking-wider rounded-lg border border-white/10 cursor-pointer"
                  >
                    Lock Device
                  </button>
                </div>
              )}

              {phoneStatus === 'rejected' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pt-6">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center shadow-lg animate-bounce">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-mono tracking-wider text-rose-400 uppercase">
                      Handshake Denied
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed px-2">
                      You rejected the desktop access request. The session authorization was immediately aborted.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPhoneStatus('app');
                    }}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-[10px] uppercase tracking-wider rounded-lg border border-white/10 cursor-pointer"
                  >
                    Back to app
                  </button>
                </div>
              )}

              {/* Home Screen indicator pill */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
