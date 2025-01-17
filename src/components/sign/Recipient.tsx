'use client';

import Image from 'next/image';
import WorldcoinHash from '../ui/worldcoin-hash';

interface Props {
    setOpen: (open: boolean) => void;
    parcel: Parcel;
}

export default function Recipient({ setOpen, parcel }: Props) {
    return (
        <main className='h-[calc(100dvh-100px)] flex flex-col items-center justify-center gap-y-11'>
            <Image src={`/images/recipient.svg`} alt='recipient' width={200} height={200} />
            <div className='w-min flex flex-col items-center justify-center gap-y-7'>
                <h1 className='text-5xl text-nowrap'>{`Sign your parcel #${parcel.id}`}</h1>
                <h5 className='text-secondary text-center'>
                    Hooray, our logistic courier had delivered your parcel to your doorstep. Parcel
                    signing is the last step to go! We need to verify whether you are the recipient
                    before proceeding.'
                </h5>
            </div>
            <button className='black-button !text-base' onClick={() => setOpen(true)}>
                <Image
                    className='invert'
                    src={'/icons/partners/worldcoin.svg'}
                    alt='worldcoin'
                    width={25}
                    height={25}
                />
                Verify World ID
            </button>
            <section className='flex flex-col items-center gap-y-2'>
                <div className='w-full flex items-center justify-center gap-x-1'>
                    <Image
                        src={`/icons/interface/success.svg`}
                        alt='success'
                        width={18}
                        height={18}
                    />
                    <Image
                        src={`/icons/partners/worldcoin.svg`}
                        alt='worldcoin'
                        width={18}
                        height={18}
                    />
                    <h4>Our logistic courier is verified</h4>
                </div>
                <WorldcoinHash
                    hash={parcel.sender.nullifierHash as string}
                    className='p-2 gap-x-4'
                />
            </section>
        </main>
    );
}
