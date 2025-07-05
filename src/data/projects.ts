import nitrodexLogo from '@/assets/nitrodex-logo.jpg';
import standardLogo from '@/assets/standard-logo.jpg';
import onchainGMLogo from '@/assets/onchaingm-logo.jpg';
import kingdomLogo from '@/assets/kingdom-logo.jpg';
import inarfiLogo from '@/assets/inarfi-logo.jpg';
import b3xLogo from '@/assets/b3x-logo.jpg';

// NFT Badge Images
import nitrodexBadge from '@/assets/badges/nitrodex-badge.jpg';
import standardBadge from '@/assets/badges/standard-badge.jpg';
import onchainGMBadge from '@/assets/badges/onchaingm-badge.jpg';
import kingdomBadge from '@/assets/badges/kingdom-badge.jpg';
import inarfiBadge from '@/assets/badges/inarfi-badge.jpg';
import b3xBadge from '@/assets/badges/b3x-badge.jpg';

export interface VerificationCriteria {
  type: 'social_follow' | 'social_join' | 'website_visit' | 'onchain_transaction';
  simulationDelayMs: number;
  successRate: number;
}

export interface Task {
  id: string;
  title: string;
  type: 'SOCIAL' | 'ON-CHAIN';
  platform: 'twitter' | 'discord' | 'telegram' | 'website' | 'onchain';
  link: string;
  description: string;
  status: 'incomplete' | 'in_progress' | 'completed';
  reward: string;
  verificationCriteria: VerificationCriteria;
}

export interface Project {
  id: string;
  name: string;
  logo: string;
  badgeImage: string;
  description: string;
  website: string;
  tasks: Task[];
}

