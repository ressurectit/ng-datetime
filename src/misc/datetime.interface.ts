/**
 * Represents datetime value as period
 */
export interface DateTimeValue<TDate = any>
{
    /**
     * Starting date and time of period
     */
    from: TDate;

    /**
     * Ending date and time of period
     */
    to: TDate;
}

/**
 * Represents object that holds data for indentification of validity of date time
 */
export interface DateTimeValueObject<TDate = any>
{
    /**
     * Current value of datetime
     */
    readonly value: DateTimeValue<TDate>|null;

    /**
     * Indicaiton whether is current value valid, empty value is valid
     */
    readonly valid: boolean;

    /**
     * Minimal possible value, that can be
     */
    readonly minValue: TDate|null;

    /**
     * Maximal possible value, that can be
     */
    readonly maxValue: TDate|null;
}