import { ParcelContext } from '@/context/ParcelProvider';

import { useCallback, useContext, useState } from 'react';
import { useAccount } from 'wagmi';

import Firebase from '@/services/firebase';

export default function useParcels() {
    const { sent, setSent, received, setReceived, isLoaded } = useContext(ParcelContext);

    const { address } = useAccount();

    const refetch = useCallback(
        async (side: 'sent' | 'received') => {
            if (!address) return;

            const firebase = new Firebase(true);
            const data = await firebase.loadParcels(address, side);
            if (side == 'sent') setSent(data);
            else setReceived(data);
        },
        [address, sent, received]
    );

    const refetchParcel = useCallback(
        (side: 'sent' | 'received', parcel: Parcel) => {
            if (!address) return;

            let copy = side == 'sent' ? [...sent] : [...received];
            for (let i = 0; i < copy.length; i++) {
                if (copy[i].id == parcel.id) copy[i] = parcel;
                break;
            }

            copy = copy.sort((a, b) => b.timestamp - a.timestamp);

            if (side == 'sent') setSent(copy);
            else setReceived(copy);
        },
        [address, sent, received]
    );

    return { sent, received, isLoaded, refetch, refetchParcel };
}
