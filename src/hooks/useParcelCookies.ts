import { useEffect, useState } from 'react';

import Firebase from '@/services/firebase';
import { getCookie, hasCookie } from 'cookies-next';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function useParcelCookies(router: AppRouterInstance, firebase: Firebase) {
    const [parcel, setParcel] = useState<Parcel>();

    const [side, setSide] = useState<Side>();
    const [parcelId, setParcelId] = useState('');

    useEffect(() => {
        const sideCookie = getCookie('side');
        const parcelIdCookie = getCookie('parcelId');

        if (!sideCookie || !parcelIdCookie || !hasCookie('accessToken')) router.push('/');

        setSide(sideCookie as Side);
        setParcelId(parcelIdCookie as string);
    }, []);

    useEffect(() => {
        if (parcelId) firebase.loadParcel(parcelId).then((data) => setParcel(data));
    }, [parcelId]);

    return {
        parcel,
        setParcel,
        side,
    };
}
