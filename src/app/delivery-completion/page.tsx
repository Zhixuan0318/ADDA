'use client';

import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useParcelCookies from '@/hooks/useParcelCookies';

import Firebase from '@/services/firebase';

export default function SignSuccess() {
    const router = useRouter();

    const firebase = useRef(new Firebase(true));
    const { parcel, setParcel, side } = useParcelCookies(router, firebase.current);

    const [upd, setUpd] = useState(false);
    useEffect(() => {
        if (!parcel) return;
        firebase.current.loadParcel(parcel.id).then((data) => {
            if (data.attestation) router.push('/attestation/success');
            setParcel(data);
            setTimeout(() => setUpd(!upd), 2_500);
        });
    }, [parcel, upd]);

    return (
        <main className='flex items-center justify-center'>
            <section className='h-dvh flex flex-col items-center justify-center gap-y-11'>
                <h1 className='text-4xl text-center'>
                    Delivery Completion Agreement <br /> Signing In Progress
                </h1>
                <div className='flex flex-col items-center gap-y-2 mb-11'>
                    <h5 className='text-sm'>powered by</h5>
                    <Image
                        src={'/icons/partners/docusign.svg'}
                        alt='docusign'
                        width={139}
                        height={31}
                    />
                </div>
                <div className='flex gap-x-32'>
                    <Signer
                        img='/images/sender.svg'
                        agreement={parcel?.sender.deliveryCompletion}
                    />
                    <Signer
                        img='/images/recipient.svg'
                        agreement={parcel?.recipient.deliveryCompletion}
                    />
                </div>
                {!parcel?.sender.deliveryCompletion || !parcel?.recipient.deliveryCompletion ? (
                    <Alert>
                        <Terminal />
                        <AlertDescription>
                            Please be patient as the process is still ongoing at the back. Do not
                            close the window in the middle of <br /> the process to ensure
                            everything will be going smoothly.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <></>
                )}
                {parcel?.sender.deliveryCompletion && parcel?.recipient.deliveryCompletion ? (
                    side == 'sender' ? (
                        <button
                            className='black-button'
                            onClick={() => router.push('/attestation')}
                        >
                            Submit an attestation to the blockchain
                        </button>
                    ) : (
                        <div className='flex flex-col items-center gap-y-6'>
                            <h3 className='text-xl'>
                                Waiting for our logistic courier to submit attestation
                            </h3>
                            <div className='spinner'></div>
                        </div>
                    )
                ) : (
                    <></>
                )}
            </section>
        </main>
    );
}

function Signer({ img, agreement }: { img: string; agreement: string | undefined }) {
    return (
        <section className='flex flex-col items-center gap-y-2'>
            <Image src={img} alt='side' width={136} height={136} className='mb-8' />
            <div className='flex justify-center items-center gap-x-1'>
                {agreement ? (
                    <Image
                        src={'/icons/interface/success.svg'}
                        alt='success'
                        width={18}
                        height={18}
                    />
                ) : (
                    <div className='spinner'></div>
                )}
                {!agreement ? 'Fetching Status via Docusign Connect' : 'Signed'}
            </div>
        </section>
    );
}
