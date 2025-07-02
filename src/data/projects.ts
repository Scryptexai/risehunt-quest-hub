import nitrodexLogo from '@/assets/nitrodex-logo.jpg';
import standardLogo from '@/assets/standard-logo.jpg';
import onchainGMLogo from '@/assets/onchaingm-logo.jpg';
import kingdomLogo from '@/assets/kingdom-logo.jpg';
import inarfiLogo from '@/assets/inarfi-logo.jpg';
import b3xLogo from '@/assets/b3x-logo.jpg';

export interface Task {
  id: string;
  title: string;
  type: 'SOCIAL' | 'ON-CHAIN';
  platform: 'twitter' | 'discord' | 'telegram' | 'website' | 'onchain';
  link: string;
  description: string;
  status: 'incomplete' | 'verify' | 'completed';
  reward: string;
}

export interface Project {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  tasks: Task[];
}

export const projects: Project[] = [
  {
    id: 'nitrodex',
    name: 'NitroDex',
    logo: nitrodexLogo,
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
        reward: 'Trader Badge NFT'
      },
      {
        id: 'nitrodex-twitter',
        title: 'Follow on Twitter',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/nitro_dex',
        description: 'Follow @nitro_dex for updates',
        status: 'incomplete',
        reward: 'Supporter Badge NFT'
      }
    ]
  },
  {
    id: 'standard',
    name: 'Standard Protocol',
    logo: standardLogo,
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
        reward: 'Community Badge NFT'
      },
      {
        id: 'standard-discord',
        title: 'Join Discord',
        type: 'SOCIAL',
        platform: 'discord',
        link: 'https://discord.gg/standardweb3',
        description: 'Join our Discord server for discussions',
        status: 'incomplete',
        reward: 'Discord Member Badge'
      },
      {
        id: 'standard-retweet',
        title: 'Retweet announcement',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/standardweb3',
        description: 'Retweet our latest announcement',
        status: 'incomplete',
        reward: 'Amplifier Badge NFT'
      }
    ]
  },
  {
    id: 'onchaingm',
    name: 'OnchainGM',
    logo: onchainGMLogo,
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
        reward: 'GM Badge NFT'
      },
      {
        id: 'onchaingm-discord',
        title: 'Join Discord',
        type: 'SOCIAL',
        platform: 'discord',
        link: 'https://discord.gg/onchaingmcom',
        description: 'Join our vibrant Discord community',
        status: 'incomplete',
        reward: 'Community Builder Badge'
      }
    ]
  },
  {
    id: 'kingdom',
    name: 'For The Kingdom',
    logo: kingdomLogo,
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
        reward: 'Knight Badge NFT'
      },
      {
        id: 'kingdom-twitter',
        title: 'Follow on Twitter',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/4thekingdom_xyz',
        description: 'Follow @4thekingdom_xyz for guild updates',
        status: 'incomplete',
        reward: 'Loyalty Badge NFT'
      },
      {
        id: 'kingdom-telegram',
        title: 'Join Telegram',
        type: 'SOCIAL',
        platform: 'telegram',
        link: 'https://t.me/forthekingdom_bot',
        description: 'Join our Telegram for quick updates',
        status: 'incomplete',
        reward: 'Messenger Badge NFT'
      }
    ]
  },
  {
    id: 'inarfi',
    name: 'Inarfi',
    logo: inarfiLogo,
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
        reward: 'Explorer Badge NFT'
      },
      {
        id: 'inarfi-twitter',
        title: 'Follow Twitter',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/inari_fi',
        description: 'Follow @inari_fi for DeFi insights',
        status: 'incomplete',
        reward: 'DeFi Supporter Badge'
      }
    ]
  },
  {
    id: 'b3x',
    name: 'B3X',
    logo: b3xLogo,
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
        reward: 'AI Tester Badge NFT'
      },
      {
        id: 'b3x-twitter',
        title: 'Follow Twitter',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/b3xai',
        description: 'Follow @b3xai for AI trading updates',
        status: 'incomplete',
        reward: 'AI Enthusiast Badge'
      }
    ]
  }
];