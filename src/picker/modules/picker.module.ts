import {NgModule} from '@angular/core';
import {CommonModule as AngularCommonModule} from '@angular/common';
import {CommonModule} from '@anglr/common';

import {DateTimePickerComponent, DateTimeDayPickerComponent, DateTimeMonthPickerComponent} from '../components';

/**
 * Angular module for date time picker components
 */
@NgModule(
{
    imports:
    [
        AngularCommonModule,
        CommonModule
    ],
    declarations:
    [
        DateTimePickerComponent,
        DateTimeDayPickerComponent,
        DateTimeMonthPickerComponent
    ],
    exports:
    [
        DateTimePickerComponent
    ]
})
export class DateTimePickerModule
{
}