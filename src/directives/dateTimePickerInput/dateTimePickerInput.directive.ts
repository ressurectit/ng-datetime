import {Directive} from '@angular/core';

import {DatePickerInputDirective} from '../datePickerInput/datePickerInput.directive';
import {WithTimeDirective} from '../withTime/withTime.directive';

/**
 * Directive that combines date time picker with date time input
 */
@Directive(
{
    selector: 'input[dateTime][dateTimePickerInput]',
    standalone: true,
    hostDirectives:
    [
        {
            directive: DatePickerInputDirective,
        },
        {
            directive: WithTimeDirective,
        },
    ],
})
export class DateTimePickerInputDirective
{
}