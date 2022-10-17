import {NgModule} from '@angular/core';
import {CommonModule as AngularCommonModule} from '@angular/common';
import {CommonDynamicModule} from '@anglr/common';

import {DateTimePickerModule} from '../../picker/modules/picker.module';
import {DateTimeSelectorComponent} from '../components/selector/selector.component';
import {InputDateTimeSelectorComponent} from '../components/inputDateTime/inputDateTime.component';
import {DateTimeSelectorControlValueAccessor} from '../directives/selectorControlValueAccessor/selectorControlValueAccessor.directive';
import {DatetimeValidatorDirective} from '../directives/datetimeValidator/datetimeValidator.directive';
import {DatetimeMinValidatorDirective} from '../directives/datetimeMinValidator/datetimeMinValidator.directive';
import {DatetimeMaxValidatorDirective} from '../directives/datetimeMaxValidator/datetimeMaxValidator.directive';
import {DateTimePickerRendererDirective} from '../directives/dateTimePickerRenderer/dateTimePickerRenderer.directive';

/**
 * Angular module for date time selector components
 */
@NgModule(
{
    imports:
    [
        AngularCommonModule,
        CommonDynamicModule,
        DateTimePickerModule,
    ],
    declarations:
    [
        DateTimeSelectorComponent,
        InputDateTimeSelectorComponent,
        DateTimeSelectorControlValueAccessor,
        DatetimeValidatorDirective,
        DatetimeMinValidatorDirective,
        DatetimeMaxValidatorDirective,
        DateTimePickerRendererDirective,
    ],
    exports:
    [
        DateTimeSelectorComponent,
        DateTimeSelectorControlValueAccessor,
        DatetimeValidatorDirective,
        DatetimeMinValidatorDirective,
        DatetimeMaxValidatorDirective,
        DateTimePickerRendererDirective,
    ]
})
export class DateTimeSelectorModule
{
}