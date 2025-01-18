export const getAuthLink = (redirectUri: string) => {
    return `https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20click.manage%20click.send%20webforms_read%20webforms_instance_read%20webforms_instance_write%20extended&client_id=${process.env.INTEGRATION_KEY}&redirect_uri=${redirectUri}`;
};

export const getAccessToken = async (authCode: string): Promise<string> => {
    const response = await fetch(`/api/docusign/access-token`, {
        method: 'POST',
        body: JSON.stringify({
            code: authCode,
        }),
    });

    const json = await response.json();
    return json.access_token;
};

export const getLatestClientForm = async (
    wallet: `0x${string}` | undefined,
    accessToken: string,
    formId: string
): Promise<any> => {
    const response = await fetch(`/api/docusign/form/get-instance`, {
        method: 'POST',
        body: JSON.stringify({
            wallet,
            accessToken,
            formId,
        }),
    });

    return await response.json();
};

export const createFormUrl = async (
    wallet: `0x${string}` | undefined,
    accessToken: string,
    formId: string,
    returnUrl: string | undefined,
    formValues?: object,
    metadata?: string[]
): Promise<string> => {
    const response = await fetch(`/api/docusign/form/create`, {
        method: 'POST',
        body: JSON.stringify({
            wallet,
            accessToken,
            formId,
            returnUrl,
            formValues,
            metadata,
        }),
    });

    const json = await response.json();
    if (json.url.includes('undefined')) throw new Error('Link error');

    return json.url;
};

export const getEnvelopeData = async (accessToken: string, envelopeId: string): Promise<any> => {
    const response = await fetch(`/api/docusign/envelope/form-data`, {
        method: 'POST',
        body: JSON.stringify({
            accessToken,
            envelopeId,
        }),
    });

    const json = await response.json();
    return json;
};

export const getEnvelopeInformation = async (
    accessToken: string,
    envelopeId: string
): Promise<any> => {
    const response = await fetch(`/api/docusign/envelope/information`, {
        method: 'POST',
        body: JSON.stringify({
            accessToken,
            envelopeId,
        }),
    });

    const json = await response.json();
    return json;
};

export const getEnvelopeFile = async (accessToken: string, envelopeId: string): Promise<Blob> => {
    const response = await fetch(`/api/docusign/form/load-file`, {
        method: 'POST',
        body: JSON.stringify({
            accessToken,
            envelopeId,
        }),
    });

    if (!response.body) throw new Error(`Couldn't load the file`);

    const reader = response.body?.getReader();
    let chunks = new Uint8Array(0);
    let done = false;

    while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
            const newChunks = new Uint8Array(chunks.length + value.length);
            newChunks.set(chunks);
            newChunks.set(value, chunks.length);
            chunks = newChunks;
        }
    }

    return new Blob([chunks], { type: 'application/pdf' });
};

export const createClickWrap = async (accessToken: string, nullifierHash: string) => {
    const response = await fetch(`/api/docusign/clickwrap`, {
        method: 'POST',
        body: JSON.stringify({
            accessToken,
            nullifierHash,
        }),
    });

    const json = await response.json();
    return json.url;
};

export const sendPreDeliveryAgreement = async (
    receiver: string[],
    accessToken: string,
    envelopeId: string
): Promise<string> => {
    const response = await fetch(`/api/docusign/email-form`, {
        method: 'POST',
        body: JSON.stringify({
            accessToken,
            envelopeId,
            receiver: {
                name: receiver[0],
                email: receiver[1],
            },
        }),
    });

    const json = await response.json();
    return json.envelopeId;
};
