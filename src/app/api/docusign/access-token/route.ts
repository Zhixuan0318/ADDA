import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { code } = await req.json();

        const response = await fetch(`https://account-d.docusign.com/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${btoa(
                    `${process.env.INTEGRATION_KEY}:${process.env.SECRET_KEY}`
                )}`,
            },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code,
            }),
        });

        return NextResponse.json(await response.json(), { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
