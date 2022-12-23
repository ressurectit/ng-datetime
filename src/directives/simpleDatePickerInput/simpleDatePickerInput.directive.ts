import {Directive} from '@angular/core';

import {DateTimeInputSADirective, DateTimePickerSADirective} from '../../modules';
import {SimpleDateTimeInputHandlerSADirective} from '../simpleDateTimeInputHandler/simpleDateTimeInputHandler.directive';

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
            directive: SimpleDateTimeInputHandlerSADirective,
        },
    ],
})
export class SimpleDatePickerInputSADirective
{
}