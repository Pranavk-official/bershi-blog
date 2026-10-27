/**
 * Formats a date string from "YYYY-MM" format to "MMM YYYY" format
 * @param dateStr - Date string in "YYYY-MM" format
 * @returns Formatted date string like "Sept 2025"
 */
function formatDate(dateStr: string): string {
    const parts = dateStr.split('-');
    const [year, month] = parts;
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Converts a date string from "YYYY-MM" format to ISO format for datetime attribute
 * @param dateStr - Date string in "YYYY-MM" format or "Present"
 * @returns ISO date string like "2025-09" or current date for "Present"
 */
export function toISODate(dateStr: string | 'Present'): string {
    if (dateStr === 'Present') {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    return dateStr;
}

/**
 * Formats a date range from start and end dates
 * @param start - Start date in "YYYY-MM" format
 * @param end - End date in "YYYY-MM" format or "Present"
 * @returns Formatted date range like "Sept 2025 – Present" or "Oct 2024 – Sept 2025"
 */
export function formatDateRange(start: string, end: string | 'Present'): string {
    try {
        const startFormatted = formatDate(start);
        const endFormatted = end === 'Present' ? 'Present' : formatDate(end);

        return `${startFormatted} – ${endFormatted}`;
    } catch (error) {
        // Fallback to raw strings if formatting fails
        console.error('Error formatting date range:', error);
        return `${start} – ${end}`;
    }
}

/**
 * Calculates the duration between two dates in years and months
 * @param start - Start date in "YYYY-MM" format
 * @param end - End date in "YYYY-MM" format or "Present"
 * @returns Duration string like "1 year, 2 months" or "6 months"
 */
export function calculateDuration(start: string, end: string | 'Present'): string {
    try {
        const [startYear, startMonth] = start.split('-').map(Number); // handles both YYYY-MM and YYYY-MM-DD

        let endYear: number;
        let endMonth: number;

        if (end === 'Present') {
            const now = new Date();
            endYear = now.getFullYear();
            endMonth = now.getMonth() + 1; // getMonth() returns 0-11
        } else {
            [endYear, endMonth] = end.split('-').map(Number);
        }

        // Calculate total months
        const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

        // Handle edge case where dates are the same or invalid
        if (totalMonths < 0) {
            return '0 months';
        }

        if (totalMonths === 0) {
            return '1 month';
        }

        const years = Math.floor(totalMonths / 12);
        const remainingMonths = totalMonths % 12;

        // Format output
        if (years === 0) {
            return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
        }

        if (remainingMonths === 0) {
            return `${years} ${years === 1 ? 'year' : 'years'}`;
        }

        return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    } catch (error) {
        console.error('Error calculating duration:', error);
        return 'Duration unavailable';
    }
}
