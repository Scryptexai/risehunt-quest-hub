export interface DailyTaskConfig {
  projectId: string;
  taskTypes: {
    type: 'dex_swap' | 'daily_checkin' | 'borrow_pay_deposit' | 'long_short' | 'deploy' | 'trade';
    displayName: string;
    maxPerDay: number;
    totalRequired: number;
    icon: string;
    description: string;
  }[];
}

export const dailyTaskConfigs: DailyTaskConfig[] = [
  {
    projectId: 'nitrodex',
    taskTypes: [
      {
        type: 'dex_swap',
        displayName: 'Swap Tokens',
        maxPerDay: 5,
        totalRequired: 20,
        icon: '⚡',
        description: 'Complete token swaps on NitroDex (Min $10 USDC)'
      }
    ]
  },
  {
    projectId: 'inarfi',
    taskTypes: [
      {
        type: 'borrow_pay_deposit',
        displayName: 'DeFi Actions',
        maxPerDay: 3,
        totalRequired: 10,
        icon: '💰',
        description: 'Borrow, repay, or deposit on Inarfi (Min $50 USDC)'
      }
    ]
  },
  {
    projectId: 'b3x',
    taskTypes: [
      {
        type: 'long_short',
        displayName: 'Trading Positions',
        maxPerDay: 3,
        totalRequired: 15,
        icon: '📈',
        description: 'Execute long or short positions (Min $25 USDC)'
      }
    ]
  },
  {
    projectId: 'onchaingm',
    taskTypes: [
      {
        type: 'deploy',
        displayName: 'Deploy Contract',
        maxPerDay: 1,
        totalRequired: 4,
        icon: '🚀',
        description: 'Deploy smart contracts on OnchainGM'
      }
    ]
  },
  {
    projectId: 'kingdom',
    taskTypes: [
      {
        type: 'daily_checkin',
        displayName: 'Game Check-in',
        maxPerDay: 1,
        totalRequired: 4,
        icon: '🏰',
        description: 'Daily check-in to For The Kingdom game'
      }
    ]
  },
  {
    projectId: 'standard',
    taskTypes: [
      {
        type: 'trade',
        displayName: 'Execute Trades',
        maxPerDay: 5,
        totalRequired: 20,
        icon: '📊',
        description: 'Execute trades on Standard Protocol (Min $15 USDC)'
      }
    ]
  }
];

export const getDailyTaskConfig = (projectId: string): DailyTaskConfig | undefined => {
  return dailyTaskConfigs.find(config => config.projectId === projectId);
};