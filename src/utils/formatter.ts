export function formatHexLength(hex: string | undefined): string {
    if (!hex) return 'loading';
    return `${hex.slice(0, 5)}...${hex.slice(hex.length - 5)}`;
}

export function formatDateToUTC(timestamp: number): string {
    const date = new Date(timestamp);

    const hours = date.getUTCHours();

    return `${date.getUTCDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${
        hours > 12 ? hours - 12 : hours
    }:${date.getUTCMinutes()}${hours > 12 ? 'pm' : 'am'} UTC`;
}
