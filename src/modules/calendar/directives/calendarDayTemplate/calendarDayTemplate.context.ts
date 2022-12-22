import {CalendarDayData} from '../../interfaces';

/**
 * Context passed to template of calendar day
 */
export interface CalendarDayTemplateContext<TDate = unknown, TEvent = unknown>
{
    /**
     * Data that are used for displaying calendar day
     */
    $implicit: CalendarDayData<TDate, TEvent>;
}