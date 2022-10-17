import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';
import {extend} from '@jscrpt/common';

import {DATE_API} from '../../../../misc/tokens';
import {DateApi, DateApiObject} from '../../../../services/dateApi/dateApi.interface';
import {DateTimePicker, MonthData, PeriodData} from '../../misc/datetimePicker.interface';
import {PickerBaseComponent} from '../pickerBase.component';
import {MonthPickerCssClasses} from './monthPicker.interfaces';

/**
 * Default styles for picker
 */
const defaultStyles: MonthPickerCssClasses =
{
    periodSelection: 'period',
    previousPeriod: 'fas fa-angle-left clickable',
    nextPeriod: 'fas fa-angle-right clickable',
    periodValue: 'period-value',
    periodData: 'period-data',
    periodDatum: 'period-datum clickable',
    clickable: 'clickable'
};

/**
 * Component used for displaying month picker
 */
@Component(
{
    selector: 'date-time-month-picker',
    templateUrl: 'monthPicker.component.html',
    styleUrls: ['monthPicker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeMonthPickerComponent<TDate = any> extends PickerBaseComponent<TDate, MonthData<TDate>, MonthPickerCssClasses> implements DateTimePicker<TDate, MonthPickerCssClasses>
{
    //######################### constructor #########################
    constructor(@Inject(DATE_API) dateApi: DateApi<TDate>,
                changeDetector: ChangeDetectorRef)
    {
        super(dateApi, changeDetector);

        this.cssClasses = extend(true, {}, defaultStyles);
    }

    //######################### public methods - template bindings #########################

    /**
     * Changes displayed year to next year
     * @param event - Event that occured
     * @internal
     */
    public nextYear(event: Event)
    {
        event.preventDefault();
        this.displayDate!.addYears(1);

        this.display(this.displayDate!);
    }

    /**
     * Changes displayed year to previous year
     * @param event - Event that occured
     * @internal
     */
    public previousYear(event: Event)
    {
        event.preventDefault();
        this.displayDate!.subtractYears(1);

        this.display(this.displayDate!);
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Set displays date to be displayed
     * @param value - Value that identifies period that is going to be displayed
     */
    public display(value: DateApiObject<TDate>): void
    {
        this.displayDate = value;

        const monthOfYear = this.displayDate.startOfYear().updateOriginal();
        this.periodData = [];

        for(let x = 0; x < 12; x++)
        {
            this.periodData.push(
            {
                active: false,
                disabled: false,
                date: monthOfYear.value,
                name: monthOfYear.format('MMM')
            });

            monthOfYear.addMonths(1);
        }

        this.displayDate.resetOriginal();
        this._updateMinMax();

        //set value if exists
        if(this._value && (this.displayDate.isSameYear(this._value.from) || this.displayDate.isSameYear(this._value.to)))
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
        return this._dateApi.getValue(period.date).endOfMonth().value;
    }

    /**
     * Tests whether provided value is in same period as displayed picker
     * @param val - Tested value for same period as displayed picker
     */
    protected _isSamePeriodAsDisplayed(val: DateApiObject<TDate>): boolean
    {
        return val.isSameYear(this.displayDate!.value);
    }

    /**
     * Tests whether provided value is in same period target value
     * @param val - Tested value
     * @param target - Target value to be tested against
     */
    protected _isSamePeriod(val: DateApiObject<TDate>, target: TDate): boolean
    {
        return val.isSameMonth(target);
    }

    /**
     * Gets period data for specified value
     * @param val - Value for which is period data obtained
     */
    protected _getPeriodData(val: DateApiObject<TDate>): PeriodData<TDate>
    {
        return this.periodData[val.month()];
    }
}