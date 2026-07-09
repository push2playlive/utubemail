export interface UserProfile {
  username: string;
  email: string;
  tier: 'standard' | 'premium';
  avatarSeed: string;
  accentColor: string; // hex or tailwind color
  bgGradientStyle: 'soft-grey' | 'metallic' | 'dark-platinum' | 'stardust';
  securityNotifications?: boolean;
}

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isEncrypted: boolean;
  size: string;
}

export interface EcosystemApp {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  url: string;
  isPremiumOnly: boolean;
  isNew?: boolean;
}

export interface SponsorAd {
  id: string;
  title: string;
  tagline: string;
  sponsor: string;
  ctaText: string;
  accent: string;
}
