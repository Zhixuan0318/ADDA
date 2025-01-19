'use client';

import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DynamicUserProfile, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAccount } from 'wagmi';

import { formatHexLength } from '@/utils/formatter';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const isLoggedIn = useIsLoggedIn();
    const { setShowDynamicUserProfile } = useDynamicContext();
    const { address, status } = useAccount();

    useEffect(() => {
        if (!isLoggedIn && status == 'disconnected') router.push('/');
    }, [isLoggedIn, status]);

    const [role, setRole] = useState<Role>(pathname.includes('user') ? 'user' : 'logistics');

    useEffect(() => {
        if (role == 'user' && !pathname.includes('user')) router.push('/home/user');
        if (role == 'logistics' && !pathname.includes('logistics')) router.push('/home/logistics');
    }, [role]);

    return (
        <>
            {/* @ts-ignore */}
            <DynamicUserProfile />
            <nav className='relative m-9 mb-16 grid grid-cols-3'>
                <DropdownMenu>
                    <DropdownMenuTrigger className='justify-self-start' asChild>
                        <Button variant='outline' className='font-semibold'>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                            <Image
                                src={'/icons/interface/dropdown.svg'}
                                alt='dropdown'
                                width={24}
                                height={24}
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='ml-9'>
                        <DropdownMenuItem
                            className='flex flex-col items-start cursor-pointer'
                            onClick={() => setRole('user')}
                            disabled={role == 'user'}
                        >
                            <h3 className='font-semibold'>User</h3>
                            <h5 className='text-secondary'>Sent and received parcel</h5>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className='flex flex-col items-start cursor-pointer'
                            onClick={() => setRole('logistics')}
                            disabled={role == 'logistics'}
                        >
                            <h3 className='font-semibold'>Logistics</h3>
                            <h5 className='text-secondary'>Manage and deliver parcel</h5>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Image
                    src={'/icons/box.svg'}
                    alt='box'
                    width={50}
                    height={50}
                    className='justify-self-center'
                />
                <div className='flex gap-x-2 justify-self-end'>
                    {role == 'user' && (
                        <button
                            className='black-button'
                            onClick={() => router.push('/create-delivery')}
                        >
                            Create Delivery
                        </button>
                    )}
                    {address && (
                        <button
                            className='white-button'
                            onClick={() => setShowDynamicUserProfile(true)}
                        >
                            {formatHexLength(address)}
                        </button>
                    )}
                </div>
            </nav>
            {children}
        </>
    );
}
