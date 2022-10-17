/**
 * Format provider used for obtaining common used format 'tokens'
 */
export interface FormatProvider
{
    /**
     * Format token for displaying date
     */
    readonly date: string;

    /**
     * Format token for displaying date and time
     */
    readonly dateTime: string;

    /**
     * Format token for displaying time
     */
    readonly time: string;

    /**
     * Format token for displaying full year
     */
    readonly year: string;

    /**
     * Format token for displaying month double digit number
     */
    readonly month: string;

    /**
     * Format token for displaying week double digit number
     */
    readonly week: string;

    /**
     * Format token for displaying day double digit number
     */
    readonly day: string;

    /**
     * Format token for displaying hour (24h format) double digit number
     */
    readonly hour: string;

    /**
     * Format token for displaying minute double digit number
     */
    readonly minute: string;

    /**
     * Format token for displaying second double digit number
     */
    readonly second: string;

    /**
     * Format token for displaying standalone day full name 
     */
    readonly dayName: string;

    /**
     * Format token for displaying standalone day short name
     */
    readonly dayNameShort: string;

    /**
     * Format token for displaying standalone month full name
     */
    readonly monthName: string;

    /**
     * Format token for displaying standalone month short name
     */
    readonly monthNameShort: string;
}