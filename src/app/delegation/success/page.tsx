'use client';

import Image from 'next/image';
import CopyLink from '@/components/ui/copy-link';
import WorldcoinHash from '@/components/ui/worldcoin-hash';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Suspended() {
    return (
        <Suspense>
            <DelegationSuccess />
        </Suspense>
    );
}

function DelegationSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const link = searchParams.get('link');
    const hash = searchParams.get('hash');

    if (!link || !hash) {
        router.push('/');
        return;
    }

    return (
        <main className='h-dvh flex justify-center'>
            <section className='w-3/5 flex flex-col justify-center gap-y-5'>
                <div className='flex gap-x-4 mb-8'>
                    <Image
                        src={'/icons/interface/success.svg'}
                        alt='success'
                        width={75}
                        height={75}
                    />
                    <Image
                        src={'/icons/partners/worldcoin.svg'}
                        alt='worldcoin'
                        width={75}
                        height={75}
                    />
                </div>
                <h3 className='text-3xl'>Delegation Completed!</h3>
                <WorldcoinHash hash={hash} />
                <h4 className='font-medium'>Here is the link to your parcel signing page.</h4>
                <CopyLink
                    content={`${link}&side=recipient`}
                    toastMessage='URL link for parcel signing has been copied '
                />
            </section>
        </main>
    );
}
