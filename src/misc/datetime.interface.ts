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