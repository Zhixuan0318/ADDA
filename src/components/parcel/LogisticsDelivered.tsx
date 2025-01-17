'use client';

import Image from 'next/image';
import WorldcoinHash from '../ui/worldcoin-hash';

import { getEnvelopeFile } from '@/services/docusign';
import { getCookie } from 'cookies-next';
import { formatDateToUTC } from '@/utils/formatter';
import Link from 'next/link';
import { CopyButton } from '@lobehub/ui';

export default function LogisticsDelivered({ parcel }: { parcel: Parcel }) {
    return (
        <section className='col-span-1 w-[350px] h-fit p-6 pt-4 pb-4 flex flex-col gap-y-5 justify-between border border-quatriary rounded-xl shadow-md'>
            <section className='flex flex-col gap-y-2'>
                <div className='flex justify-between items-center'>
                    <h3 className='text-2xl font-semibold'>Parcel #{parcel.id}</h3>
                    <h6 className={`text-xs delivered`}>Delivered</h6>
                </div>
                <h5 className='text-xs font-medium text-secondary'>
                    Created on {formatDateToUTC(parcel.timestamp)}
                </h5>
            </section>
            <section className='flex flex-col gap-y-2'>
                <h6 className='text-xs'>Schema of attestation</h6>
                <div className='flex items-center p-3 justify-between border border-tetriary rounded-md'>
                    <h4 className='text-secondary'>{process.env.NEXT_PUBLIC_SCHEMA_ID}</h4>
                    <div className='flex items-center gap-x-1'>
                        <CopyButton content={process.env.NEXT_PUBLIC_SCHEMA_ID as string} />
                        <Link
                            href={`https://testnet-scan.sign.global/schema/${process.env.NEXT_PUBLIC_SCHEMA_ID}`}
                            target='_blank'
                        >
                            <Image
                                src={'/icons/interface/web.svg'}
                                alt='web'
                                width={18}
                                height={18}
                                className='cursor-pointer'
                            />
                        </Link>
                    </div>
                </div>
            </section>
            <section className='flex flex-col gap-y-2'>
                <h6 className='text-xs'>Attestation made</h6>
                <div className='flex items-center p-3 justify-between border border-tetriary rounded-md'>
                    <h4 className='text-secondary'>{parcel?.attestation}</h4>
                    <div className='flex items-center gap-x-1'>
                        <CopyButton content={parcel?.attestation ?? ''} />
                        <Link
                            href={`https://testnet-scan.sign.global/attestation/onchain_evm_5611_${parcel?.attestation}`}
                            target='_blank'
                        >
                            <Image
                                src={'/icons/interface/web.svg'}
                                alt='web'
                                width={18}
                                height={18}
                                className='cursor-pointer'
                            />
                        </Link>
                    </div>
                </div>
            </section>
            <div className='flex items-center gap-x-2'>
                <h5
                    className='text-sm underline cursor-pointer'
                    onClick={async () => {
                        window.open(
                            URL.createObjectURL(
                                await getEnvelopeFile(
                                    getCookie('accessToken') as string,
                                    parcel.sender.deliveryCompletion as string
                                )
                            ),
                            '_blank'
                        );
                    }}
                >
                    View completion agreement
                </h5>
                <Image
                    src={'/icons/partners/docu-icon.svg'}
                    alt='docusign'
                    width={18}
                    height={18}
                />
            </div>
        </section>
    );
}
