'use client';

import { CopyButton } from '@lobehub/ui';

import { formatHexLength } from '@/utils/formatter';

export default function WorldcoinHash({
    hash,
    className,
    fullText,
}: {
    hash: string;
    className?: string;
    fullText?: boolean;
}) {
    return (
        <div
            className={`w-fit pl-3 flex items-center border border-tetriary rounded-md text-secondary ${className}`}
        >
            {fullText ? hash : formatHexLength(hash)} <CopyButton content={hash} />
        </div>
    );
}
