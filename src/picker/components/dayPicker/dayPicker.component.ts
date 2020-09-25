import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API} from '../../../misc/tokens';
import {DateApi, DateApiObject} from '../../../services/dateApi.interface';
import {DateTimePicker, DayData} from '../../misc/datetimePicker.interface';

/**
 * Component used for displaying day picker
 */
@Component(
{
    selector: 'date-time-day-picker',
    templateUrl: 'dayPicker.component.html',
    styleUrls: ['dayPicker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeDayPickerComponent<TDate = any> implements DateTimePicker
{
    //######################### protected fields #########################

    /**
     * Current value of datetime
     */
    protected _value: DateTimeValue<TDate>|null = null;

    /**
     * Occurs when value changes
     */
    protected _valueChange: Subject<void> = new Subject<void>();
    
    /**
     * Occurs when user scales up
     */
    protected _scaleUp: Subject<TDate> = new Subject<TDate>();

    /**
     * Occurs when user scales down
     */
    protected _scaleDown: Subject<TDate> = new Subject<TDate>();

    /**
     * Currently displayed period of time
     */
    protected _display!: DateApiObject<TDate>;

    /**
     * Stored this month data
     */
    protected _thisMonthData: DayData<TDate>[] = [];

    //######################### public properties - implementation of DateTimePicker #########################

    /**
     * Gets current value of datetime
     */
    public get value(): DateTimeValue<TDate>|null
    {
        return this._value;
    }

    /**
     * Occurs when value changes
     */
    public get valueChange(): Observable<void>
    {
        return this._valueChange.asObservable();
    }

    /**
     * Occurs when user scales up
     */
    public get scaleUp(): Observable<TDate>
    {
        return this._scaleUp.asObservable();
    }

    /**
     * Occurs when user scales down
     */
    public get scaleDown(): Observable<TDate>
    {
        return this._scaleDown.asObservable();
    }

    //######################### public properties - template bindings #########################

    /**
     * Array of days to be displayed
     * @internal
     */
    public days: DayData<TDate>[] = [];

    /**
     * Names of days
     * @internal
     */
    public weekdays: string[] = [];

    /**
     * Date api instance for displayed date
     * @internal
     */
    public displayDateApi: DateApiObject<TDate>|null = null;

    /**
     * Indication whether can go up in period
     * @internal
     */
    public canGoUp: boolean = false;

    /**
     * Indication whether can go down in period
     * @internal
     */
    public canGoDown: boolean = false;

    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected _dateApi: DateApi<TDate>,
                protected _changeDetector: ChangeDetectorRef)
    {
        this.weekdays = this._dateApi.weekdaysShort();
    }

    //######################### public methods - template bindings #########################

    /**
     * Changes displayed month to next month
     * @param event - Event that occured
     * @internal
     */
    public nextMonth(_event: Event)
    {
        this.displayDateApi?.addMonths(1);

        this.display(this.displayDateApi!);
    }

    /**
     * Changes displayed month to previous month
     * @internal
     */
    public previousMonth(_event: Event)
    {
        this.displayDateApi!.subtractMonths(1);

        this.display(this.displayDateApi!);
    }

    /**
     * Selects day
     * @param day - Selects day 
     * @internal
     */
    public select(day: DayData<TDate>)
    {
        this._setDay(day);

        this._value =
        {
            from: day.date,
            to: day.date
        };
        
        this._valueChange.next();

        if(day.otherMonth)
        {
            this.display(this._dateApi.getValue(day.date));
        }
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Sets value of datetime picker
     * @param value - Value to be set to this picker
     */
    public setValue(value: DateTimeValue<TDate>|null): void
    {
        this._value = value;

        //value is present
        if(this._value && this.displayDateApi)
        {
            let val = this._dateApi.getValue(this._value.from);

            if(!val.isSameMonth(this.displayDateApi.value))
            {
                this.display(val);

                return;
            }

            let day = this._thisMonthData[val.dayOfMonth() - 1];

            //was initialized
            if(day)
            {
                this._setDay(day);
            }
        }
    }

    /**
     * Set displays date to be displayed
     * @param value - Value that identifies period that is going to be displayed
     */
    public display(value: DateApiObject<TDate>): void
    {
        this._display = value;
        this.displayDateApi = value;
        this.days = [];
        this._thisMonthData = [];
        let currentMonthDate = this.displayDateApi.value;
        let today = this._dateApi.now().value;

        this.displayDateApi
            .startOfMonth()
            .updateOriginal()
            .startOfWeek();

        do
        {
            for(let x = 0; x < 7; x++)
            {
                let day = this.displayDateApi.dayOfMonth();
                let otherMonth = !this.displayDateApi.isSameMonth(currentMonthDate);
                let data = 
                {
                    active: false,
                    betweenActive: false,
                    date: this.displayDateApi.value,
                    otherMonth: otherMonth,
                    today: this.displayDateApi.isSameDay(today),
                    weekend: this.displayDateApi.isWeekend(),
                    day: day
                };

                this.days.push(data);

                if(!otherMonth)
                {
                    this._thisMonthData.push(data);
                }

                this.displayDateApi.addDays(1);
            }
        }
        while(this.displayDateApi.isSameMonth(currentMonthDate))

        this.displayDateApi.resetOriginal();

        //set value if exists
        if(this._value)
        {
            this.setValue(this._value);
        }
    }

    /**
     * Sets indication whether can go down
     * @param value - Indication whether can go down in period
     */
    public setCanGoDown(value: boolean): void
    {
        this.canGoDown = value;
    }

    /**
     * Sets indication whether can go up
     * @param value - Indication whether can go up in period
     */
    public setCanGoUp(value: boolean): void
    {
        this.canGoUp = value;
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    //######################### protected methods #########################

    /**
     * Sets day as active
     * @param day - Day to be set as active
     */
    protected _setDay(day: DayData<TDate>)
    {
        this._thisMonthData.forEach(itm => itm.active = false);

        day.active = true;
    }
}