'use client';

import { CopyButton } from '@lobehub/ui';

import { formatDateToUTC } from '@/utils/formatter';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function LogisticsPending({
    parcel,
    router,
}: {
    parcel: Parcel;
    router: AppRouterInstance;
}) {
    return (
        <section className='col-span-1 w-[350px] h-fit p-6 pt-4 pb-4 flex flex-col gap-y-5 justify-between border border-quatriary rounded-xl shadow-md'>
            <section className='flex flex-col gap-y-2'>
                <h3 className='text-2xl font-semibold'>Parcel #{parcel.id}</h3>
                <h5 className='text-xs font-medium text-secondary'>
                    Created on {formatDateToUTC(parcel.timestamp)}
                </h5>
            </section>
            <section className='flex flex-col gap-y-2'>
                <h5 className='text-xs'>Recipient Info</h5>
                <div className='p-2 pl-3 pr-3 w-full flex items-center justify-between border border-quatriary rounded-xl'>
                    <h5 className='text-xs text-secondary'>
                        {parcel.recipient.name} (+{parcel.recipient.phone}) <br />
                        <br />
                        {parcel.recipient.address}
                    </h5>
                    <CopyButton
                        content={`${parcel.recipient.name} (+${parcel.recipient.phone}) ${parcel.recipient.address}`}
                    />
                </div>
            </section>
            <section className='flex flex-col gap-y-2'>
                <h5 className='text-xs'>Parcel Signing</h5>
                <button
                    className='black-button !text-xs !font-normal'
                    onClick={() => router.push(`/sign?parcel_id=${parcel.id}&side=sender`)}
                >
                    Sign Now
                </button>
            </section>
        </section>
    );
}
