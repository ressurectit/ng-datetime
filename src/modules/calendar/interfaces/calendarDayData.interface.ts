import {CalendarEventDayMetadata} from './calendarEventDayMetadata.interface';

/**
 * Data for day for calendar
 */
export interface CalendarDayData<TDate = unknown, TEvent = unknown>
{
    /**
     * Thin array of events array for day
     */
    events: CalendarEventDayMetadata<TDate, TEvent>[];

    /**
     * Date of day
     */
    date: TDate;

    /**
     * Number of day of month
     */
    day: number;

    /**
     * Indication whether is this day weekend day
     */
    isWeekend: boolean;

    /**
     * Indication whether is this day for currently displayed month
     */
    isCurrentMonth: boolean;

    /**
     * Week number of year for day
     */
    week: number;
}