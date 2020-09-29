import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API} from '../../../misc/tokens';
import {DateApi, DateApiObject} from '../../../services/dateApi.interface';
import {DateTimePicker, MonthData} from '../../misc/datetimePicker.interface';
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
    //######################### constructor #########################
    constructor(@Inject(DATE_API) dateApi: DateApi<TDate>,
                changeDetector: ChangeDetectorRef)
    {
        super(dateApi, changeDetector);

        let monthOfYear = this._dateApi.now().startOfYear();

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
        this.displayDateApi!.addYears(1);

        this.display(this.displayDateApi!);
    }

    /**
     * Changes displayed year to previous year
     * @param event - Event that occured
     * @internal
     */
    public previousYear(event: Event)
    {
        event.preventDefault();
        this.displayDateApi!.subtractYears(1);

        this.display(this.displayDateApi!);
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

        if(!this.canGoDown)
        {
            return;
        }

        this._scaleDown.next(month.date);
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
        this._display = value;
        this.displayDateApi = value;
    }
}