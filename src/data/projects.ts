import nitrodexLogo from '@/assets/nitrodex-logo.jpg';
import standardLogo from '@/assets/standard-logo.jpg';
import onchainGMLogo from '@/assets/onchaingm-logo.jpg';
import kingdomLogo from '@/assets/kingdom-logo.jpg';
import inarfiLogo from '@/assets/inarfi-logo.jpg';
import b3xLogo from '@/assets/b3x-logo.jpg';

// Import badge images (pastikan path ini sesuai dengan struktur folder Anda)
import nitrodexBadge from '@/assets/badges/nitrodex-badge.png';
import standardBadge from '@/assets/badges/standard-badge.png';
import onchainGmBadge from '@/assets/badges/onchaingm-badge.png';
import kingdomBadge from '@/assets/badges/kingdom-badge.png';
import inarfiBadge from '@/assets/badges/inarfi-badge.png';
import b3xBadge from '@/assets/badges/b3x-badge.png';
import omnihubBadge from '@/assets/badges/omnihub-badge.png';
import gaspumpBadge from '@/assets/badges/gaspump-badge.png';


export interface Task {
  id: string;
  title: string;
  type: 'SOCIAL' | 'ON-CHAIN';
  platform: 'twitter' | 'discord' | 'telegram' | 'website' | 'onchain';
  link: string; // Link untuk meluncurkan dApp/sosmed
  description: string;
  status: 'incomplete' | 'in_progress' | 'completed'; // 'in_progress' untuk simulasi verifikasi otomatis
  reward: string; // Nama reward
  verificationCriteria?: {
    type: 'tx_event' | 'api_call' | 'manual_simulated';
    contractAddress?: string; // Placeholder: alamat kontrak relevan
    eventName?: string;       // Placeholder: nama event relevan
    minAmount?: number;       // Minimal jumlah untuk verifikasi transaksi
    platformApi?: 'twitter' | 'discord' | 'telegram'; // Untuk tugas sosial
    action?: 'follow' | 'retweet' | 'join' | 'send_message' | 'game_action' | 'mint' | 'bridge' | 'trade' | 'add_liquidity' | 'borrow' | 'repay' | 'deposit' | 'long_trade' | 'short_trade' | 'deploy' | 'check_in_game'; // Aksi spesifik
    targetId?: string;        // Handle/ID target (misal: Twitter handle, Discord server ID)
    simulationDelayMs?: number; // Durasi simulasi verifikasi
    valueDisplay?: string; // NEW: untuk menampilkan nominal di UI (contoh: "$100 USDC")
  };
}

export interface DailyTaskMeta {
  id: string;
  title: string;
  action: 'swap' | 'borrow' | 'repay' | 'deposit' | 'long_trade' | 'short_trade' | 'deploy' | 'check_in_game' | 'add_liquidity' | 'trade'; // Aksi spesifik untuk daily task
  link: string; // Link ke halaman dApp untuk aksi harian ini
  dailyLimit: number; // Batas harian
  totalForBadge: number; // Total completion untuk mendapatkan daily badge
  simulationDelayMs: number; // Durasi simulasi
  platform: 'onchain' | 'website'; // Platform terkait (biasanya onchain)
  reward: string; // Reward untuk daily task ini
}

export interface Project {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string; // Link website utama proyek
  tasks: Task[]; // Tugas reguler untuk main project badge
  badgeImage: string; // Path gambar NFT badge proyek
  dailyTasks?: DailyTaskMeta[]; // Tugas harian spesifik untuk proyek ini
}

