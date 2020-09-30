import {Component, ChangeDetectionStrategy} from '@angular/core';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DateApiObject} from '../../../services/dateApi.interface';
import {DateTimePicker, MonthData, PeriodData} from '../../misc/datetimePicker.interface';
import {PickerBaseComponent} from '../pickerBase.component';

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
export class DateTimeMonthPickerComponent<TDate = any> extends PickerBaseComponent<TDate, MonthData<TDate>> implements DateTimePicker<TDate>
{
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

    /**
     * Selects month
     * @param event - Event that occured
     * @param month - Selected month
     * @internal
     */
    public select(event: Event, month: MonthData<TDate>)
    {
        event.preventDefault();

        //handle selection of value
        if(!this.canGoDown)
        {
            this._setPeriod(month);

            this._value =
            {
                from: month.date,
                to: this._dateApi.getValue(month.date).endOfMonth().value
            };

            this._valueChange.next();

            return;
        }

        this._scaleDown.next(month.date);
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
        if(this._value && this.displayDate)
        {
            let val = this._dateApi.getValue(this._value.from);

            //change picker to value
            if(!val.isSameYear(this.displayDate.value))
            {
                this.display(val);

                return;
            }

            let month = this.periodData[val.month()];

            //was initialized
            if(month)
            {
                this._setPeriod(month);
            }
        }
    }

    /**
     * Set displays date to be displayed
     * @param value - Value that identifies period that is going to be displayed
     */
    public display(value: DateApiObject<TDate>): void
    {
        this.displayDate = value;

        let monthOfYear = this.displayDate.startOfYear().updateOriginal();
        this.periodData = [];

        for(let x = 0; x < 12; x++)
        {
            this.periodData.push(
            {
                active: false,
                date: monthOfYear.value,
                name: monthOfYear.format('MMM')
            });

            monthOfYear.addMonths(1);
        }

        this.displayDate.resetOriginal();

        //set value if exists
        if(this._value && (this.displayDate.isSameYear(this._value.from) || this.displayDate.isSameYear(this._value.to)))
        {
            this.setValue(this._value);
        }
    }

    //######################### protected methods #########################

    //TODO - move to base

    /**
     * Sets period as active
     * @param period - Period to be set as active
     */
    protected _setPeriod(period: PeriodData<TDate>)
    {
        this.periodData.forEach(itm => itm.active = false);

        period.active = true;
    }
}