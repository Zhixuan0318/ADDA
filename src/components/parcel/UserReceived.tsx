'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import WorldcoinHash from '../ui/worldcoin-hash';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { formatDateToUTC } from '@/utils/formatter';
import { convertStatusToDisplay, generateDelegateLink, generateSignLink } from '@/utils/parcel';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { getEnvelopeFile, getEnvelopeInformation } from '@/services/docusign';
import { getCookie } from 'cookies-next';

interface Props {
    parcel: Parcel;
    router: AppRouterInstance;
    toast: any;
    setOpen: (open: boolean) => void;
    onClick: () => void;
}

export default function UserReceived({ parcel, router, toast, setOpen, onClick }: Props) {
    return (
        <section
            onClick={onClick}
            className='col-span-1 w-[350px] h-fit p-6 pt-4 pb-4 flex flex-col gap-y-5 justify-between border border-quatriary rounded-xl shadow-md'
        >
            <DropdownMenu>
                <DropdownMenuTrigger className='w-1/2 self-end' asChild>
                    <Button variant='outline' className='flex justify-between'>
                        Action
                        <Image
                            src={'/icons/interface/dropdown.svg'}
                            alt='dropdown'
                            width={16}
                            height={16}
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='ml-9'>
                    <DropdownMenuItem
                        className='flex items-center cursor-pointer'
                        onClick={async () => {
                            window.open(
                                URL.createObjectURL(
                                    await getEnvelopeFile(
                                        getCookie('accessToken') as string,
                                        parcel.envelopes.preDelivery as string
                                    )
                                ),
                                '_blank'
                            );
                        }}
                    >
                        <h3>Pre-delivery agreement</h3>
                        <Image
                            src={'/icons/partners/docu-icon.svg'}
                            alt='docu-icon'
                            width={16}
                            height={16}
                        />
                    </DropdownMenuItem>
                    {parcel.recipient.deliveryCompletion && (
                        <DropdownMenuItem
                            className='flex items-center cursor-pointer'
                            onClick={async () => {
                                window.open(
                                    URL.createObjectURL(
                                        await getEnvelopeFile(
                                            getCookie('accessToken') as string,
                                            parcel.recipient.deliveryCompletion as string
                                        )
                                    ),
                                    '_blank'
                                );
                            }}
                        >
                            <h3>Completion agreement</h3>
                            <Image
                                src={'/icons/partners/docu-icon.svg'}
                                alt='docu-icon'
                                width={16}
                                height={16}
                            />
                        </DropdownMenuItem>
                    )}
                    {parcel.recipient.nullifierHash && (
                        <DropdownMenuItem className='flex items-center cursor-pointer'>
                            <h3 className='text-secondary'>
                                {parcel.recipient.isDelegated ? 'Delegated' : 'Recipient verified'}
                            </h3>
                            <Image
                                src={'/icons/interface/success.svg'}
                                alt='success'
                                width={16}
                                height={16}
                            />
                        </DropdownMenuItem>
                    )}
                    {parcel.recipient.nullifierHash ? (
                        <></>
                    ) : parcel.recipient.isDelegated ? (
                        <></>
                    ) : (
                        <DropdownMenuItem
                            className='flex flex-col items-start cursor-pointer'
                            onClick={() => {
                                navigator.clipboard.writeText(generateDelegateLink(parcel.id));
                                toast({
                                    title: 'URL link to delegate recipient of the parcel has been copied',
                                });
                            }}
                        >
                            <h3>Recipient delegation</h3>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <section className='flex flex-col gap-y-2'>
                <h3 className='text-2xl font-semibold'>Parcel #{parcel.id}</h3>
                <h5 className='text-xs font-medium text-secondary'>
                    Created on {formatDateToUTC(parcel.timestamp)}
                </h5>
            </section>
            <section className='flex justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <div className='flex items-center gap-x-1'>
                        <Image
                            src={'/icons/partners/worldcoin.svg'}
                            alt='worldcoin'
                            width={12}
                            height={12}
                        />
                        <h5 className='text-xs'>World ID</h5>
                        {!parcel.recipient.nullifierHash && (
                            <Image
                                src={'/icons/interface/info.svg'}
                                alt='info'
                                width={12}
                                height={12}
                            />
                        )}
                    </div>
                    {parcel.recipient.nullifierHash ? (
                        <WorldcoinHash
                            className='h-full gap-x-4 text-xs'
                            hash={parcel.recipient.nullifierHash}
                        />
                    ) : (
                        <button
                            className='black-button !text-xs'
                            onClick={async () => {
                                const envelopeInfo = await getEnvelopeInformation(
                                    getCookie('accessToken') as string,
                                    parcel.envelopes.preDelivery as string
                                );

                                if (envelopeInfo.status == 'completed') setOpen(true);
                                else
                                    router.push(`/sign/not-signed?email=${parcel.recipient.email}`);
                            }}
                        >
                            Verify Now
                        </button>
                    )}
                </div>
                <div className='flex flex-col gap-y-2'>
                    <h5 className='text-xs'>Parcel Signing</h5>
                    <button
                        className={`${
                            parcel.recipient.nullifierHash &&
                            !parcel.attestation &&
                            !parcel.recipient.isDelegated
                                ? 'black'
                                : 'disabled'
                        }-button !text-xs`}
                        disabled={
                            !parcel.recipient.nullifierHash ||
                            parcel.attestation != undefined ||
                            parcel.recipient.isDelegated
                        }
                        onClick={() => router.push(`/sign?parcel_id=${parcel.id}&side=recipient`)}
                    >
                        {parcel.recipient.isDelegated ? 'Delegated' : 'Sign Now'}
                    </button>
                </div>
            </section>
            <section className='flex flex-col gap-y-2'>
                <h5 className='text-xs'>Status</h5>
                <h6 className={`text-xs ${parcel.status}`}>
                    {convertStatusToDisplay(parcel.status)}
                </h6>
            </section>
        </section>
    );
}
