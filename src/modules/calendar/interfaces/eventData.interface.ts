import {DateApiObject} from '../../../services';

/**
 * Data for event that are passed to calendar
 */
export interface EventData<TDate = unknown, TEvent = unknown>
{
    /**
     * Data for event
     */
    data: TEvent;

    /**
     * Date when event starts
     */
    dateFrom: TDate;

    /**
     * Date when event ends
     */
    dateTo: TDate|undefined|null;
}

/**
 * Represents object that holds date api object for dateFrom and dateTo
 */
export interface WithDateApiFromTo<TDate = unknown>
{
    /**
     * Date api for date when event starts
     */
    dateApiFrom: DateApiObject<TDate>;

    /**
     * Date api for date when event ends
     */
    dateApiTo: DateApiObject<TDate>|undefined|null;
}

/**
 * Internal representation of event data
 */
export interface ɵEventData<TDate = unknown, TEvent = unknown> extends EventData<TDate, TEvent>, WithDateApiFromTo<TDate>
{
}