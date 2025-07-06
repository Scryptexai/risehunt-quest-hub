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
        displayName: 'DEX Swap',
        maxPerDay: 5,
        totalRequired: 20,
        icon: '⚡',
        description: 'Complete token swaps on NitroDex'
      }
    ]
  },
  {
    projectId: 'inarfi',
    taskTypes: [
      {
        type: 'borrow_pay_deposit',
        displayName: 'DeFi Action',
        maxPerDay: 3,
        totalRequired: 10,
        icon: '💰',
        description: 'Borrow, pay, or deposit on Inarfi'
      }
    ]
  },
  {
    projectId: 'b3x',
    taskTypes: [
      {
        type: 'long_short',
        displayName: 'Trading Action',
        maxPerDay: 3,
        totalRequired: 15,
        icon: '📈',
        description: 'Execute long or short positions'
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
        description: 'Deploy smart contracts'
      }
    ]
  },
  {
    projectId: 'kingdom',
    taskTypes: [
      {
        type: 'daily_checkin',
        displayName: 'Daily Check-in',
        maxPerDay: 1,
        totalRequired: 4,
        icon: '🏰',
        description: 'Daily kingdom check-in'
      }
    ]
  },
  {
    projectId: 'standard',
    taskTypes: [
      {
        type: 'trade',
        displayName: 'Trade',
        maxPerDay: 5,
        totalRequired: 20,
        icon: '📊',
        description: 'Execute trades on Standard'
      }
    ]
  }
];

export const getDailyTaskConfig = (projectId: string): DailyTaskConfig | undefined => {
  return dailyTaskConfigs.find(config => config.projectId === projectId);
};