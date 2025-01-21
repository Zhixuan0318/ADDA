'use client';

import Image from 'next/image';
import { Suspense, useEffect, useRef, useState } from 'react';
import { IDKitWidget, useIDKit, VerificationLevel } from '@worldcoin/idkit';

import { useRouter, useSearchParams } from 'next/navigation';

import Firebase from '@/services/firebase';

import { verify } from '@/services/worldcoin';
import { generateSignLink } from '@/utils/parcel';

export default function Suspended() {
    return (
        <Suspense>
            <Delegation />
        </Suspense>
    );
}

function Delegation() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const parcelId = searchParams.get('parcel_id');

    const { open, setOpen } = useIDKit();

    const firebase = useRef(new Firebase(true));
    const [parcelToDelegate, setParcelToDelegate] = useState<Parcel>();

    useEffect(() => {
        if (parcelId)
            firebase.current.loadParcel(parcelId).then((parcel) => setParcelToDelegate(parcel));
    }, [parcelId]);

    if (!parcelId) {
        router.push('/');
        return;
    }

    return (
        <>
            {open && (
                <IDKitWidget
                    app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
                    action={'verify'}
                    onSuccess={async (result) => {
                        router.push(
                            `/delegation/success?hash=${
                                result.nullifier_hash
                            }&link=${generateSignLink((parcelToDelegate as Parcel).id, 'sender')}`
                        );

                        const updatedParcel = {
                            ...parcelToDelegate,
                            recipient: {
                                ...parcelToDelegate?.recipient,
                                isDelegated: true,
                                nullifierHash: result.nullifier_hash,
                            },
                            status: 'delivering',
                        } as Parcel;

                        await firebase.current.updateParcel(updatedParcel);
                    }}
                    handleVerify={async (result) => {
                        if (!parcelToDelegate) throw new Error('Parcel was not loaded yet');
                        await verify(result, 'verify');
                        if (parcelToDelegate.recipient.nullifierHash)
                            throw new Error('This package was already verified');
                    }}
                    verification_level={VerificationLevel.Device}
                />
            )}
            <main className='h-dvh flex flex-col items-center justify-center gap-y-14'>
                <Image src={'/images/delegation.svg'} alt='delegation' width={250} height={250} />
                <h2 className='text-4xl'>Parcel #23sw45 Recipient Delegation</h2>
                <h5 className='w-4/12 text-sm text-secondary font-medium text-center'>
                    Hey, you have been delegated the rights to receive the parcel and sign it for
                    the sender when our logistic partner deliver the parcel to your doorstop!
                    <br /> <br />
                    Do verify your World ID to become the delegate recipient of this parcel. Please
                    note that you need to connect your World ID again during the parcel signing
                    process to verify your identity.
                </h5>
                <button className='black-button' onClick={() => setOpen(true)}>
                    <Image
                        src={'/icons/partners/worldcoin.svg'}
                        alt='worldcoin'
                        width={64}
                        height={64}
                        className='invert'
                    />
                    Connect with World ID
                </button>
            </main>
        </>
    );
}
