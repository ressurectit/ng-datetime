import {NgModule} from '@angular/core';

import {DateTimeControlValueAccessorSADirective, DateTimeSADirective, DateTimeInputSADirective, DateTimeMaxValidatorSADirective, DateTimeMinValidatorSADirective, DateTimeValidatorSADirective} from '../directives';

/**
 * Module for basic date time directives, components, pipes
 */
@NgModule(
{
    imports:
    [
        DateTimeSADirective,
        DateTimeControlValueAccessorSADirective,
        DateTimeInputSADirective,
        DateTimeMaxValidatorSADirective,
        DateTimeMinValidatorSADirective,
        DateTimeValidatorSADirective,
    ],
    exports:
    [
        DateTimeSADirective,
        DateTimeControlValueAccessorSADirective,
        DateTimeInputSADirective,
        DateTimeMaxValidatorSADirective,
        DateTimeMinValidatorSADirective,
        DateTimeValidatorSADirective,
    ],
})
export class DateTimeModule
{
}