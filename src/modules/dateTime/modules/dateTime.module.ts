import {NgModule} from '@angular/core';

import {DateTimeControlValueAccessorDirective, DateTimeInputDirective, DateTimeValidatorDirective} from '../directives';

/**
 * Module for basic date time directives, components, pipes
 */
@NgModule(
{
    declarations:
    [
        DateTimeControlValueAccessorDirective,
        DateTimeInputDirective,
        DateTimeValidatorDirective,
    ],
    exports:
    [
        DateTimeControlValueAccessorDirective,
        DateTimeInputDirective,
        DateTimeValidatorDirective,
    ],
})
export class DateTimeModule
{
}