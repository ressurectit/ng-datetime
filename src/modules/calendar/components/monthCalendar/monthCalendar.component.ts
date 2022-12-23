import {Component, ChangeDetectionStrategy, Input, Inject, OnInit, ViewChild, TemplateRef, ContentChild, OnChanges, SimpleChanges} from '@angular/core';
import {Dictionary, isString, nameof} from '@jscrpt/common';

import {CalendarDayData, EventData} from '../../interfaces';
import {CalendarDayTemplateDirective, CalendarDayTemplateContext} from '../../directives';
import {MonthCalendarDayFormat, CalendarDayAspectRatio} from '../../misc';
import {EventParser} from '../../services';
import {DATE_API, FORMAT_PROVIDER} from '../../../../misc/tokens';
import {DateApi} from '../../../../services';
import {FormatProvider} from '../../../../interfaces';

/**
 * Component used for displaying month calendar
 */
@Component(
{
    selector: 'month-calendar',
    templateUrl: 'monthCalendar.component.html',
    providers:
    [
        EventParser,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthCalendarComponent<TDate = unknown, TEvent = unknown> implements OnInit, OnChanges
{
    //######################### protected properties - template bindings #########################

    /**
     * Aspect ratio for displayed calendar day cell
     */
    protected dayAspectRatioValue: number = CalendarDayAspectRatio.ThreeToTwo;

    /**
     * Data that represents calendar data
     */
    protected calendarData: Dictionary<CalendarDayData<TDate, TEvent>[]> = {};

    /**
     * Calendar day template to be used
     */
    protected get calendarDayTemplate(): TemplateRef<CalendarDayTemplateContext>
    {
        return this.customCalendarDayTemplate ?? this.defaultCalendarDayTemplate;
    }

    /**
     * Array of weekday names
     */
    protected weekDayNames: string[] = [];

    //######################### protected properties - children #########################

    /**
     * Default calendar day template
     */
    @ViewChild(CalendarDayTemplateDirective, {static: true, read: TemplateRef})
    protected defaultCalendarDayTemplate!: TemplateRef<CalendarDayTemplateContext>;

    /**
     * Custom calendar day template
     */
    @ContentChild(CalendarDayTemplateDirective, {static: true, read: TemplateRef})
    protected customCalendarDayTemplate: TemplateRef<CalendarDayTemplateContext>|undefined|null;

    //######################### public properties - inputs #########################

    /**
     * Indication that week number should be displayed
     */
    @Input()
    public showWeekNumber: boolean = false;

    /**
     * Date that should be displayed in month calendar
     */
    @Input()
    public display: TDate|undefined|null;

    /**
     * Format for displaying week day names
     */
    @Input()
    public weekDayName: MonthCalendarDayFormat = MonthCalendarDayFormat.Short;

    /**
     * Aspect ratio for displayed calendar day cell
     */
    @Input()
    public get dayAspectRatio(): number
    {
        return this.dayAspectRatioValue;
    }
    public set dayAspectRatio(value: number)
    {
        if(isString(value))
        {
            this.dayAspectRatioValue = CalendarDayAspectRatio[value] as unknown as number;

            return;
        }

        this.dayAspectRatioValue = value;
    }

    /**
     * Array of events that should be displayed
     */
    @Input()
    public events: EventData<TDate, TEvent>[] = [];

    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) protected formatProvider: FormatProvider,
                protected eventParser: EventParser<TDate, TEvent>,)
    {
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        this.initWeekdayNames();
        this.initializeDisplayCalendar();
    }

    //######################### public methods - implementation of OnChanges #########################

    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(nameof<MonthCalendarComponent>('weekDayName') in changes)
        {
            this.initWeekdayNames();
        }

        if(nameof<MonthCalendarComponent>('display') in changes)
        {
            this.initializeDisplayCalendar();
        }

        if(nameof<MonthCalendarComponent>('events') in changes && !(nameof<MonthCalendarComponent>('display') in changes))
        {
            this.initAndAttachEventData();
        }
    }

    //######################### protected methods #########################

    /**
     * Initialize weekday names
     */
    protected initWeekdayNames(): void
    {
        this.weekDayNames = [];
        const dateApi = this.dateApi.now().startOfWeek();

        switch(this.weekDayName)
        {
            default:
            // case MonthCalendarDayFormat.None:
            {
                for(let x = 0; x < 7; x++)
                {
                    this.weekDayNames.push('');
                }

                break;
            }
            case MonthCalendarDayFormat.Short:
            {
                for(let x = 0; x < 7; x++)
                {
                    this.weekDayNames.push(dateApi.format(this.formatProvider.dayNameShort));
                    dateApi.addDays(1);
                }

                break;
            }
            case MonthCalendarDayFormat.Full:
            {
                for(let x = 0; x < 7; x++)
                {
                    this.weekDayNames.push(dateApi.format(this.formatProvider.dayName));
                    dateApi.addDays(1);
                }

                break;
            }
        }
    }

    /**
     * Initialize date for calendar that should be displayed
     */
    protected initializeDisplayCalendar(): void
    {
        this.display ??= this.dateApi.now().value;

        const workDate = this.dateApi.getValue(this.display);

        workDate.startOfMonth()
            .startOfWeek();

        this.calendarData = {};

        do
        {
            const weekData: CalendarDayData<TDate, TEvent>[] = this.calendarData[workDate.format(this.formatProvider.week)] = [];

            for(let x = 0; x < 7; x++)
            {
                weekData.push(
                {
                    date: workDate.value,
                    day: workDate.dayOfMonth(),
                    events: [],
                    isCurrentMonth: workDate.isSameMonth(this.display),
                    isWeekend: workDate.isWeekend(),
                    week: +workDate.format(this.formatProvider.week),
                });

                workDate.addDays(1);
            }

            workDate.startOfWeek();
        }
        while(workDate.isSameMonth(this.display));

        this.initAndAttachEventData();
    }

    /**
     * Initialize and attaches event data
     */
    protected initAndAttachEventData(): void
    {
        const events = this.eventParser.getEventsPerDay(this.events);

        for(const week in this.calendarData)
        {
            const weekData = this.calendarData[week];

            for(const day of weekData)
            {
                const found = events.find(itm => this.dateApi.getValue(itm[0]).isSame(day.date));
                day.events = found?.[1] ?? [];
            }
        }
    }

    //######################### ng language server #########################

    /**
     * Custom input type for `weekDayName` input
     */
    public static ngAcceptInputType_weekDayName: keyof typeof MonthCalendarDayFormat;

    /**
     * Custom input type for `dayAspectRatio` input
     */
    public static ngAcceptInputType_dayAspectRatio: keyof typeof CalendarDayAspectRatio|number;
}