import {Directive} from '@angular/core';

import {RollerTimePickerComponent, DateTimePickerDirective, DayPickerComponent, MonthPickerComponent, YearPickerComponent, DateTimeDirective} from '../../modules';

/**
 * Directive that sets up usage of date time picker to use time format and time picker
 */
@Directive(
{
    selector: '[dateTime][withPicker][withTime]',
})
export class WithTimeDirective<TDate = unknown>
{
    //######################### constructor #########################
    constructor(picker: DateTimePickerDirective<TDate>,
                dateTime: DateTimeDirective<TDate>,)
    {
        picker.pickerOptions =
        {
            periodsDefinition:
            {
                time: RollerTimePickerComponent,
                day: DayPickerComponent,
                month: MonthPickerComponent,
                year: YearPickerComponent,
            },
        };

        dateTime.format = 'dateTime';
    }
}