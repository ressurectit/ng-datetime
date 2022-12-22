import {EventData, WithDateApiFromTo} from './eventData.interface';

/**
 * Event metadata for day
 */
export interface CalendarEventDayMetadata<TDate = unknown, TEvent = unknown> extends EventData<TDate, TEvent>, WithDateApiFromTo<TDate>
{
    /**
     * Indication whether is event all day event
     */
    allDay: boolean;

    /**
     * Indication that event is ongoing from previous date
     */
    onGoingFrom: boolean;

    /**
     * Indication that event is ongoing to next date
     */
    onGoingTo: boolean;
}