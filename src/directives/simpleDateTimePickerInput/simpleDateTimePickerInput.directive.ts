import {Directive} from '@angular/core';

import {SimpleDatePickerInputSADirective} from '../simpleDatePickerInput/simpleDatePickerInput.directive';
import {WithTimeSADirective} from '../withTime/withTime.directive';

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
            directive: SimpleDatePickerInputSADirective,
        },
        {
            directive: WithTimeSADirective,
        },
    ],
})
export class SimpleDateTimePickerInputSADirective
{
}