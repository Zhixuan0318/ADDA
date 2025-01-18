'use client';

import { createContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import Firebase from '@/services/firebase';

export const ParcelContext = createContext<{
    sent: Parcel[];
    setSent: React.Dispatch<React.SetStateAction<Parcel[]>>;
    received: Parcel[];
    setReceived: React.Dispatch<React.SetStateAction<Parcel[]>>;
    isLoaded: boolean;
}>({
    sent: [],
    setSent: () => {},
    received: [],
    setReceived: () => {},
    isLoaded: false,
});

export function ParcelProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sent, setSent] = useState<Parcel[]>([]);
    const [received, setReceived] = useState<Parcel[]>([]);

    const [isLoaded, setIsLoaded] = useState(false);

    const { address } = useAccount();

    useEffect(() => {
        if (address && !isLoaded) {
            const firebase = new Firebase(true);
            firebase
                .loadParcels(address, 'sent')
                .then((data) => setSent(data.sort((a, b) => b.timestamp - a.timestamp)));
            firebase
                .loadParcels(address, 'received')
                .then((data) => setReceived(data.sort((a, b) => b.timestamp - a.timestamp)));
            setIsLoaded(true);
        } else {
            setIsLoaded(false);
            setSent([]);
            setReceived([]);
        }
    }, [address]);

    return (
        <ParcelContext.Provider value={{ sent, setSent, received, setReceived, isLoaded }}>
            {children}
        </ParcelContext.Provider>
    );
}
