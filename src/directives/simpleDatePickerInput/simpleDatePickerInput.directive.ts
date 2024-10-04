import {Directive} from '@angular/core';

import {DateTimeInputDirective, DateTimePickerDirective} from '../../modules';
import {SimpleDateTimeInputHandlerDirective} from '../simpleDateTimeInputHandler/simpleDateTimeInputHandler.directive';

/**
 * Directive that combines date picker with simple date input
 */
@Directive(
{
    selector: 'input[dateTime][simpleDatePickerInput]',
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
            directive: SimpleDateTimeInputHandlerDirective,
        },
    ],
})
export class SimpleDatePickerInputDirective
{
}