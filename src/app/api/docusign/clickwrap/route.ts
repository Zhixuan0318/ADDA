import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { accessToken, nullifierHash } = await req.json();

        const response = await fetch(
            `https://demo.docusign.net/clickapi/v1/accounts/${process.env.API_ACCOUNT_ID}/clickwraps/${process.env.CLICK_WRAP_ID}/agreements`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    returnUrl: `${process.env.NEXT_PUBLIC_APP_LINK}/photo-evidence`,
                    clientUserId: `${nullifierHash}${Date.now()}`,
                }),
            }
        );
        const json = await response.json();

        return NextResponse.json({ url: json.agreementUrl }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
