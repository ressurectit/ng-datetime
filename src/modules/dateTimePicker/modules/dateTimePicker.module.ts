import {NgModule} from '@angular/core';

import {DateTimePickerComponent} from '../components';
import {DateTimePickerDirective} from '../directives';

/**
 * Module for components that are used as date time picker
 */
@NgModule(
{
    declarations:
    [
        DateTimePickerComponent,
        DateTimePickerDirective,
    ],
    exports:
    [
        DateTimePickerComponent,
        DateTimePickerDirective,
    ],
})
export class DateTimePickerModule
{
}