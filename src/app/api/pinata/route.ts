import { NextResponse, NextRequest } from 'next/server';
import { PinataSDK } from 'pinata';

export async function POST(request: NextRequest) {
    try {
        const pinata = new PinataSDK({
            pinataJwt: `${process.env.PINATA_JWT}`,
        });

        const data = await request.formData();
        const uploadData = await pinata.upload.file(data.get('file') as File);
        return NextResponse.json(uploadData.cid, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
