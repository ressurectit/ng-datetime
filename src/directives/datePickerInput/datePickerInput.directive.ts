import {Directive} from '@angular/core';

import {DateTimeInputSADirective, DateTimePickerSADirective} from '../../modules';
import {DateTimeInputHandlerSADirective} from '../dateTimeInputHandler/dateTimeInputHandler.directive';

/**
 * Directive that combines date picker with date input
 */
@Directive(
{
    selector: 'input[dateTime][datePickerInput]',
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
        {
            directive: DateTimeInputHandlerSADirective,
        },
    ],
})
export class DatePickerInputSADirective
{
}