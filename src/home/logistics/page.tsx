'use client';

import Image from 'next/image';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogisticsPending from '@/components/parcel/LogisticsPending';
import LogisticsDelivered from '@/components/parcel/LogisticsDelivered';

import { useState } from 'react';
import useParcels from '@/hooks/useParcels';
import { useRouter } from 'next/navigation';

export default function Logistics() {
    const router = useRouter();
    const { sent, isLoaded } = useParcels();

    const [side, setSide] = useState<'pending' | 'delivered'>('pending');

    return (
        <main className='flex flex-col items-center gap-y-11'>
            <Tabs defaultValue='pending' className='w-full flex justify-center'>
                <TabsList className='grid w-1/3 grid-cols-2'>
                    <TabsTrigger
                        value='pending'
                        className='rounded-md transition-colors data-[state=active]:bg-background data-[state=active]:text-text data-[state=active]:shadow'
                        onClick={() => setSide('pending')}
                    >
                        Pending
                    </TabsTrigger>
                    <TabsTrigger
                        value='deivered'
                        className='rounded-md transition-colors data-[state=active]:bg-background data-[state=active]:text-text data-[state=active]:shadow'
                        onClick={() => setSide('delivered')}
                    >
                        Delivered
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <section className='w-[1075px] flex flex-wrap gap-3'>
                {!isLoaded && (
                    <div className='spinner fixed top-2/4 left-2/4 -translate-x-2/4'></div>
                )}
                {(isLoaded &&
                    side == 'pending' &&
                    !sent.filter((parcel) => parcel.status == 'delivering').length) ||
                (isLoaded &&
                    side == 'delivered' &&
                    !sent.filter((parcel) => parcel.status == 'delivered').length) ? (
                    <div className='fixed top-2/4 left-2/4 -translate-x-2/4 flex flex-col items-center justify-center gap-y-6'>
                        <Image src={'/images/empty-box.svg'} alt='empty' width={225} height={225} />
                        <h4 className='text-secondary'>Opps.. Nothing in the box</h4>
                    </div>
                ) : (
                    <></>
                )}
                {side == 'pending'
                    ? sent
                          .filter((parcel) => parcel.status == 'delivering')
                          .map((parcel) => <LogisticsPending parcel={parcel} router={router} />)
                    : sent
                          .filter((parcel) => parcel.status == 'delivered')
                          .map((parcel) => <LogisticsDelivered parcel={parcel} />)}
            </section>
        </main>
    );
}
