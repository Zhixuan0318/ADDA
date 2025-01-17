'use client';

import { useToast } from '@/hooks/use-toast';

interface Props {
    content: string;
    toastMessage?: string;
}

export default function CopyLink({ content, toastMessage }: Props) {
    const { toast } = useToast();

    return (
        <div className='flex gap-x-2'>
            <div className='w-3/5 p-3 pt-2 pb-2 flex items-center gap-x-12 border border-tetriary rounded-sm'>
                {content}
            </div>
            <button
                className='black-button !text-base'
                onClick={() => {
                    navigator.clipboard.writeText(content);
                    if (toastMessage)
                        toast({
                            title: toastMessage,
                        });
                }}
            >
                Copy Link
            </button>
        </div>
    );
}
