import { NextRequest, NextResponse } from 'next/server';

import { composeNewParcel, updateParcelAgreement } from '@/app/actions';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const fileName = body.data.envelopeSummary.emailSubject;

        if (fileName.includes('Parcel Delivery Agreement')) await composeNewParcel(body);
        if (
            fileName.includes('Acknowledgement of Delivery') ||
            fileName.includes('Delivery Completion Agreement')
        )
            await updateParcelAgreement(body);

        return NextResponse.json({}, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
