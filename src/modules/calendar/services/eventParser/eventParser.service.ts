import {Inject, Injectable} from '@angular/core';

import {DATE_API} from '../../../../misc/tokens';
import {DateApi} from '../../../../services';
import {CalendarEventDayMetadata, EventData, ɵEventData} from '../../interfaces';

/**
 * Service used for parsing events into events to requested period
 */
@Injectable()
export class EventParser<TDate = unknown, TEvent = unknown>
{
    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected dateApi: DateApi<TDate>,)
    {
    }

    //######################### public methods #########################

    /**
     * Gets events parsed per day
     * @param events - Array of events to be parsed
     */
    public getEventsPerDay(events: EventData<TDate, TEvent>[]): [TDate, CalendarEventDayMetadata<TDate, TEvent>[]][]
    {
        const eventsLocal = events.map(itm =>
        {
            return <ɵEventData<TDate, TEvent>>
            {
                data: itm.data,
                dateFrom: itm.dateFrom,
                dateTo: itm.dateTo,
                dateApiFrom: this.dateApi.getValue(itm.dateFrom),
                dateApiTo: itm.dateTo ? this.dateApi.getValue(itm.dateTo) : null,
            };
        });

        eventsLocal.sort((a, b) =>
        {
            if(a.dateApiFrom.isAfter(b.dateApiFrom.value))
            {
                return 1;
            }

            if(a.dateApiFrom.isBefore(b.dateApiFrom.value))
            {
                return -1;
            }

            return 0;
        });

        const result: [TDate, CalendarEventDayMetadata<TDate, TEvent>[]][] = [];

        for(const event of eventsLocal)
        {
            const workDate = event.dateApiFrom.clone().startOfDay();
            const data: CalendarEventDayMetadata<TDate, TEvent>[] = result.find(itm => workDate.isSameDay(itm[0]))?.[1] ?? [];
            const index = data.length;

            do
            {
                let data: [TDate, CalendarEventDayMetadata<TDate, TEvent>[]]|undefined = result.find(itm => workDate.isSameDay(itm[0]));

                if(!data)
                {
                    data = [workDate.value, []];
                    result.push(data);
                }

                const evnts: CalendarEventDayMetadata<TDate, TEvent>[] = data[1];
                evnts[index] =
                {
                    data: event.data,
                    dateApiFrom: event.dateApiFrom,
                    dateApiTo: event.dateApiTo,
                    dateFrom: event.dateFrom,
                    dateTo: event.dateTo,
                    onGoingFrom: workDate.startOfDay().isAfter(event.dateApiFrom),
                    allDay: (workDate.isSame(event.dateApiFrom) || workDate.isAfter(event.dateApiFrom)) &&
                            !!event.dateApiTo && (workDate.endOfDay().isSame(event.dateApiTo) || workDate.isBefore(event.dateApiTo)),
                    onGoingTo: !!event.dateApiTo && workDate.isBefore(event.dateApiTo),
                };
                
                workDate.addDays(1).startOfDay();
            }
            while(!!event.dateApiTo && (workDate.isBefore(event.dateApiTo) || workDate.isSameDay(event.dateApiTo)));
        }

        return result;
    }
}