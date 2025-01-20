import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { wallet, accessToken, formId, returnUrl, formValues, metadata } = await req.json();

        const response = await fetch(
            `https://apps-d.docusign.com/api/webforms/v1.1/accounts/${process.env.API_ACCOUNT_ID}/forms/${formId}/instances`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    clientUserId: wallet,
                    returnUrl,
                    formValues,
                    tags: metadata,
                }),
            }
        );

        const json = await response.json();
        const url = `${json.formUrl}#instanceToken=${json.instanceToken}`;

        return NextResponse.json({ url }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
