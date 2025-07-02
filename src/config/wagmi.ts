import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

// Define Risechain as a custom chain
export const risechain = {
  id: 1559,
  name: 'Risechain',
  nativeCurrency: {
    decimals: 18,
    name: 'Rise',
    symbol: 'RISE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.risechain.net'],
    },
  },
  blockExplorers: {
    default: { name: 'RiseScan', url: 'https://scan.risechain.net' },
  },
} as const;

export const config = getDefaultConfig({
  appName: 'RiseHunt',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains: [risechain, mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // If your dApp uses server side rendering (SSR)
});