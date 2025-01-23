'use client';

import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

import { useRouter } from 'next/navigation';
import useParcelCookies from '@/hooks/useParcelCookies';
import { useCallback, useEffect, useRef } from 'react';

import Firebase from '@/services/firebase';
import { signAttestation } from '@/services/sign-attestation';
import { getEnvelopeFile } from '@/services/docusign';

import { getCookie } from 'cookies-next';
import { uploadFile } from '@/services/pinata';

export default function Attestation() {
    const router = useRouter();
    const firebase = useRef(new Firebase(true));
    const { parcel } = useParcelCookies(router, firebase.current);

    const uploadFilesAndSign = useCallback(async () => {
        if (!parcel) return;
        if (parcel.attestation) {
            router.push('/attestation/success');
            return;
        }

        const accessToken = getCookie('accessToken') as string;

        parcel.envelopes.preDelivery = await uploadFile(
            new File(
                [await getEnvelopeFile(accessToken, parcel.envelopes.parcelDelivery)],
                'ParcelDelivery.pdf'
            )
        );
        parcel.envelopes.parcelDelivery = await uploadFile(
            new File(
                [await getEnvelopeFile(accessToken, parcel.envelopes.preDelivery as string)],
                'ParcelDelivery.pdf'
            )
        );
        parcel.sender.deliveryCompletion = await uploadFile(
            new File(
                [await getEnvelopeFile(accessToken, parcel.sender.deliveryCompletion as string)],
                'ParcelDelivery.pdf'
            )
        );
        parcel.recipient.deliveryCompletion = await uploadFile(
            new File(
                [await getEnvelopeFile(accessToken, parcel.recipient.deliveryCompletion as string)],
                'ParcelDelivery.pdf'
            )
        );

        const attestationId = await signAttestation(parcel);
        await firebase.current.updateParcelField(`${parcel.id}/attestation`, attestationId);

        router.push('/attestation/success');
    }, [parcel]);

    useEffect(() => {
        uploadFilesAndSign();
    }, [parcel]);

    return (
        <main className='flex items-center justify-center'>
            <section className='h-dvh flex flex-col items-center justify-center gap-y-11'>
                <h1 className='text-4xl text-center'>
                    An attestation is currently being <br /> submitted to the opBNB blockchain
                </h1>
                <div className='flex flex-col items-center gap-y-5'>
                    <h5 className='text-sm'>powered by</h5>
                    <div className='flex items-center gap-x-3'>
                        <Image
                            src={'/icons/partners/sign.svg'}
                            alt='docusign'
                            width={73}
                            height={43}
                        />
                        <Image
                            src={'/icons/partners/bnb.svg'}
                            alt='docusign'
                            width={43}
                            height={43}
                        />
                    </div>
                </div>
                <div className='spinner mb-5 bt-5 !w-14 !h-14 border-4'></div>
                <Alert>
                    <Terminal />
                    <AlertDescription>
                        Please be patient as the process is still ongoing at the back. Do not close
                        the window in the middle of <br /> the process to ensure everything will be
                        going smoothly.
                    </AlertDescription>
                </Alert>
            </section>
        </main>
    );
}
