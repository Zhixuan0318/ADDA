'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import LoadingButton from '@/components/ui/loading-button';

import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

import { createFormUrl } from '@/services/docusign';
import { getCookie } from 'cookies-next';
import { generateParcelId } from '@/utils/parcel';

export default function CreateDelivery() {
    const router = useRouter();

    const { address } = useAccount();

    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const accessTokenCookie = getCookie('accessToken');
        if (!accessTokenCookie) router.push('/home/user');
        setAccessToken(accessTokenCookie as string);
    }, []);

    const handleFormCreation = useCallback(async () => {
        if (!accessToken || !address) return;
        try {
            const form = await createFormUrl(
                address,
                accessToken as string,
                process.env.PARCEL_DELIVERY_FORM_ID as string,
                `${process.env.NEXT_PUBLIC_APP_LINK}/create-delivery/success`,
                {
                    Width_in_metres: Number((Math.random() + 1).toFixed(2)),
                    Height_in_metres: Number((Math.random() + 1).toFixed(2)),
                    Length_in_metres: Number((Math.random() + 1).toFixed(2)),
                    Weight: Number((Math.random() + 1).toFixed(2)),
                    Declared_Value_in_USD: Number((Math.random() + 1 * 150).toFixed(2)),
                    Parcel_ID: generateParcelId(address),
                }
            );
            if (form.includes('undefined')) throw new Error('Auth code has expired');

            router.push(form);
        } catch (error) {
            router.push('/home/user');
        }
    }, [address, accessToken]);

    return (
        <>
            <nav className='pl-12 pr-12 pt-9 pb-9 flex justify-between items-center'>
                <button
                    className='flex items-center gap-x-3'
                    onClick={() => router.push('/home/user')}
                >
                    <Image src={'/icons/interface/back.svg'} alt='back' width={25} height={25} />
                    <h4>Back to Home</h4>
                </button>
                <Image src={'/icons/box.svg'} alt='box' width={55} height={55} />
            </nav>
            <main className='pr-48 pl-48 mt-16 flex flex-col gap-y-11'>
                <h1 className='text-5xl'>Create a new Parcel Delivery</h1>
                <LoadingButton text='Continue' onClick={handleFormCreation} />
                <section>
                    <h4 className='mb-5 text-base text-tetriary'>You will need to fill:</h4>
                    <div className='w-fit flex gap-x-4'>
                        <DataToFill text='General Info' img='/icons/interface/info.svg' />
                        <DataToFill text='Parcel Details' img='/icons/interface/package.svg' />
                        <DataToFill
                            text='Delivery Preferences'
                            img='/icons/interface/delivery.svg'
                        />
                        <DataToFill text='Payment Info' img='/icons/interface/coin.svg' />
                    </div>
                </section>
                <section className='flex gap-x-5'>
                    <Alert className='w-3/4'>
                        <Terminal className='h-4 w-4' />
                        <AlertDescription>
                            We will collect all the related info from you via Docusign Web Form and
                            generate a parcel delivery agreement for you to sign directly in this
                            app with Docusign eSignature.
                        </AlertDescription>
                    </Alert>
                    <div className='flex flex-col justify-center gap-y-1'>
                        <h5>powered by</h5>
                        <Image
                            className='h-auto'
                            src={'/icons/partners/docusign.svg'}
                            alt='docusign'
                            width={150}
                            height={50}
                        />
                    </div>
                </section>
            </main>
        </>
    );
}

function DataToFill({ img, text }: { img: string; text: string }) {
    return (
        <div className='h-52 w-52 flex flex-col items-center justify-center border-solid border-tetriary border rounded-md'>
            <Image className='w-auto' src={img} alt='data' width={60} height={60} />
            <h4>{text}</h4>
        </div>
    );
}
