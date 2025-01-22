'use client';

import Image from 'next/image';
import { FileUpload } from '@/components/ui/file-upload';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

import Firebase from '@/services/firebase';
import { getCookie } from 'cookies-next';

import { uploadFile } from '@/services/pinata';
import { createFormUrl } from '@/services/docusign';
import useParcelCookies from '@/hooks/useParcelCookies';

export default function PhotoEvidence() {
    const router = useRouter();
    const { address } = useAccount();

    const firebase = useRef(new Firebase(true));
    const { parcel, setParcel, side } = useParcelCookies(router, firebase.current);

    const [file, setFile] = useState<File>();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = useCallback(async () => {
        try {
            if (!file || !side || !parcel || parcel[side].evidence != undefined) return;

            setIsUploading(true);
            const cid = await uploadFile(file);

            await firebase.current.updateParcelField(`${parcel.id}/${side}/evidence`, cid);

            const copy = { ...parcel };
            copy[side].evidence = cid;
            setParcel(copy);
        } catch (error: any) {
            setIsUploading(false);
            alert(error.message);
        }
    }, [file, side, parcel]);

    useEffect(() => {
        if (parcel && side && parcel[side].evidence && address) {
            const formId =
                side == 'recipient'
                    ? process.env.DELIVERY_ACKNOWLEDGEMENT_ID
                    : process.env.DELIVERY_COMPLETION_ID;

            if (parcel[side].deliveryCompletion) router.push('/delivery-completion');
            else
                createFormUrl(
                    address,
                    getCookie('accessToken') as string,
                    formId as string,
                    `${process.env.NEXT_PUBLIC_APP_LINK}/delivery-completion`,
                    { Parcel_ID: parcel.id }
                ).then((url) => router.push(url));
        }
    }, [parcel, side, address]);

    return (
        <main className='h-dvh flex flex-col items-center justify-center gap-y-9'>
            <h2 className='w-1/2 text-center text-4xl'>
                Upload photographic evidence of your parcel delivery
            </h2>
            <div className='flex flex-col items-center gap-y-3'>
                <h5>powered by</h5>
                <Image src={'/icons/partners/pinata.svg'} alt='pinata' width={60} height={60} />
            </div>
            <FileUpload onChange={(files) => setFile(files[0])} />
            {parcel && !isUploading && file && (
                <button className='black-button' onClick={handleFileUpload}>
                    Submit photo evidence
                </button>
            )}
            {parcel && side && isUploading && !parcel[side].evidence && (
                <div className='flex items-center gap-x-2'>
                    <div className='spinner'></div>
                    <h3>Uploading to Pinata</h3>
                </div>
            )}

            {parcel && side && parcel[side].evidence && (
                <div className='flex items-center gap-x-2'>
                    <Image
                        src={'/icons/interface/success.svg'}
                        alt='success'
                        width={18}
                        height={18}
                    />
                    <h3>Uploaded to Pinata</h3>
                </div>
            )}
        </main>
    );
}
