export {};

declare global {
    type Side = 'sender' | 'recipient';

    type Role = 'user' | 'logistics';

    type Status = 'pending' | 'delivering' | 'delivered';

    interface Parcel {
        id: string;
        status: Status;

        envelopes: {
            parcelDelivery: string;
            preDelivery?: string;
        };

        sender: {
            nullifierHash?: string;
            wallet: string;

            email: string;
            name: string;

            evidence?: string;
            deliveryCompletion?: string;
        };

        recipient: {
            nullifierHash?: string;
            wallet?: string;

            isDelegated: boolean;
            isSigned: boolean;

            email: string;
            name: string;
            phone: string;
            address: string;

            evidence?: string;
            deliveryCompletion?: string;
        };

        attestation?: string;

        timestamp: number;
    }
}
