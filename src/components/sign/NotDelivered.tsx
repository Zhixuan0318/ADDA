import Image from 'next/image';

export default function NotDelivered({ parcelId }: { parcelId: string }) {
    return (
        <main className='h-[calc(100dvh-100px)] flex flex-col items-center justify-center gap-y-11'>
            <Image src={`/images/not-delivered.svg`} alt='not-delivered' width={200} height={200} />
            <div className='w-min flex flex-col items-center justify-center gap-y-7'>
                <h1 className='text-5xl text-nowrap'>
                    {`Your parcel #${parcelId} not yet arrived`}
                </h1>
                <h5 className='text-secondary text-center'>
                    Hey, we are working hard to deliver your parcel to your doorstep as quickly as
                    possible. You can return to this page to sign for the parcel once our logistic
                    courier hands it to you.
                </h5>
            </div>
        </main>
    );
}
