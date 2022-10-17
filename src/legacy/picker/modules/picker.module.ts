import {NgModule} from '@angular/core';
import {CommonModule as AngularCommonModule} from '@angular/common';
import {CommonDynamicModule, CastPipesModule, ClickOutsideModule, CommonUtilsModule} from '@anglr/common';

import {DateTimePickerComponent} from '../components/picker/picker.component';
import {DateTimeDayPickerComponent} from '../components/dayPicker/dayPicker.component';
import {DateTimeMonthPickerComponent} from '../components/monthPicker/monthPicker.component';
import {DateTimeYearPickerComponent} from '../components/yearPicker/yearPicker.component';
import {DatePipesModule} from '../../../modules/datePipes.module';
import {DateTimeRollerTimePickerComponent} from '../components/rollerTimePicker/rollerTimePicker.component';
import {LoopScrollDataDirective, LoopScrollDirective} from '../directives';

/**
 * Angular module for date time picker components
 */
@NgModule(
{
    imports:
    [
        AngularCommonModule,
        CommonDynamicModule,
        CommonUtilsModule,
        DatePipesModule,
        CastPipesModule,
        ClickOutsideModule,
    ],
    declarations:
    [
        DateTimePickerComponent,
        DateTimeRollerTimePickerComponent,
        DateTimeDayPickerComponent,
        DateTimeMonthPickerComponent,
        DateTimeYearPickerComponent,
        LoopScrollDataDirective,
        LoopScrollDirective,
    ],
    exports:
    [
        DateTimePickerComponent
    ]
})
export class DateTimePickerModule
{
}