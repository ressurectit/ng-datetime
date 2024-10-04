import {NgModule} from '@angular/core';

import {DateTimeControlValueAccessorDirective, DateTimeDirective, DateTimeInputDirective, DateTimeMaxValidatorDirective, DateTimeMinValidatorDirective, DateTimeValidatorDirective} from '../directives';

/**
 * Module for basic date time directives, components, pipes
 */
@NgModule(
{
    imports:
    [
        DateTimeDirective,
        DateTimeControlValueAccessorDirective,
        DateTimeInputDirective,
        DateTimeMaxValidatorDirective,
        DateTimeMinValidatorDirective,
        DateTimeValidatorDirective,
    ],
    exports:
    [
        DateTimeDirective,
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