import {Component, ChangeDetectionStrategy} from '@angular/core';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DateApiObject} from '../../../services/dateApi.interface';
import {DateTimePicker, YearData} from '../../misc/datetimePicker.interface';
import {PickerBaseComponent} from '../pickerBase.component';

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
export class DateTimeYearPickerComponent<TDate = any> extends PickerBaseComponent<TDate, YearData<TDate>> implements DateTimePicker<TDate>
{
    //######################### public properties - template bindings #########################

    /**
     * Displayed decade period
     * @internal
     */
    public period: string = '';

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

    /**
     * Selects year
     * @param event - Event that occured
     * @param year - Selected year
     * @internal
     */
    public select(event: Event, year: YearData<TDate>)
    {
        event.preventDefault();

        //handle selection of value
        if(!this.canGoDown)
        {
            this._setYear(year);

            this._value =
            {
                from: year.date,
                to: this._dateApi.getValue(year.date).endOfYear().value
            };

            this._valueChange.next();

            return;
        }

        this._scaleDown.next(year.date);
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
            if(!val.isSameDecade(this.displayDate.value))
            {
                this.display(val);

                return;
            }

            let year = this.periodData[val.year() % 10];

            //was initialized
            if(year)
            {
                this._setYear(year);
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
                date: this.displayDate.value,
                value: year
            });

            year++;
            this.displayDate.addYears(1);
        }

        this.displayDate.resetOriginal();
        this.period = `${this.displayDate.year()} - ${this.displayDate.year() + 10}`;

        //set value if exists
        if(this._value && (this.displayDate.isSameDecade(this._value.from) || this.displayDate.isSameDecade(this._value.to)))
        {
            this.setValue(this._value);
        }
    }

    //######################### protected methods #########################

    /**
     * Sets year as active
     * @param year - Year to be set as active
     */
    protected _setYear(year: YearData<TDate>)
    {
        this.periodData.forEach(itm => itm.active = false);

        year.active = true;
    }
}