'use client';

import { useState } from 'react';

interface Props {
    text: string;
    className?: string;
    onClick?: () => {};
}

export default function LoadingButton({ text, className, onClick }: Props) {
    const [loading, setLoading] = useState(false);

    return (
        <button
            className={`black-button ${className}`}
            onClick={() => {
                setLoading(true);
                if (onClick) onClick();
            }}
            disabled={loading}
        >
            {loading && <div className='spinner-invert' />}
            {text}
        </button>
    );
}
