import { createHash } from 'crypto';

export const convertStatusToDisplay = (status: Status): string => {
    return status == 'pending'
        ? 'Pending Signature and Verification'
        : status.charAt(0).toUpperCase() + status.slice(1);
};

export const generateParcelId = (address: string): string => {
    const hash = createHash('sha256')
        .update(address + Date.now())
        .digest('hex');
    return hash.slice(2, 8);
};

export const generateAddParcelLink = (parcelId: string): string => {
    return `${process.env.NEXT_PUBLIC_APP_LINK}/?parcel_id=${parcelId}`;
};

export const generateDelegateLink = (parcelId: string): string => {
    return `${process.env.NEXT_PUBLIC_APP_LINK}/delegation?parcel_id=${parcelId}`;
};

export const generateSignLink = (parcelId: string, side: Side): string => {
    return `${process.env.NEXT_PUBLIC_APP_LINK}/sign?parcel_id=${parcelId}&side=${side}`;
};
