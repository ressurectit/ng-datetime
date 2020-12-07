import {NgModule} from '@angular/core';
import {CommonModule as AngularCommonModule} from '@angular/common';
import {CommonModule} from '@anglr/common';

import {DateTimePickerComponent} from '../components/picker/picker.component';
import {DateTimeDayPickerComponent} from '../components/dayPicker/dayPicker.component';
import {DateTimeMonthPickerComponent} from '../components/monthPicker/monthPicker.component';
import {DateTimeYearPickerComponent} from '../components/yearPicker/yearPicker.component';

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
        DateTimeMonthPickerComponent,
        DateTimeYearPickerComponent
    ],
    exports:
    [
        DateTimePickerComponent
    ]
})
export class DateTimePickerModule
{
}