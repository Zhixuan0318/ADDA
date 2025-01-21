'use client';

import Image from 'next/image';
import { Suspense } from 'react';
import Recipient from '@/components/sign/Recipient';
import Sender from '@/components/sign/Sender';
import NotDelivered from '@/components/sign/NotDelivered';
import { IDKitWidget, useIDKit, VerificationLevel } from '@worldcoin/idkit';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Firebase from '@/services/firebase';
import { verify } from '@/services/worldcoin';

import { hasCookie, setCookie } from 'cookies-next';

export default function Suspended() {
    return (
        <Suspense>
            <Sign />
        </Suspense>
    );
}

function Sign() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const side = searchParams.get('side') as Side | null;
    const parcelId = searchParams.get('parcel_id');

    const { open, setOpen } = useIDKit();

    const firebase = useRef(new Firebase(true));
    const [parcel, setParcel] = useState<Parcel>();

    if (!side || !parcelId) {
        router.push('/home/user');
        return <></>;
    }

    useEffect(() => {
        if (!hasCookie('accessToken')) router.push('/');
    }, []);

    const [isSet, setIsSet] = useState(false);
    useEffect(() => {
        setCookie('parcelId', parcelId, { expires: new Date(Date.now() + 15 * 60_000) });
        setCookie('side', side, { expires: new Date(Date.now() + 15 * 60_000) });
        setIsSet(true);
    }, [side, parcelId]);

    const [update, setUpdate] = useState(false);
    useEffect(() => {
        if (parcelId)
            firebase.current.loadParcel(parcelId).then((data) => {
                setParcel(data);
                setTimeout(() => setUpdate(!update), 3000);
            });
    }, [parcel?.sender.nullifierHash, parcelId, update]);

    useEffect(() => {
        if (parcel && parcel.recipient.isSigned && isSet) router.push(`/sign/success`);
    }, [parcel, isSet]);

    return (
        <>
            <nav className='pl-12 pr-12 pt-9 pb-9'>
                <button
                    className='flex items-center gap-x-3'
                    onClick={() => router.push('/home/user')}
                >
                    <Image src={'/icons/interface/back.svg'} alt='back' width={25} height={25} />
                    <h4>Back to Home</h4>
                </button>
            </nav>
            {open && (
                <IDKitWidget
                    app_id={process.env.NEXT_PUBLIC_APP_ID as `app_${string}`}
                    action={'verify'}
                    onSuccess={async (result) => {
                        const copy = { ...parcel } as Parcel;

                        if (side == 'sender') {
                            await firebase.current.updateParcelField(
                                `${parcel?.id}/${side}/nullifierHash`,
                                result.nullifier_hash
                            );
                            copy[side].nullifierHash = result.nullifier_hash;
                        } else {
                            await firebase.current.updateParcelField(
                                `${parcel?.id}/${side}/isSigned`,
                                true
                            );
                            copy[side].isSigned = true;
                        }

                        await firebase.current.updateParcel(copy);
                        setParcel(copy);
                    }}
                    handleVerify={async (result) => {
                        if (!parcel) throw new Error('Parcel was not loaded yet');
                        await verify(result, 'verify');
                        if (
                            side == 'sender' &&
                            parcel.sender.nullifierHash &&
                            result.nullifier_hash != parcel.sender.nullifierHash
                        )
                            throw new Error(
                                'Wrong nullifier hash. Delivery was signed by a different Sender'
                            );
                        if (
                            side == 'recipient' &&
                            parcel.recipient.nullifierHash != result.nullifier_hash
                        )
                            throw new Error(
                                'Wrong nullifier hash. Delivery was signed by a different Recipient'
                            );
                    }}
                    verification_level={VerificationLevel.Device}
                />
            )}
            {side == 'sender' && parcel && <Sender setOpen={setOpen} parcel={parcel} />}
            {side == 'recipient' && parcel?.sender.nullifierHash && (
                <Recipient setOpen={setOpen} parcel={parcel} />
            )}
            {side == 'recipient' && parcel && !parcel?.sender.nullifierHash && (
                <NotDelivered parcelId={parcelId} />
            )}
        </>
    );
}
