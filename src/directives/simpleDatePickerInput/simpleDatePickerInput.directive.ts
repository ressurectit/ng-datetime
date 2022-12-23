import {Directive} from '@angular/core';

import {DateTimeInputSADirective, DateTimePickerSADirective} from '../../modules';

/**
 * Directive that combines date picker with simple date time input
 */
@Directive(
{
    selector: 'input[dateTime][simpleDatePickerInput]',
    standalone: true,
    hostDirectives:
    [
        {
            directive: DateTimePickerSADirective,
            inputs:
            [
                'withPickerOptions',
                'pickerOptions',
            ]
        },
        {
            directive: DateTimeInputSADirective,
        },
    ],
})
export class DatePickerInputSADirective
{
}