'use client';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';

import { WagmiProvider } from 'wagmi';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { config } from '@/config/wagmi';

const queryClient = new QueryClient();

export default function WalletProvider({ children }: { children: React.ReactNode }) {
    return (
        /* @ts-ignore */
        <DynamicContextProvider
            settings={{
                environmentId: process.env.ENVIRONMENTAL_ID as string,
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
                </QueryClientProvider>
            </WagmiProvider>
        </DynamicContextProvider>
    );
}
