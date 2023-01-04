import {Directive} from '@angular/core';

import {DatePickerInputSADirective} from '../datePickerInput/datePickerInput.directive';
import {WithTimeSADirective} from '../withTime/withTime.directive';

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
            directive: DatePickerInputSADirective,
        },
        {
            directive: WithTimeSADirective,
        },
    ],
})
export class DateTimePickerInputSADirective
{
}