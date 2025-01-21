'use client';

import Image from 'next/image';
import WorldcoinHash from '@/components/ui/worldcoin-hash';
import LoadingButton from '@/components/ui/loading-button';

import { useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useParcelCookies from '@/hooks/useParcelCookies';

import Firebase from '@/services/firebase';
import { createClickWrap } from '@/services/docusign';

import { getCookie } from 'cookies-next';

export default function SignSuccess() {
    const router = useRouter();

    const firebase = useRef(new Firebase(true));
    const { parcel, side } = useParcelCookies(router, firebase.current);

    const handleClickWrap = useCallback(async () => {
        if (!side || !parcel) return;
        const hash =
            side == 'recipient'
                ? (parcel.recipient.nullifierHash as string)
                : (parcel.sender.nullifierHash as string);

        const url = await createClickWrap(getCookie('accessToken') as string, hash);
        router.push(url);
    }, [side, parcel]);

    return (
        <main className='flex items-center justify-center'>
            <section className='h-dvh flex flex-col items-center justify-center gap-y-16'>
                <h1 className='text-4xl'>Recipient and 3PL Verified Successfully</h1>
                <div className='flex gap-x-32'>
                    {useMemo(
                        () => (
                            <Signer img='/images/sender.svg' hash={parcel?.sender.nullifierHash} />
                        ),
                        [parcel]
                    )}
                    <Signer img='/images/recipient.svg' hash={parcel?.recipient.nullifierHash} />
                </div>
                <LoadingButton text='Proceed to consent form' onClick={handleClickWrap} />
            </section>
        </main>
    );
}

function Signer({ img, hash }: { img: string; hash: string | undefined }) {
    return (
        <section className='flex flex-col items-center gap-y-2'>
            <Image src={img} alt='side' width={136} height={136} className='mb-8' />
            <div className='flex justify-center gap-x-1'>
                <Image src={'/icons/interface/success.svg'} alt='success' width={18} height={18} />
                <Image
                    src={'/icons/partners/worldcoin.svg'}
                    alt='worldcoin'
                    width={18}
                    height={18}
                />
            </div>
            <h4>World ID Verified</h4>
            {hash && <WorldcoinHash hash={hash} className='p-2' />}
        </section>
    );
}
