import {NgModule} from '@angular/core';

import {DateTimeControlValueAccessorDirective, DateTimeInputDirective, DateTimeMaxValidatorDirective, DateTimeMinValidatorDirective, DateTimeValidatorDirective} from '../directives';

/**
 * Module for basic date time directives, components, pipes
 */
@NgModule(
{
    declarations:
    [
        DateTimeControlValueAccessorDirective,
        DateTimeInputDirective,
        DateTimeMaxValidatorDirective,
        DateTimeMinValidatorDirective,
        DateTimeValidatorDirective,
    ],
    exports:
    [
        DateTimeControlValueAccessorDirective,
        DateTimeInputDirective,
        DateTimeMaxValidatorDirective,
        DateTimeMinValidatorDirective,
        DateTimeValidatorDirective,
    ],
})
export class DateTimeModule
{
}