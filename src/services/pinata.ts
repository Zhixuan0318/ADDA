export const uploadFile = async (file: File): Promise<string> => {
    const data = new FormData();
    data.set('file', file);

    const request = await fetch('/api/pinata', {
        method: 'POST',
        body: data,
    });

    return await request.json();
};
