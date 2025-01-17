import { createConfig } from 'wagmi';
import { http } from 'viem';
import { opBNBTestnet } from 'viem/chains';

export const config = createConfig({
    chains: [opBNBTestnet],
    multiInjectedProviderDiscovery: false,
    transports: {
        [opBNBTestnet.id]: http(),
    },
});
