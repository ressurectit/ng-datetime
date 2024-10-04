import {Directive} from '@angular/core';

import {SimpleDatePickerInputDirective} from '../simpleDatePickerInput/simpleDatePickerInput.directive';
import {WithTimeDirective} from '../withTime/withTime.directive';

/**
 * Directive that combines date time picker with simple date time input
 */
@Directive(
{
    selector: 'input[dateTime][simpleDateTimePickerInput]',
    standalone: true,
    hostDirectives:
    [
        {
            directive: SimpleDatePickerInputDirective,
        },
        {
            directive: WithTimeDirective,
        },
    ],
})
export class SimpleDateTimePickerInputDirective
{
}