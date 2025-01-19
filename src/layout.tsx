import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@/components/ui/toaster';
import WalletProvider from '@/context/WalletProvider';
import { ParcelProvider } from '@/context/ParcelProvider';

import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'] });

export const metadata: Metadata = {
    title: 'ADDA Protocol',
    description: 'ADDA Protocol project',
    icons: [
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            url: '/favicon/favicon-32x32.png',
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            url: '/favicon/favicon-16x16.png',
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            url: '/favicon/apple-touch-icon.png',
        },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <WalletProvider>
                    <ParcelProvider>
                        <Toaster />
                        {children}
                    </ParcelProvider>
                </WalletProvider>
            </body>
        </html>
    );
}
