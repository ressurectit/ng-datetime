import {Component, ChangeDetectionStrategy, Inject, TemplateRef, Signal, input, InputSignal, viewChild, contentChild, InputSignalWithTransform, computed, effect, inject} from '@angular/core';
import {KeyValuePipe, NgTemplateOutlet} from '@angular/common';
import {Dictionary, isString} from '@jscrpt/common';

import {CalendarDayData, EventData} from '../../interfaces';
import {CalendarDayTemplateDirective, CalendarDayTemplateContext} from '../../directives';
import {MonthCalendarDayFormat, CalendarDayAspectRatio} from '../../misc';
import {EventParser} from '../../services';
import {DATE_API, FORMAT_PROVIDER} from '../../../../misc/tokens';
import {DateApi} from '../../../../services';
import {FormatProvider} from '../../../../interfaces';

/**
 * Transform function for `CalendarDayAspectRatio` allowing enter value as number or member name of `CalendarDayAspectRatio`
 */
function dayAspectRatioAttribute(value: keyof typeof CalendarDayAspectRatio|number): CalendarDayAspectRatio
{
    if(isString(value))
    {
        return CalendarDayAspectRatio[value];
    }

    return value;
}

/**
 * Component used for displaying month calendar
 */
@Component(
{
    selector: 'month-calendar',
    templateUrl: 'monthCalendar.component.html',
    imports:
    [
        CalendarDayTemplateDirective,
        NgTemplateOutlet,
        KeyValuePipe,
    ],
    providers:
    [
        EventParser,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthCalendarComponent<TDate = unknown, TEvent = unknown>
{
    //######################### protected properties - template bindings #########################

    /**
     * Data that represents calendar data
     */
    protected calendarData: Signal<Dictionary<CalendarDayData<TDate, TEvent>[]>>;

    /**
     * Calendar day template to be used
     */
    protected calendarDayTemplate: Signal<TemplateRef<CalendarDayTemplateContext>>;

    /**
     * Array of weekday names
     */
    protected weekDayNames: Signal<string[]>;

    //######################### protected properties - children #########################

    /**
     * Default calendar day template
     */
    protected defaultCalendarDayTemplate: Signal<TemplateRef<CalendarDayTemplateContext>> = viewChild.required(CalendarDayTemplateDirective, {read: TemplateRef});

    /**
     * Custom calendar day template
     */
    protected customCalendarDayTemplate: Signal<TemplateRef<CalendarDayTemplateContext>|undefined|null> = contentChild(CalendarDayTemplateDirective, {read: TemplateRef});

    //######################### public properties - inputs #########################

    /**
     * Indication that week number should be displayed
     */
    public showWeekNumber: InputSignal<boolean> = input(false);

    /**
     * Date that should be displayed in month calendar
     */
    public display: InputSignal<TDate> = input(inject<DateApi<TDate>>(DATE_API).now().value);

    /**
     * Format for displaying week day names
     */
    public weekDayName: InputSignal<MonthCalendarDayFormat|keyof typeof MonthCalendarDayFormat> = input<MonthCalendarDayFormat|keyof typeof MonthCalendarDayFormat>(MonthCalendarDayFormat.Short);

    /**
     * Aspect ratio for displayed calendar day cell
     */
    public dayAspectRatio: InputSignalWithTransform<CalendarDayAspectRatio, keyof typeof CalendarDayAspectRatio|number> = input<CalendarDayAspectRatio, keyof typeof CalendarDayAspectRatio|number>(CalendarDayAspectRatio.ThreeToTwo, {transform: dayAspectRatioAttribute});

    /**
     * Array of events that should be displayed
     */
    public events: InputSignal<EventData<TDate, TEvent>[]> = input<EventData<TDate, TEvent>[]>([]);

    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) protected formatProvider: FormatProvider,
                protected eventParser: EventParser<TDate, TEvent>,)
    {
        this.calendarDayTemplate = computed(() => this.customCalendarDayTemplate() ?? this.defaultCalendarDayTemplate());

        this.weekDayNames = computed(() =>
        {
            const weekDayNames = [];

            switch(this.weekDayName())
            {
                default:
                // case MonthCalendarDayFormat.None:
                {
                    for(let x = 0; x < 7; x++)
                    {
                        weekDayNames.push('');
                    }

                    break;
                }
                case MonthCalendarDayFormat.Short:
                {
                    const names = this.dateApi.weekdays(true);
                    weekDayNames.push(...names);

                    break;
                }
                case MonthCalendarDayFormat.Full:
                {
                    const names = this.dateApi.weekdays();
                    weekDayNames.push(...names);

                    break;
                }
            }

            return weekDayNames;
        });

        this.calendarData = computed(() =>
        {
            const display = this.display();
            const workDate = this.dateApi.getValue(display);

            workDate.startOfMonth()
                .startOfWeek();

            const calendarData: Dictionary<CalendarDayData<TDate, TEvent>[]> = {};

            do
            {
                const weekData: CalendarDayData<TDate, TEvent>[] = calendarData[workDate.format(this.formatProvider.week)] = [];

                for(let x = 0; x < 7; x++)
                {
                    weekData.push(
                    {
                        date: workDate.value,
                        day: workDate.dayOfMonth(),
                        events: [],
                        isCurrentMonth: workDate.isSameMonth(display),
                        isWeekend: workDate.isWeekend(),
                        week: +workDate.format(this.formatProvider.week),
                    });

                    workDate.addDays(1);
                }

                workDate.startOfWeek();
            }
            while(workDate.isSameMonth(display));

            return calendarData;
        });

        effect(() =>
        {
            const events = this.eventParser.getEventsPerDay(this.events());
            const calendarData = this.calendarData();

            for(const week in calendarData)
            {
                const weekData = calendarData[week];

                for(const day of weekData)
                {
                    const found = events.find(itm => this.dateApi.getValue(itm[0]).isSame(day.date));
                    day.events = found?.[1] ?? [];
                }
            }
            //TODO: test whether event are refreshed when changed
        });
    }
}