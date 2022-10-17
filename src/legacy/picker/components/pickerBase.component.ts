import {ChangeDetectorRef, Directive, Inject} from '@angular/core';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API} from '../../../misc/tokens';
import {DateApi, DateApiObject} from '../../../services/dateApi.interface';
import {DateTimePicker, PeriodData} from '../misc/datetimePicker.interface';
import {PickerImplBaseComponent} from './pickerImplBase.component';

/**
 * Base class used as base for picker
 */
@Directive()
export abstract class PickerBaseComponent<TDate = any, TDateData extends PeriodData<TDate> = any, TCssClasses = object> extends PickerImplBaseComponent<TDate, TCssClasses> implements DateTimePicker<TDate, TCssClasses>
{
    //######################### protected fields #########################

    /**
     * Value of originaly set hour
     */
    protected _originalHour: number = 0;

    /**
     * Value of originaly set minute
     */
    protected _originalMinute: number = 0;

    //######################### public properties - template bindings #########################

    /**
     * Array of period data to be displayed
     * @internal
     */
    public periodData: TDateData[] = [];

    //######################### constructor #########################
    constructor(@Inject(DATE_API) dateApi: DateApi<TDate>,
                changeDetector: ChangeDetectorRef)
    {
        super(dateApi, changeDetector);
    }

    //######################### public methods - template bindings #########################

    /**
     * Selects period
     * @param event - Event that occured
     * @param period - Selected period
     * @internal
     */
    public select(event: Event, period: PeriodData<TDate>): void
    {
        event.preventDefault();

        if(period.disabled)
        {
            return;
        }

        //handle selection of value
        if(!this.canGoDown)
        {
            this._setPeriod(period);

            this._value =
            {
                from: period.date,
                to: this._endOfPeriod(period)
            };

            this._valueChange.next();

            return;
        }

        this._scaleDown.next(period.date);
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Sets minimal possible value for picker, that can be picked
     * @param value - Minimal possible value that can be picked
     */
    public setMinValue(value: TDate|null): void
    {
        this._minValue = value;
        this._updateMinMax();
    }

    /**
     * Sets maximal possible value for picker, that can be picked
     * @param value - Maximal possible value that can be picked
     */
    public setMaxValue(value: TDate|null): void
    {
        this._maxValue = value;
        this._updateMinMax();
    }

    /**
     * Sets value of datetime picker
     * @param value - Value to be set to this picker
     */
    public setValue(value: DateTimeValue<TDate>|null): void
    {
        this._value = value;

        if(this._value)
        {
            this._originalHour = this._dateApi.getValue(this._value.from).hour();
            this._originalMinute = this._dateApi.getValue(this._value.from).minute();
        }

        //value is present
        if(this._value && this.displayDate)
        {
            const val = this._dateApi.getValue(this._value.from);

            //change picker to value
            if(!this._isSamePeriodAsDisplayed(val))
            {
                this.display(val);

                return;
            }

            const period = this._getPeriodData(val);

            //was initialized
            if(period)
            {
                this._setPeriod(period);
            }
        }
    }

    //######################### protected methods #########################

    /**
     * Sets period as active
     * @param period - Period to be set as active
     */
    protected _setPeriod(period: PeriodData<TDate>): void
    {
        this.periodData.forEach(itm => itm.active = false);

        period.active = true;
    }

    /**
     * Updates minimal and maximal value for picker
     */
    protected _updateMinMax(): void
    {
        if(!this.periodData.length)
        {
            return;
        }

        //no min, no max
        if(!this._minValue && !this._maxValue)
        {
            this.periodData.forEach(itm => itm.disabled = false);

            return;
        }

        const minDateApi = this._minValue ? this._dateApi.getValue(this._minValue) : null;
        const maxDateApi = this._maxValue ? this._dateApi.getValue(this._maxValue) : null;
        let restAfter = false;

        this.periodData.forEach(period =>
        {
            if(!!minDateApi && minDateApi.isAfter(period.date) && !this._isSamePeriod(minDateApi, period.date))
            {
                period.disabled = true;
            }

            if(restAfter || (!!maxDateApi && maxDateApi.isBefore(period.date) && !this._isSamePeriod(maxDateApi, period.date)))
            {
                restAfter = true;
                period.disabled = true;
            }
        });
    }

    /**
     * Obtains end of period
     * @param period - Period for which should be end obtained
     */
    protected abstract _endOfPeriod(period: PeriodData<TDate>): TDate;

    /**
     * Tests whether provided value is in same period as displayed picker
     * @param val - Tested value for same period as displayed picker
     */
    protected abstract _isSamePeriodAsDisplayed(val: DateApiObject<TDate>): boolean;

    /**
     * Tests whether provided value is in same period target value
     * @param val - Tested value
     * @param target - Target value to be tested against
     */
    protected abstract _isSamePeriod(val: DateApiObject<TDate>, target: TDate): boolean;

    /**
     * Gets period data for specified value
     * @param val - Value for which is period data obtained
     */
    protected abstract _getPeriodData(val: DateApiObject<TDate>): PeriodData<TDate>;
}