import {NgModule} from '@angular/core';

import {DateTimePickerComponent} from '../components';
import {DateTimePickerSADirective} from '../directives';

/**
 * Module for components that are used as date time picker
 */
@NgModule(
{
    imports:
    [
        DateTimePickerSADirective,
    ],
    declarations:
    [
        DateTimePickerComponent,
    ],
    exports:
    [
        DateTimePickerComponent,
        DateTimePickerSADirective,
    ],
})
export class DateTimePickerModule
{
}