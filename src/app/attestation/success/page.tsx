'use client';

import Image from 'next/image';
import { CopyButton } from '@lobehub/ui';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import useParcels from '@/hooks/useParcels';
import useParcelCookies from '@/hooks/useParcelCookies';

import Firebase from '@/services/firebase';
import Link from 'next/link';

export default function AttestationSuccess() {
    const router = useRouter();

    const { refetchParcel } = useParcels();
    const firebase = useRef(new Firebase(true));
    const { parcel, setParcel, side } = useParcelCookies(router, firebase.current);

    useEffect(() => {
        if (!parcel || !side) return;

        if (!parcel.attestation) router.push('/');

        if (parcel.attestation && parcel.status != 'delivered') {
            const copy = { ...parcel };
            copy.status = 'delivered';
            firebase.current.updateParcel(copy).then(() => {
                setParcel(copy);
                refetchParcel(side == 'recipient' ? 'received' : 'sent', copy);
            });
        }
    }, [parcel, side]);

    return (
        <main className='h-dvh flex flex-col gap-y-12 items-center justify-center'>
            <h2 className='text-4xl'>Attestation submitted on-chain successfully!</h2>
            <Image src={'/icons/interface/success.svg'} alt='success' width={100} height={100} />
            <div>
                <h4 className='text-secondary text-center mb-3'>Schema of this attestation</h4>
                <div className='flex items-center gap-x-3'>
                    <h4 className='w-full pt-4 pb-4 pl-6 pr-6 text-center border border-tetriary rounded-md'>
                        {process.env.NEXT_PUBLIC_SCHEMA_ID}
                    </h4>
                    <CopyButton content={process.env.NEXT_PUBLIC_SCHEMA_ID as string} />
                    <Link
                        href={`https://testnet-scan.sign.global/schema/${process.env.NEXT_PUBLIC_SCHEMA_ID}`}
                        target='_blank'
                    >
                        <Image
                            src={'/icons/interface/web.svg'}
                            alt='web'
                            width={18}
                            height={18}
                            className='cursor-pointer'
                        />
                    </Link>
                </div>
                <h4 className='text-secondary text-center mt-6 mb-3'>
                    Attestation record on opBNB
                </h4>
                <div className='flex items-center gap-x-3'>
                    <h4 className='w-full pt-4 pb-4 pl-6 pr-6 flex justify-center text-center border border-tetriary rounded-md'>
                        {parcel?.attestation ? (
                            parcel?.attestation
                        ) : (
                            <div className='spinner'></div>
                        )}
                    </h4>
                    <CopyButton content={parcel?.attestation ?? ''} />
                    <Link
                        href={`https://testnet-scan.sign.global/attestation/onchain_evm_5611_${parcel?.attestation}`}
                        target='_blank'
                    >
                        <Image
                            src={'/icons/interface/web.svg'}
                            alt='web'
                            width={18}
                            height={18}
                            className='cursor-pointer'
                        />
                    </Link>
                </div>
            </div>
            <button
                className='black-button'
                onClick={() => router.push(side == 'recipient' ? '/home/user' : '/home/logistics')}
            >
                Back to Home
            </button>
        </main>
    );
}
