import {Component, ChangeDetectionStrategy, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DateTimePicker} from '../../interfaces';
import {DateTimePeriodPickerBase} from '../dateTimePeriodPickerBase';
import {DatePipesModule} from '../../../datePipes.module';
import {DayData} from '../../../../legacy/picker/interfaces';
import {DATE_API} from '../../../../misc/tokens';
import {DateApi} from '../../../../services';

/**
 * Component used for displaying day picker
 */
@Component(
{
    selector: 'day-picker',
    templateUrl: 'dayPicker.component.html',
    host:
    {
        '[class.date-time-period]': 'true',
    },
    standalone: true,
    imports:
    [
        CommonModule,
        DatePipesModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPickerSAComponent<TDate = unknown> extends DateTimePeriodPickerBase<TDate> implements DateTimePicker<TDate>
{
    //######################### protected properties - template bindings #########################

    /**
     * Names of days
     */
    protected weekdays: string[] = [];

    /**
     * Array of period data to be displayed
     * @internal
     */
    public periodData: DayData<TDate>[] = [];

    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected dateApi: DateApi<TDate>,)
    {
        super();
    }

    //######################### protected methods - template bindings #########################

    protected selectDay(dayData: DayData): void
    {
        if(!this.value)
        {
            this.value = this.displayDate?.clone() ?? this.dateApi.getValue(this.display ?? new Date());
        }

        //single value
        if(!Array.isArray(this.value))
        {
            this.value.dayOfMonth(dayData.day);
            this.value.updateOriginal();

            this.valueChangeSubject.next();
        }
    }

    /**
     * Changes displayed month to next month
     * @param event - Event that occured
     */
    protected nextMonth(event: Event): void
    {
        event.preventDefault();
        event.stopPropagation();
        this.displayDate?.addMonths(1);

        // this.display(this.displayDate);
    }

    /**
     * Changes displayed month to previous month
     * @param event - Event that occured
     */
    protected previousMonth(event: Event): void
    {
        event.preventDefault();
        event.stopPropagation();
        this.displayDate?.subtractMonths(1);

        // this.display(this.displayDate!);
    }
}