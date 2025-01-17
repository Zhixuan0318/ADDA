'use client';

import Image from 'next/image';
import WorldcoinHash from '../ui/worldcoin-hash';

interface Props {
    setOpen: (open: boolean) => void;
    parcel: Parcel;
}

export default function Sender({ setOpen, parcel }: Props) {
    return (
        <main className='h-[calc(100dvh-100px)] flex flex-col items-center justify-center gap-y-11'>
            <Image src={`/images/sender.svg`} alt='sender' width={200} height={200} />
            <div className='w-min flex flex-col items-center justify-center gap-y-7'>
                <h1 className='text-5xl text-nowrap'>
                    {`Thanks for delivering parcel #${parcel.id}`}
                </h1>
                <h5 className='text-secondary text-center'>
                    Hey, thanks for delivering this parcel to our lovely recipient. To ensure the
                    whole delivery journey is smooth and transparent, do verify your identity before
                    proceeding with the parcel signing stage.
                </h5>
            </div>
            {parcel.sender.nullifierHash ? (
                <>
                    <section className='flex flex-col justify-center gap-y-2'>
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
                        </div>
                        <h4>Verified Successfully!</h4>
                        <WorldcoinHash hash={parcel.sender.nullifierHash} className='p-2 gap-x-4' />
                    </section>
                    <div className='flex items-center gap-x-2'>
                        <div className='spinner'></div>
                        <h4> Waiting for parcel recipient to verify</h4>
                    </div>
                </>
            ) : (
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
            )}
        </main>
    );
}
