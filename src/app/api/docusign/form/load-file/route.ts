import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { accessToken, envelopeId } = await req.json();

        const response = await fetch(
            `https://demo.docusign.net/restapi/v2.1/accounts/${process.env.API_ACCOUNT_ID}/envelopes/${envelopeId}/documents/1`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response;
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
