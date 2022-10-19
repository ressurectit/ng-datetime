import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';
import {extend} from '@jscrpt/common';

import {DATE_API} from '../../../../misc/tokens';
import {DateApi, DateApiObject} from '../../../../services/dateApi/dateApi.interface';
import {DateTimeLegacyPicker, PeriodData, YearData} from '../../misc/datetimePicker.interface';
import {PickerBaseComponent} from '../pickerBase.component';
import {YearPickerCssClasses} from './yearPicker.interfaces';

/**
 * Default styles for picker
 */
const defaultStyles: YearPickerCssClasses =
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
 * Component used for displaying year picker
 */
@Component(
{
    selector: 'date-time-year-picker',
    templateUrl: 'yearPicker.component.html',
    styleUrls: ['yearPicker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeYearPickerComponent<TDate = any> extends PickerBaseComponent<TDate, YearData<TDate>, YearPickerCssClasses> implements DateTimeLegacyPicker<TDate, YearPickerCssClasses>
{
    //######################### public properties - template bindings #########################

    /**
     * Displayed decade period
     * @internal
     */
    public period: string = '';

    //######################### constructor #########################
    constructor(@Inject(DATE_API) dateApi: DateApi<TDate>,
                changeDetector: ChangeDetectorRef)
    {
        super(dateApi, changeDetector);

        this.cssClasses = extend(true, {}, defaultStyles);
    }

    //######################### public methods - template bindings #########################

    /**
     * Changes displayed decade to next decade
     * @param event - Event that occured
     * @internal
     */
    public nextDecade(event: Event)
    {
        event.preventDefault();
        this.displayDate!.addYears(10);

        this.display(this.displayDate!);
    }

    /**
     * Changes displayed decade to previous decade
     * @param event - Event that occured
     * @internal
     */
    public previousDecade(event: Event)
    {
        event.preventDefault();
        this.displayDate!.subtractYears(10);

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

        let year = this.displayDate.startOfYear().year();

        while(year % 10 !== 0)
        {
            year--;
        }

        this.displayDate.year(year).updateOriginal();

        this.periodData = [];

        for(let x = 0; x < 10; x++)
        {
            this.periodData.push(
            {
                active: false,
                disabled: false,
                date: this.displayDate.value,
                value: year
            });

            year++;
            this.displayDate.addYears(1);
        }

        this.displayDate.resetOriginal();
        this._updateMinMax();
        this.period = `${this.displayDate.year()} - ${this.displayDate.year() + 10}`;

        //set value if exists
        if(this._value && (this.displayDate.isSameDecade(this._value.from!) || this.displayDate.isSameDecade(this._value.to!)))
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
        return this._dateApi.getValue(period.date).endOfYear().value;
    }

    /**
     * Tests whether provided value is in same period as displayed picker
     * @param val - Tested value for same period as displayed picker
     */
    protected _isSamePeriodAsDisplayed(val: DateApiObject<TDate>): boolean
    {
        return val.isSameDecade(this.displayDate!.value);
    }

    /**
     * Tests whether provided value is in same period target value
     * @param val - Tested value
     * @param target - Target value to be tested against
     */
    protected _isSamePeriod(val: DateApiObject<TDate>, target: TDate): boolean
    {
        return val.isSameYear(target);
    }

    /**
     * Gets period data for specified value
     * @param val - Value for which is period data obtained
     */
    protected _getPeriodData(val: DateApiObject<TDate>): PeriodData<TDate>
    {
        return this.periodData[val.year() % 10];
    }
}