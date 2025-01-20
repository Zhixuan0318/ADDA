import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { wallet, accessToken, formId } = await req.json();

        const response = await fetch(
            `https://apps-d.docusign.com/api/webforms/v1.1/accounts/${process.env.API_ACCOUNT_ID}/forms/${formId}/instances?client_user_id=${wallet}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const json = await response.json();

        return NextResponse.json(json.items[json.items.length - 1], { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