export const projects: Project[] = [
  {
    id: 'nitrodex',
    name: 'NitroDex',
    logo: nitrodexLogo,
    badgeImage: nitrodexBadge,
    description: 'Decentralized trading platform with lightning-fast swaps',
    website: 'https://www.nitrodex.xyz/trade',
    tasks: [
      {
        id: 'nitrodex-swap',
        title: 'Swap any token',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://www.nitrodex.xyz/trade',
        description: 'Complete your first token swap on NitroDex',
        status: 'incomplete',
        reward: 'Trader Badge NFT',
        verificationCriteria: {
          type: 'onchain_transaction',
          simulationDelayMs: 3000,
          successRate: 0.9
        }
      },
      {
        id: 'nitrodex-twitter',
        title: 'Follow on Twitter',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/nitro_dex',
        description: 'Follow @nitro_dex for updates',
        status: 'incomplete',
        reward: 'Supporter Badge NFT',
        verificationCriteria: {
          type: 'social_follow',
          simulationDelayMs: 2000,
          successRate: 0.95
        }
      }
    ]
  },
  {
    id: 'standard',
    name: 'Standard Protocol',
    logo: standardLogo,
    badgeImage: standardBadge,
    description: 'Next-generation DeFi infrastructure protocol',
    website: 'https://standardweb3.com/',
    tasks: [
      {
        id: 'standard-telegram',
        title: 'Join Telegram',
        type: 'SOCIAL',
        platform: 'telegram',
        link: 'https://t.me/standard_protocol',
        description: 'Join the Standard Protocol community on Telegram',
        status: 'incomplete',
        reward: 'Community Badge NFT',
        verificationCriteria: {
          type: 'social_join',
          simulationDelayMs: 1500,
          successRate: 0.92
        }
      },
      {
        id: 'standard-discord',
        title: 'Join Discord',
        type: 'SOCIAL',
        platform: 'discord',
        link: 'https://discord.gg/standardweb3',
        description: 'Join our Discord server for discussions',
        status: 'incomplete',
        reward: 'Discord Member Badge',
        verificationCriteria: {
          type: 'social_join',
          simulationDelayMs: 1800,
          successRate: 0.88
        }
      },
      {
        id: 'standard-retweet',
        title: 'Retweet announcement',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/standardweb3',
        description: 'Retweet our latest announcement',
        status: 'incomplete',
        reward: 'Amplifier Badge NFT',
        verificationCriteria: {
          type: 'social_follow',
          simulationDelayMs: 2200,
          successRate: 0.85
        }
      }
    ]
  },
  {
    id: 'onchaingm',
    name: 'OnchainGM',
    logo: onchainGMLogo,
    badgeImage: onchainGMBadge,
    description: 'Social platform for Web3 communities',
    website: 'https://onchaingm.com/',
    tasks: [
      {
        id: 'onchaingm-twitter',
        title: 'Follow Twitter',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/onchainGM',
        description: 'Follow @onchainGM for daily updates',
        status: 'incomplete',
        reward: 'GM Badge NFT',
        verificationCriteria: {
          type: 'social_follow',
          simulationDelayMs: 1200,
          successRate: 0.93
        }
      },
      {
        id: 'onchaingm-discord',
        title: 'Join Discord',
        type: 'SOCIAL',
        platform: 'discord',
        link: 'https://discord.gg/onchaingmcom',
        description: 'Join our vibrant Discord community',
        status: 'incomplete',
        reward: 'Community Builder Badge',
        verificationCriteria: {
          type: 'social_join',
          simulationDelayMs: 1600,
          successRate: 0.9
        }
      }
    ]
  },
  {
    id: 'kingdom',
    name: 'For The Kingdom',
    logo: kingdomLogo,
    badgeImage: kingdomBadge,
    description: 'Gaming guild and NFT ecosystem',
    website: 'https://forthekingdom.xyz/',
    tasks: [
      {
        id: 'kingdom-discord',
        title: 'Join Discord',
        type: 'SOCIAL',
        platform: 'discord',
        link: 'https://discord.gg/swFrPYtAUc',
        description: 'Join the kingdom and meet fellow warriors',
        status: 'incomplete',
        reward: 'Knight Badge NFT',
        verificationCriteria: {
          type: 'social_join',
          simulationDelayMs: 1400,
          successRate: 0.87
        }
      },
      {
        id: 'kingdom-twitter',
        title: 'Follow on Twitter',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/4thekingdom_xyz',
        description: 'Follow @4thekingdom_xyz for guild updates',
        status: 'incomplete',
        reward: 'Loyalty Badge NFT',
        verificationCriteria: {
          type: 'social_follow',
          simulationDelayMs: 1800,
          successRate: 0.91
        }
      },
      {
        id: 'kingdom-telegram',
        title: 'Join Telegram',
        type: 'SOCIAL',
        platform: 'telegram',
        link: 'https://t.me/forthekingdom_bot',
        description: 'Join our Telegram for quick updates',
        status: 'incomplete',
        reward: 'Messenger Badge NFT',
        verificationCriteria: {
          type: 'social_join',
          simulationDelayMs: 1300,
          successRate: 0.89
        }
      }
    ]
  },
  {
    id: 'inarfi',
    name: 'Inarfi',
    logo: inarfiLogo,
    badgeImage: inarfiBadge,
    description: 'Innovative DeFi yield farming platform',
    website: 'https://www.inarifi.com/',
    tasks: [
      {
        id: 'inarfi-website',
        title: 'Visit site',
        type: 'SOCIAL',
        platform: 'website',
        link: 'https://www.inarifi.com/',
        description: 'Explore the Inarfi platform',
        status: 'incomplete',
        reward: 'Explorer Badge NFT',
        verificationCriteria: {
          type: 'website_visit',
          simulationDelayMs: 1000,
          successRate: 0.98
        }
      },
      {
        id: 'inarfi-twitter',
        title: 'Follow Twitter',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/inari_fi',
        description: 'Follow @inari_fi for DeFi insights',
        status: 'incomplete',
        reward: 'DeFi Supporter Badge',
        verificationCriteria: {
          type: 'social_follow',
          simulationDelayMs: 1700,
          successRate: 0.94
        }
      }
    ]
  },
  {
    id: 'b3x',
    name: 'B3X',
    logo: b3xLogo,
    badgeImage: b3xBadge,
    description: 'AI-powered trading and analytics platform',
    website: 'https://testnet.b3x.ai/',
    tasks: [
      {
        id: 'b3x-testnet',
        title: 'Try testnet app',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://testnet.b3x.ai/',
        description: 'Test the B3X AI trading platform',
        status: 'incomplete',
        reward: 'AI Tester Badge NFT',
        verificationCriteria: {
          type: 'onchain_transaction',
          simulationDelayMs: 4000,
          successRate: 0.8
        }
      },
      {
        id: 'b3x-twitter',
        title: 'Follow Twitter',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/b3xai',
        description: 'Follow @b3xai for AI trading updates',
        status: 'incomplete',
        reward: 'AI Enthusiast Badge',
        verificationCriteria: {
          type: 'social_follow',
          simulationDelayMs: 1900,
          successRate: 0.92
        }
      }
    ]
  }
];