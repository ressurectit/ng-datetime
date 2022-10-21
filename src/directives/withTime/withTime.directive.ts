import {Directive} from '@angular/core';

import {RollerTimePickerSAComponent, DateTimePickerDirective, DayPickerSAComponent, MonthPickerSAComponent, YearPickerSAComponent, DateTimeDirective} from '../../modules';

/**
 * Directive that sets up usage of date time picker to use time format and time picker
 */
@Directive(
{
    selector: '[dateTime][withPicker][withTime]',
    standalone: true,
})
export class WithTimeSADirective<TDate = unknown>
{
    //######################### constructor #########################
    constructor(picker: DateTimePickerDirective<TDate>,
                dateTime: DateTimeDirective<TDate>,)
    {
        picker.pickerOptions = 
        {
            periodsDefinition:
            {
                'time': RollerTimePickerSAComponent,
                'day': DayPickerSAComponent,
                'month': MonthPickerSAComponent,
                'year': YearPickerSAComponent,
            },
        };

        dateTime.format = 'dateTime';
    }
}