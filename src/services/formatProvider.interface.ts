/**
 * Format provider used for obtaining some special formats 'placeholders'
 */
export interface FormatProvider
{
    /**
     * Format placeholder for displaying date
     */
    readonly date: string;

    /**
     * Format placeholder for displaying date and time
     */
    readonly dateTime: string;

    /**
     * Format placeholder for displaying time
     */
    readonly time: string;
}