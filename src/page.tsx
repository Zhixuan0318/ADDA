'use client';

import Image from 'next/image';
import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core';

import dynamic from 'next/dynamic';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo } from 'react';
import { useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

import { globeConfig, arcs } from '@/config/globe';

const World = dynamic(() => import('@/components/ui/globe').then((m) => m.World), {
    loading: () => <></>,
    ssr: false,
});

export default function Suspended() {
    return (
        <Suspense>
            <Connect />
        </Suspense>
    );
}

function Connect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isLoggedIn = useIsLoggedIn();

    const parcelId = searchParams.get('parcel_id');

    const globe = useMemo(
        () => (
            <div className='w-[60rem] h-[60rem] absolute right-0 -bottom-2/4'>
                <World data={arcs} globeConfig={globeConfig} />
            </div>
        ),
        []
    );

    useEffect(() => {
        if (isLoggedIn) router.push(parcelId ? `/home/user?parcel_id=${parcelId}` : '/home/user');
    }, [isLoggedIn, parcelId]);

    return (
        <main className='relative h-dvh pl-24 pr-24 pt-32 pb-32 flex flex-col gap-y-10 overflow-hidden'>
            <div className='flex items-center'>
                <Image src={'/icons/partners/protocol.svg'} alt='protocol' width={70} height={70} />
                <h2 className='text-4xl font-semibold'>ADDA Protocol</h2>
            </div>
            <h1 className='font-light text-6xl'>
                Reimagined Last Mile Logistic Solution with Docusign IAM and Blockchain.
            </h1>
            <div className='flex items-center gap-x-2'>
                <h4 className='text-base'>powered by</h4>
                <Image
                    src={'/icons/partners/docusign.svg'}
                    alt='docusign'
                    className='h-7 w-auto'
                    width={139}
                    height={31}
                />
            </div>
            <DynamicConnectButton buttonClassName='mt-10'>
                <div className='black-button '>
                    <Image
                        src={'/icons/partners/dynamic.svg'}
                        alt='dynamic'
                        width={32}
                        height={32}
                    />
                    <h3 className='text-xl'>Connect with Dynamic</h3>
                </div>
            </DynamicConnectButton>
            {globe}
        </main>
    );
}
