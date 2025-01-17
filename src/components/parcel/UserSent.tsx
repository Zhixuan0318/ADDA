'use client';

import Image from 'next/image';
import { CopyButton } from '@lobehub/ui';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { getCookie } from 'cookies-next';
import { getEnvelopeFile } from '@/services/docusign';
import { formatDateToUTC } from '@/utils/formatter';
import { convertStatusToDisplay, generateAddParcelLink } from '@/utils/parcel';

export default function UserSent({ parcel, toast }: { parcel: Parcel; toast: any }) {
    return (
        <section className='col-span-1 w-[350px] h-fit p-6 pt-4 pb-4 flex flex-col gap-y-5 justify-between border border-quatriary rounded-xl shadow-md'>
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
                                        parcel.envelopes.parcelDelivery
                                    )
                                ),
                                '_blank'
                            );
                        }}
                    >
                        <h3>View signed agreement</h3>
                        <Image
                            src={'/icons/partners/docu-icon.svg'}
                            alt='docu-icon'
                            width={16}
                            height={16}
                        />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className='flex flex-col items-start cursor-pointer'
                        disabled={parcel.recipient.wallet != undefined}
                        onClick={() => {
                            if (parcel.recipient.wallet) return;

                            navigator.clipboard.writeText(generateAddParcelLink(parcel.id));
                            toast({
                                title: 'URL link for adding parcel has been copied',
                            });
                        }}
                    >
                        <h3>
                            {parcel.recipient.wallet
                                ? 'Added by Recipient'
                                : 'Share link to recipient'}
                        </h3>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <section className='flex flex-col gap-y-2'>
                <h3 className='text-2xl font-semibold'>Parcel #{parcel.id}</h3>
                <h5 className='text-xs font-medium text-secondary'>
                    Created on {formatDateToUTC(parcel.timestamp)}
                </h5>
            </section>
            <section className='flex flex-col gap-y-2'>
                <h5 className='text-xs'>Recipient Email</h5>
                <div className='p-2 pl-3 pr-3 w-full flex items-center justify-between border border-quatriary rounded-xl'>
                    <h5 className='text-xs text-secondary'>{parcel.recipient.email}</h5>
                    <CopyButton content={parcel.recipient.email} />
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
