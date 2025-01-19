'use client';

import Image from 'next/image';
import { CopyButton } from '@lobehub/ui';
import { ToastAction } from '@/components/ui/toast';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import useParcels from '@/hooks/useParcels';

import Firebase from '@/services/firebase';
import { sendPreDeliveryAgreement } from '@/services/docusign';

import { generateAddParcelLink } from '@/utils/parcel';
import { getCookie } from 'cookies-next';

export default function SuccessCreateDelivery() {
    const router = useRouter();

    const { toast } = useToast();
    const { address } = useAccount();
    const { refetch } = useParcels();

    const firebase = useRef(new Firebase(true));
    const [parcel, setParcel] = useState<Parcel>();

    const [success, setSuccess] = useState(false);
    const sendEmailToRecipient = useCallback(async () => {
        if (!parcel || parcel.envelopes.preDelivery) {
            setSuccess(true);
            return;
        }

        const accessToken = getCookie('accessToken');
        if (!accessToken) router.push('/home/user');

        const preDelivery = await sendPreDeliveryAgreement(
            [parcel.recipient.name, parcel.recipient.email],
            accessToken as string,
            parcel.envelopes.parcelDelivery
        );

        const copy = { ...parcel };
        copy.envelopes.preDelivery = preDelivery;

        await firebase.current.updateParcel(copy);
        refetch('sent');
        setSuccess(true);
    }, [parcel]);
    useEffect(() => {
        sendEmailToRecipient();
    }, [parcel]);

    const [upd, setUpd] = useState(false);
    useEffect(() => {
        if (parcel || !address) return;
        firebase.current.loadParcels(address, 'sent').then((data) => {
            const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
            console.log(sorted);
            !sorted[0].envelopes.preDelivery
                ? setParcel(sorted[0])
                : setTimeout(() => setUpd(!upd), 3_500);
        });
    }, [upd, address, parcel]);

    return (
        <main className='h-dvh flex flex-col gap-y-12 items-center justify-center'>
            <h2 className='text-4xl'>You had created a parcel delivery!</h2>
            <Image src={'/icons/interface/success.svg'} alt='success' width={100} height={100} />
            <div>
                <h4 className='text-secondary text-center mb-3'>
                    Parcel Delivery Agreement Signer
                </h4>
                <div className='flex items-center gap-x-3'>
                    <h4 className='w-full pt-4 pb-4 pl-6 pr-6 flex justify-center text-center border border-tetriary rounded-md'>
                        {address ?? <div className='spinner'></div>}
                    </h4>
                    <CopyButton content={address ?? ''} />
                </div>
                <h4 className='text-secondary text-center mt-6 mb-3'>
                    Pre-Delivery Agreement Sent To
                </h4>
                <div className='flex items-center gap-x-3'>
                    <h4 className='w-full pt-4 pb-4 pl-6 pr-6 flex justify-center text-center border border-tetriary rounded-md'>
                        {parcel?.recipient.email ?? <div className='spinner'></div>}
                    </h4>
                    <CopyButton content={parcel?.recipient.email ?? ''} />
                </div>
            </div>
            {success && parcel && (
                <section className='flex gap-x-2'>
                    <button className='white-button' onClick={() => router.push('/home/user')}>
                        Back to Home
                    </button>
                    <button
                        className='black-button'
                        onClick={() =>
                            toast({
                                title: 'Share this one-time link to the recipient',
                                description:
                                    'This unique link will redirect the recipient to connect to this application and add this specific order to the recipient dashboard. Do keep this link a secret and only send it to the recipient as this is a one time permanent action. You can copy this link later in your dashboard.',
                                action: (
                                    <ToastAction
                                        className='black-button !text-sm'
                                        altText='Copy Link'
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                generateAddParcelLink(parcel.id)
                                            )
                                        }
                                    >
                                        Copy Link
                                    </ToastAction>
                                ),
                            })
                        }
                    >
                        Share to Recipient
                    </button>
                </section>
            )}
        </main>
    );
}
