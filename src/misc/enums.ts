/**
 * Available formats for date time value
 */
export enum DateTimeValueFormat
{
    /**
     * Instance of date
     */
    DateInstance,

    /**
     * Numeric unix timestamp in seconds
     */
    UnixTimestamp,

    /**
     * Formatted date as string value
     */
    FormattedString,

    /**
     * Range of date instances from, to
     */
    RangeOfDateInstances,
}