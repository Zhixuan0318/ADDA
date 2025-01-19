'use client';

import Image from 'next/image';
import UserSent from '@/components/parcel/UserSent';
import UserReceived from '@/components/parcel/UserReceived';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useParcels from '@/hooks/useParcels';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { useIDKit } from '@worldcoin/idkit';

import Firebase from '@/services/firebase';
import { hasCookie, setCookie } from 'cookies-next';

import { verify } from '@/services/worldcoin';
import { getAccessToken, getAuthLink } from '@/services/docusign';

export default function Suspended() {
    return (
        <Suspense>
            <User />
        </Suspense>
    );
}

function User() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const parcelId = searchParams.get('parcel_id');
    const code = searchParams.get('code');

    const { toast } = useToast();
    const { open, setOpen } = useIDKit();
    const { address } = useAccount();
    const { sent, received, isLoaded, refetch, refetchParcel } = useParcels();

    const [parcelToVerify, setParcelToVerify] = useState<Parcel>();
    const [side, setSide] = useState<'sent' | 'received'>('sent');

    const [isFinished, setIsFinished] = useState(false);
    useEffect(() => {
        if (!isLoaded || !address) return;

        if (
            !parcelId ||
            (isLoaded && address && received.find((parcel) => parcel.id == parcelId)) ||
            (isLoaded && address && sent.find((parcel) => parcel.id == parcelId))
        ) {
            setIsFinished(true);
            return;
        }

        const firebase = new Firebase(true);
        firebase.loadParcel(parcelId).then(async (parcelToLoad) => {
            if (!parcelToLoad.recipient.wallet) {
                parcelToLoad.recipient.wallet = address;
                await firebase.updateParcel(parcelToLoad);
                await firebase.addParcelId(address, parcelToLoad.id, 'received');
                refetch('received');
            }
            setIsFinished(true);
        });
    }, [isLoaded, sent, received, address, parcelId]);

    useEffect(() => {
        if (code) {
            getAccessToken(code).then((accessToken) =>
                setCookie('accessToken', accessToken, {
                    expires: new Date(Date.now() + 5 * 60 * 60 * 1000),
                })
            );
        } else if (isFinished && !hasCookie('accessToken')) {
            router.push(getAuthLink(`${process.env.NEXT_PUBLIC_APP_LINK}/home/user`));
        }
    }, [isFinished, code]);

    useEffect;

    return (
        <main className='flex flex-col items-center gap-y-11'>
            {open && (
                <IDKitWidget
                    app_id={process.env.NEXT_PUBLIC_APP_ID as any}
                    action={'verify'}
                    onSuccess={async (result) => {
                        const updatedParcel = {
                            ...parcelToVerify,
                            recipient: {
                                ...parcelToVerify?.recipient,
                                nullifierHash: result.nullifier_hash,
                            },
                            status: 'delivering',
                        } as Parcel;

                        const firebase = new Firebase(true);
                        await firebase.updateParcel(updatedParcel);

                        refetchParcel('received', updatedParcel as Parcel);
                    }}
                    handleVerify={async (result) => {
                        await verify(result, 'verify');
                        if (!parcelToVerify || !address)
                            throw new Error('Issue appeared on client side');
                    }}
                    verification_level={VerificationLevel.Device}
                />
            )}
            <Tabs defaultValue='sent' className='w-full flex justify-center'>
                <TabsList className='grid w-1/3 grid-cols-2'>
                    <TabsTrigger
                        value='sent'
                        className='rounded-md transition-colors data-[state=active]:bg-background data-[state=active]:text-text data-[state=active]:shadow'
                        onClick={() => setSide('sent')}
                    >
                        Sent
                    </TabsTrigger>
                    <TabsTrigger
                        value='received'
                        className='rounded-md transition-colors data-[state=active]:bg-background data-[state=active]:text-text data-[state=active]:shadow'
                        onClick={() => setSide('received')}
                    >
                        Received
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <section className='w-[1075px] flex flex-wrap gap-3'>
                {!isLoaded && (
                    <div className='spinner fixed top-2/4 left-2/4 -translate-x-2/4'></div>
                )}
                {(isLoaded && side == 'sent' && !sent.length) ||
                (isLoaded && side == 'received' && !received.length) ? (
                    <div className='fixed top-2/4 left-2/4 -translate-x-2/4 flex flex-col items-center justify-center gap-y-6'>
                        <Image src={'/images/empty-box.svg'} alt='empty' width={225} height={225} />
                        <h4 className='text-secondary'>Opps.. Nothing in the box</h4>
                    </div>
                ) : (
                    <></>
                )}
                {side == 'sent'
                    ? sent.map((parcel) => (
                          <UserSent toast={toast} key={parcel.id} parcel={parcel} />
                      ))
                    : received.map((parcel) => (
                          <UserReceived
                              key={parcel.id}
                              parcel={parcel}
                              router={router}
                              toast={toast}
                              setOpen={setOpen}
                              onClick={() => setParcelToVerify(parcel)}
                          />
                      ))}
            </section>
        </main>
    );
}
