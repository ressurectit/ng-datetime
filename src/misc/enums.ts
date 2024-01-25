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
     * Numeric unix timestamp in miliseconds
     */
    UnixTimestamp,

    /**
     * Formatted date as string value, same string as displayed string
     */
    FormattedString,

    /**
     * Formatted date as string value, custom string format for date time value, different from displayed string format
     */
    DataString,

    /**
     * Range of date instances from, to
     */
    RangeOfDateInstances,
}