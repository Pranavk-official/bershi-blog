/**
 * Formats an ISO date string into a human-readable format
 * @param dateString - ISO 8601 date string (e.g., "2024-03-15")
 * @returns Formatted date string (e.g., "March 15, 2024")
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
