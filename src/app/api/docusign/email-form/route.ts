import { NextRequest, NextResponse } from 'next/server';

import preDelivery from '@/data/pre-delivery';
import { tabs, customFields } from '@/data/tabs';

export async function POST(req: NextRequest) {
    try {
        const { accessToken, envelopeId, receiver } = await req.json();

        const dataResponse = await fetch(
            `${process.env.NEXT_PUBLIC_APP_LINK}/api/docusign/envelope/form-data`,
            {
                method: 'POST',
                body: JSON.stringify({
                    accessToken,
                    envelopeId,
                }),
            }
        );

        const data = await dataResponse.json();

        const dimension =
            Number(data.formData[3].value) *
            Number(data.formData[4].value) *
            Number(data.formData[5].value);

        const copy = tabs;
        copy.textTabs[0].value = data.formData[2].value;
        copy.textTabs[1].value = data.formData[12].value;
        copy.textTabs[2].value = data.formData[6].value;
        copy.textTabs[3].value = dimension.toFixed(2);
        copy.textTabs[4].value = data.formData[7].value;

        const response = await fetch(
            `https://demo.docusign.net/restapi/v2.1/accounts/${process.env.API_ACCOUNT_ID}/envelopes`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    customFields,
                    emailSubject: 'Sign Pre-Delivery Agreement',
                    documents: [
                        {
                            documentBase64: preDelivery,
                            name: 'Pre-Delivery Agreement.pdf',
                            fileExtension: 'pdf',
                            documentId: '1',
                        },
                    ],
                    recipients: {
                        signers: [
                            {
                                email: receiver.email,
                                name: receiver.name,
                                recipientId: '1',
                                routingOrder: '1',
                                tabs: copy,
                            },
                        ],
                    },
                    status: 'sent',
                }),
            }
        );

        const json = await response.json();
        return NextResponse.json({ envelopeId: json.envelopeId }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
