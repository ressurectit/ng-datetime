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

        if(!this.canGoDown)
        {
            return;
        }

        this._scaleDown.next(year.date);
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Sets value of datetime picker
     * @param value - Value to be set to this picker
     */
    public setValue(_value: DateTimeValue<TDate>|null): void
    {
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
    }
}