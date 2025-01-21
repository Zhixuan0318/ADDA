'use client';

import Image from 'next/image';
import { Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

export default function Suspended() {
    return (
        <Suspense>
            <NotSigned />
        </Suspense>
    );
}

function NotSigned() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <main>
            <section className='w-dvw h-dvh p-28 flex flex-col justify-center gap-y-12'>
                <section className='flex items-center gap-x-6 font-medium text-nowrap'>
                    <h1 className='text-5xl'>Hey, check your email </h1>
                    <div className='pt-2 pb-2 pl-6 pr-6 flex justify-center text-center border border-tetriary rounded-md'>
                        {email}
                    </div>
                </section>
                <p className='flex gap-x-4 flex-wrap text-3xl font-light'>
                    You have a pre-delivery agreement to sign with
                    <Image
                        src={'/icons/partners/docusign.svg'}
                        alt='docusign'
                        width={200}
                        height={100}
                        className='h-9 w-auto'
                    />
                    before you can sign this delivery.
                </p>
                <Image
                    src={'/images/check-email.svg'}
                    alt='check-email'
                    height={1080}
                    width={1920}
                    className='w-full h-fit'
                />
            </section>
        </main>
    );
}
