import {Directive} from '@angular/core';

import {DateTimeInputDirective, DateTimePickerDirective} from '../../modules';
import {DateTimeInputHandlerDirective} from '../dateTimeInputHandler/dateTimeInputHandler.directive';

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
            directive: DateTimePickerDirective,
            inputs:
            [
                'withPickerOptions',
                'pickerOptions',
            ]
        },
        {
            directive: DateTimeInputDirective,
        },
        {
            directive: DateTimeInputHandlerDirective,
        },
    ],
})
export class DatePickerInputDirective
{
}