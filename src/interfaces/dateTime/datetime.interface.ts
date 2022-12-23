/**
 * Represents datetime value as period
 */
export interface DateTimeValue<TDate = unknown>
{
    /**
     * Starting date and time of period
     */
    from: TDate|undefined|null;

    /**
     * Ending date and time of period
     */
    to: TDate|undefined|null;
}