export const projects: Project[] = [
  {
    id: 'nitrodex',
    name: 'NitroDex',
    logo: nitrodexLogo,
    description: 'Decentralized trading platform with lightning-fast swaps',
    website: 'https://www.nitrodex.xyz/',
    badgeImage: nitrodexBadge,
    tasks: [
      {
        id: 'nitrodex-swap-main',
        title: 'Perform your first Swap on NitroDex',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://www.nitrodex.xyz/trade',
        description: 'Complete your very first token swap on NitroDex (any amount).',
        status: 'incomplete',
        reward: 'First Swap Master Badge',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xNITRODEX_ROUTER_ADDRESS',
          eventName: 'Swap',
          minAmount: 0.000001,
          simulationDelayMs: 3000,
          valueDisplay: 'Any amount' // Contoh tampilan nominal
        }
      },
      {
        id: 'nitrodex-add-lp-main',
        title: 'Add Liquidity to NitroDex Pool',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://www.nitrodex.xyz/pool',
        description: 'Provide liquidity to any pool on NitroDex.',
        status: 'incomplete',
        reward: 'Initial LP Badge',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xNITRODEX_FACTORY_ADDRESS',
          eventName: 'Mint',
          simulationDelayMs: 4000,
          valueDisplay: 'Any pair'
        }
      },
      {
        id: 'nitrodex-twitter',
        title: 'Follow NitroDex on X',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/nitro_dex',
        description: 'Follow @nitro_dex on X (formerly Twitter) for updates.',
        status: 'incomplete',
        reward: 'Supporter Badge NFT',
        verificationCriteria: {
          type: 'api_call',
          platformApi: 'twitter',
          action: 'follow',
          targetId: 'nitro_dex',
          simulationDelayMs: 2000
        }
      }
    ],
    dailyTasks: [ // DAILY TASKS UNTUK NITRODEX
      {
        id: 'nitrodex-daily-swap',
        title: 'Daily Swap',
        action: 'swap',
        link: 'https://www.nitrodex.xyz/trade',
        dailyLimit: 5,
        totalForBadge: 20,
        simulationDelayMs: 2000,
        platform: 'onchain',
        reward: 'NitroDex Daily Trader Badge'
      },
      {
        id: 'nitrodex-daily-add-lp',
        title: 'Daily Add Liquidity',
        action: 'add_liquidity',
        link: 'https://www.nitrodex.xyz/pool',
        dailyLimit: 2, // contoh limit 2x add LP per hari
        totalForBadge: 10, // contoh total 10x add LP untuk badge
        simulationDelayMs: 3000,
        platform: 'onchain',
        reward: 'NitroDex Daily LP Badge'
      }
    ]
  },
  {
    id: 'standard',
    name: 'Standard Protocol',
    logo: standardLogo,
    description: 'Next-generation DeFi infrastructure protocol',
    website: 'https://standardweb3.com/',
    badgeImage: standardBadge,
    tasks: [
      {
        id: 'standard-trade-main',
        title: 'Perform a Trade on Standard DEX',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://standardweb3.com/trade',
        description: 'Execute any token trade on Standard Protocol\'s DEX.',
        status: 'incomplete',
        reward: 'Standard Trader Badge',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xSTANDARD_DEX_ADDRESS',
          eventName: 'Swap',
          minAmount: 0.000001,
          simulationDelayMs: 3000,
          valueDisplay: 'Any token'
        }
      },
      {
        id: 'standard-limit-order-main',
        title: 'Place a Limit Order on Standard',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://standardweb3.com/limit-order',
        description: 'Place a limit order on the Standard Protocol DEX.',
        status: 'incomplete',
        reward: 'Precision Trader Badge',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xSTANDARD_ORDERBOOK_ADDRESS',
          eventName: 'OrderPlaced',
          simulationDelayMs: 3500,
          valueDisplay: 'Any pair'
        }
      },
      {
        id: 'standard-telegram',
        title: 'Join Telegram Community',
        type: 'SOCIAL',
        platform: 'telegram',
        link: 'https://t.me/standard_protocol',
        description: 'Join the Standard Protocol community on Telegram.',
        status: 'incomplete',
        reward: 'Community Badge NFT',
        verificationCriteria: {
          type: 'api_call',
          platformApi: 'telegram',
          action: 'join',
          targetId: 'standard_protocol',
          simulationDelayMs: 2500
        }
      },
    ],
    dailyTasks: [ // DAILY TASKS UNTUK STANDARD
      {
        id: 'standard-daily-trade',
        title: 'Daily Trade',
        action: 'trade',
        link: 'https://standardweb3.com/trade',
        dailyLimit: 5,
        totalForBadge: 20,
        simulationDelayMs: 2000,
        platform: 'onchain',
        reward: 'Standard Daily Trader Badge'
      }
    ]
  },
  {
    id: 'onchaingm',
    name: 'OnchainGM',
    logo: onchainGMLogo,
    description: 'Social platform for Web3 communities',
    website: 'https://onchaingm.com/',
    badgeImage: onchainGmBadge,
    tasks: [
      {
        id: 'onchaingm-twitter',
        title: 'Follow OnchainGM on X',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/onchainGM',
        description: 'Follow @onchainGM for daily updates.',
        status: 'incomplete',
        reward: 'GM Badge NFT',
        verificationCriteria: {
          type: 'api_call',
          platformApi: 'twitter',
          action: 'follow',
          targetId: 'onchainGM',
          simulationDelayMs: 2000
        }
      },
      {
        id: 'onchaingm-discord',
        title: 'Join OnchainGM Discord',
        type: 'SOCIAL',
        platform: 'discord',
        link: 'https://discord.gg/onchaingmcom',
        description: 'Join our vibrant Discord community.',
        status: 'incomplete',
        reward: 'Community Builder Badge',
        verificationCriteria: {
          type: 'api_call',
          platformApi: 'discord',
          action: 'join',
          targetId: 'onchaingmcom',
          simulationDelayMs: 2800
        }
      },
      { // NEW main quest task for deploy
        id: 'onchaingm-deploy-main',
        title: 'Deploy a Contract on OnchainGM',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://onchaingm.com/deploy', // Assuming a deploy link
        description: 'Deploy your first smart contract using OnchainGM platform.',
        status: 'incomplete',
        reward: 'Contract Pioneer Badge',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xONCHAINGM_DEPLOY_FACTORY', // Placeholder
          eventName: 'ContractDeployed',
          simulationDelayMs: 5000,
          valueDisplay: 'Any contract'
        }
      }
    ],
    dailyTasks: [ // DAILY TASKS UNTUK ONCHAINGM
      {
        id: 'onchaingm-daily-deploy',
        title: 'Daily Contract Deployment',
        action: 'deploy',
        link: 'https://onchaingm.com/deploy',
        dailyLimit: 1,
        totalForBadge: 4,
        simulationDelayMs: 4000,
        platform: 'onchain',
        reward: 'OnchainGM Daily Deployer Badge'
      }
    ]
  },
  {
    id: 'kingdom',
    name: 'For The Kingdom',
    logo: kingdomLogo,
    description: 'Gaming guild and NFT ecosystem',
    website: 'https://forthekingdom.xyz/',
    badgeImage: kingdomBadge,
    tasks: [
      {
        id: 'kingdom-play-game-main',
        title: 'Perform an Action in Game',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://forthekingdom.xyz/game', // Assuming a game launch link
        description: 'Perform any valid on-chain action within the For The Kingdom game.',
        status: 'incomplete',
        reward: 'Game Player Badge',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xKINGDOM_GAME_CONTRACT',
          eventName: 'PlayerAction',
          simulationDelayMs: 5000,
          valueDisplay: 'Any in-game action'
        }
      },
      {
        id: 'kingdom-twitter',
        title: 'Follow For The Kingdom on X',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/4thekingdom_xyz',
        description: 'Follow @4thekingdom_xyz for guild updates.',
        status: 'incomplete',
        reward: 'Loyalty Badge NFT',
        verificationCriteria: {
          type: 'api_call',
          platformApi: 'twitter',
          action: 'follow',
          targetId: '4thekingdom_xyz',
          simulationDelayMs: 2200
        }
      },
    ],
    dailyTasks: [ // DAILY TASKS UNTUK KINGDOM
      {
        id: 'kingdom-daily-checkin',
        title: 'Daily Game Check-in',
        action: 'check_in_game',
        link: 'https://forthekingdom.xyz/game',
        dailyLimit: 1,
        totalForBadge: 4,
        simulationDelayMs: 3000,
        platform: 'onchain',
        reward: 'Kingdom Daily Loyalist Badge'
      }
    ]
  },
  {
    id: 'inarfi',
    name: 'Inarfi',
    logo: inarfiLogo,
    description: 'Innovative DeFi yield farming platform',
    website: 'https://www.inarifi.com/',
    badgeImage: inarfiBadge,
    tasks: [
      {
        id: 'inarfi-deposit-main',
        title: 'Deposit Assets on Inarfi',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://www.inarifi.com/deposit',
        description: 'Deposit any asset into Inarfi to earn yield.',
        status: 'incomplete',
        reward: 'Depositor Badge NFT',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xINARFI_LENDING_POOL_ADDRESS',
          eventName: 'Deposit',
          minAmount: 0.000001,
          simulationDelayMs: 3000,
          valueDisplay: 'Any amount'
        }
      },
      {
        id: 'inarfi-borrow-main',
        title: 'Borrow Tokens on Inarfi',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://www.inarifi.com/borrow',
        description: 'Borrow any token using your collateral on Inarfi.',
        status: 'incomplete',
        reward: 'Borrower Badge NFT',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xINARFI_LENDING_POOL_ADDRESS',
          eventName: 'Borrow',
          minAmount: 0.000001,
          simulationDelayMs: 3500,
          valueDisplay: 'Any amount'
        }
      },
      {
        id: 'inarfi-repay-main',
        title: 'Repay Loan on Inarfi',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://www.inarifi.com/borrow',
        description: 'Repay any outstanding loan on Inarfi.',
        status: 'incomplete',
        reward: 'Responsible User Badge NFT',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xINARFI_LENDING_POOL_ADDRESS',
          eventName: 'Repay',
          minAmount: 0.000001,
          simulationDelayMs: 3500,
          valueDisplay: 'Any amount'
        }
      },
      {
        id: 'inarfi-twitter',
        title: 'Follow Inarfi on X',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/inari_fi',
        description: 'Follow @inari_fi for DeFi insights.',
        status: 'incomplete',
        reward: 'DeFi Supporter Badge',
        verificationCriteria: {
          type: 'api_call',
          platformApi: 'twitter',
          action: 'follow',
          targetId: 'inari_fi',
          simulationDelayMs: 2000
        }
      }
    ],
    dailyTasks: [ // DAILY TASKS UNTUK INARFI
      {
        id: 'inarfi-daily-deposit',
        title: 'Daily Deposit',
        action: 'deposit',
        link: 'https://www.inarifi.com/deposit',
        dailyLimit: 3, // Limit ini berlaku gabungan untuk deposit, borrow, repay
        totalForBadge: 10,
        simulationDelayMs: 2000,
        platform: 'onchain',
        reward: 'Inarfi Daily Depositor Badge'
      },
      {
        id: 'inarfi-daily-borrow',
        title: 'Daily Borrow',
        action: 'borrow',
        link: 'https://www.inarifi.com/borrow',
        dailyLimit: 3, // Limit ini berlaku gabungan untuk deposit, borrow, repay
        totalForBadge: 10,
        simulationDelayMs: 2500,
        platform: 'onchain',
        reward: 'Inarfi Daily Borrower Badge'
      },
      {
        id: 'inarfi-daily-repay',
        title: 'Daily Repay',
        action: 'repay',
        link: 'https://www.inarifi.com/borrow',
        dailyLimit: 3, // Limit ini berlaku gabungan untuk deposit, borrow, repay
        totalForBadge: 10,
        simulationDelayMs: 2500,
        platform: 'onchain',
        reward: 'Inarfi Daily Repayer Badge'
      }
    ]
  },
  {
    id: 'b3x',
    name: 'B3X',
    logo: b3xLogo,
    description: 'AI-powered trading and analytics platform',
    website: 'https://testnet.b3x.ai/',
    badgeImage: b3xBadge,
    tasks: [
      {
        id: 'b3x-claim-faucet-main',
        title: 'Claim Testnet Faucet Tokens',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://testnet.b3x.ai/faucet',
        description: 'Claim free testnet tokens from B3X faucet to start trading.',
        status: 'incomplete',
        reward: 'Faucet Claimer Badge',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xB3X_FAUCET_ADDRESS',
          eventName: 'TokensClaimed',
          simulationDelayMs: 2500,
          valueDisplay: 'Any amount'
        }
      },
      {
        id: 'b3x-open-long-main',
        title: 'Open a Long Position on B3X',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://testnet.b3x.ai/#/trade',
        description: 'Open a long trading position on B3X testnet.',
        status: 'incomplete',
        reward: 'B3X Long Trader Badge',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xB3X_TRADING_CONTRACT',
          eventName: 'LongTradeOpened',
          simulationDelayMs: 4000,
          valueDisplay: 'Any pair'
        }
      },
      {
        id: 'b3x-open-short-main',
        title: 'Open a Short Position on B3X',
        type: 'ON-CHAIN',
        platform: 'onchain',
        link: 'https://testnet.b3x.ai/#/trade',
        description: 'Open a short trading position on B3X testnet.',
        status: 'incomplete',
        reward: 'B3X Short Trader Badge',
        verificationCriteria: {
          type: 'tx_event',
          contractAddress: '0xB3X_TRADING_CONTRACT',
          eventName: 'ShortTradeOpened',
          simulationDelayMs: 4000,
          valueDisplay: 'Any pair'
        }
      },
      {
        id: 'b3x-twitter',
        title: 'Follow B3X on X',
        type: 'SOCIAL',
        platform: 'twitter',
        link: 'https://x.com/b3xai',
        description: 'Follow @b3xai for AI trading updates.',
        status: 'incomplete',
        reward: 'AI Enthusiast Badge',
        verificationCriteria: {
          type: 'api_call',
          platformApi: 'twitter',
          action: 'follow',
          targetId: 'b3xai',
          simulationDelayMs: 2000
        }
      }
    ],
    dailyTasks: [ // DAILY TASKS UNTUK B3X
      {
        id: 'b3x-daily-long',
        title: 'Daily Long Position',
        action: 'long_trade',
        link: 'https://testnet.b3x.ai/#/trade',
        dailyLimit: 3, // Limit ini berlaku gabungan untuk long dan short
        totalForBadge: 15,
        simulationDelayMs: 3000,
        platform: 'onchain',
        reward: 'B3X Daily Long Trader Badge'
      },
      {
        id: 'b3x-daily-short',
        title: 'Daily Short Position',
        action: 'short_trade',
        link: 'https://testnet.b3x.ai/#/trade',
        dailyLimit: 3, // Limit ini berlaku gabungan untuk long dan short
        totalForBadge: 15,
        simulationDelayMs: 3000,
        platform: 'onchain',
        reward: 'B3X Daily Short Trader Badge'
      }
    ]
  }
];