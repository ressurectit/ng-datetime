import {NgModule} from '@angular/core';

import {DateTimeControlValueAccessorDirective, DateTimeInputDirective} from '../directives';

/**
 * Module for basic date time directives, components, pipes
 */
@NgModule(
{
    declarations:
    [
        DateTimeControlValueAccessorDirective,
        DateTimeInputDirective,
    ],
    exports:
    [
        DateTimeControlValueAccessorDirective,
        DateTimeInputDirective,
    ],
})
export class DateTimeModule
{
}