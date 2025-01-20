import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { accessToken, envelopeId } = await req.json();

        const response = await fetch(
            `https://demo.docusign.net/restapi/v2.1/accounts/${process.env.API_ACCOUNT_ID}/envelopes/${envelopeId}/form_data`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const json = await response.json();

        return NextResponse.json(json, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
