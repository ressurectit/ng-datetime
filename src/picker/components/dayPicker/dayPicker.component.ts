import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';
import {extend} from '@jscrpt/common';

import {DATE_API} from '../../../misc/tokens';
import {DateApi, DateApiObject} from '../../../services/dateApi.interface';
import {DateTimePicker, DayData, PeriodData} from '../../misc/datetimePicker.interface';
import {PickerBaseComponent} from '../pickerBase.component';
import {DayPickerCssClasses} from './dayPicker.interfaces';

/**
 * Default styles for picker
 */
const defaultStyles: DayPickerCssClasses =
{
    periodSelection: 'period',
    previousPeriod: 'fas fa-angle-left clickable',
    nextPeriod: 'fas fa-angle-right clickable',
    periodValue: 'period-value',
    periodData: 'period-data',
    periodDatum: 'period-datum clickable',
    weekdayName: 'weekday',
    clickable: 'clickable'
};

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
export class DateTimeDayPickerComponent<TDate = any> extends PickerBaseComponent<TDate, DayData<TDate>, DayPickerCssClasses> implements DateTimePicker<TDate, DayPickerCssClasses>
{
    //######################### protected fields #########################

    /**
     * Stored this picker month data
     */
    protected _thisMonthData: DayData<TDate>[] = [];

    //######################### public properties - template bindings #########################

    /**
     * Names of days
     * @internal
     */
    public weekdays: string[] = [];

    //######################### constructor #########################
    constructor(@Inject(DATE_API) dateApi: DateApi<TDate>,
                changeDetector: ChangeDetectorRef)
    {
        super(dateApi, changeDetector);

        this.cssClasses = extend(true, {}, defaultStyles);
        this.weekdays = this._dateApi.weekdaysShort();
    }

    //######################### public methods - template bindings #########################

    /**
     * Changes displayed period to "lower" period
     * @param event - Event that occured
     * @internal
     */
    public goDown(event: Event): void
    {
        event.preventDefault();

        if(!this.canGoDown)
        {
            return;
        }

        if(this.displayDate)
        {
            this._scaleDown.next(this.displayDate.value);
        }
    }

    /**
     * Changes displayed month to next month
     * @param event - Event that occured
     * @internal
     */
    public nextMonth(event: Event): void
    {
        event.preventDefault();
        this.displayDate!.addMonths(1);

        this.display(this.displayDate!);
    }

    /**
     * Changes displayed month to previous month
     * @param event - Event that occured
     * @internal
     */
    public previousMonth(event: Event): void
    {
        event.preventDefault();
        this.displayDate!.subtractMonths(1);

        this.display(this.displayDate!);
    }

    /**
     * Selects day
     * @param event - Event that occured
     * @param day - Selects day 
     * @internal
     */
    public override select(event: Event, day: DayData<TDate>): void
    {
        event.preventDefault();

        if(day.disabled)
        {
            return;
        }

        this._setPeriod(day);

        this._value =
        {
            from: day.date,
            to: this._endOfPeriod(day)
        };
        
        this._valueChange.next();

        if(day.otherMonth)
        {
            this.display(this._dateApi.getValue(day.date));
        }
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Set displays date to be displayed
     * @param value - Value that identifies period that is going to be displayed
     */
    public display(value: DateApiObject<TDate>): void
    {
        this.displayDate = value;
        this.periodData = [];
        this._thisMonthData = [];
        const currentMonthDate = this.displayDate.value;
        const today = this._dateApi.now().value;

        this.displayDate
            .startOfMonth()
            .updateOriginal()
            .startOfWeek();

        do
        {
            for(let x = 0; x < 7; x++)
            {
                const day = this.displayDate.dayOfMonth();
                const otherMonth = !this.displayDate.isSameMonth(currentMonthDate);
                const data = 
                {
                    active: false,
                    disabled: false,
                    betweenActive: false,
                    date: this.displayDate.value,
                    otherMonth: otherMonth,
                    today: this.displayDate.isSameDay(today),
                    weekend: this.displayDate.isWeekend(),
                    day: day
                };

                this.periodData.push(data);

                if(!otherMonth)
                {
                    this._thisMonthData.push(data);
                }

                this.displayDate.addDays(1);
            }
        }
        while(this.displayDate.isSameMonth(currentMonthDate));

        this.displayDate.resetOriginal();
        this._updateMinMax();

        //set value if exists
        if(this._value && (this.displayDate.isSameMonth(this._value.from) || this.displayDate.isSameMonth(this._value.to)))
        {
            this.setValue(this._value);
        }
    }

    //######################### protected methods #########################

    /**
     * Obtains end of period
     * @param period - Period for which should be end obtained
     */
    protected _endOfPeriod(period: PeriodData<TDate>): TDate
    {
        return this._dateApi.getValue(period.date).endOfDay().value;
    }

    /**
     * Tests whether provided value is in same period as displayed picker
     * @param val - Tested value for same period as displayed picker
     */
    protected _isSamePeriodAsDisplayed(val: DateApiObject<TDate>): boolean
    {
        return val.isSameMonth(this.displayDate!.value);
    }

    /**
     * Tests whether provided value is in same period target value
     * @param val - Tested value
     * @param target - Target value to be tested against
     */
    protected _isSamePeriod(val: DateApiObject<TDate>, target: TDate): boolean
    {
        return val.isSameDay(target);
    }

    /**
     * Gets period data for specified value
     * @param val - Value for which is period data obtained
     */
    protected _getPeriodData(val: DateApiObject<TDate>): PeriodData<TDate>
    {
        return this._thisMonthData[val.dayOfMonth() - 1];
    }
}