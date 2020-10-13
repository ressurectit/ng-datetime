import {NgModule} from '@angular/core';
import {CommonModule as AngularCommonModule} from '@angular/common';
import {CommonModule} from '@anglr/common';

import {DateTimeSelectorComponent, InputDateTimeSelectorComponent} from '../components';
import {DatetimeMaxValidatorDirective, DatetimeMinValidatorDirective, DateTimeSelectorControlValueAccessor, DatetimeValidatorDirective} from '../directives';
import {DateTimePickerModule} from '../../picker';

/**
 * Angular module for date time selector components
 */
@NgModule(
{
    imports:
    [
        AngularCommonModule,
        CommonModule,
        DateTimePickerModule
    ],
    declarations:
    [
        DateTimeSelectorComponent,
        InputDateTimeSelectorComponent,
        DateTimeSelectorControlValueAccessor,
        DatetimeValidatorDirective,
        DatetimeMinValidatorDirective,
        DatetimeMaxValidatorDirective
    ],
    exports:
    [
        DateTimeSelectorComponent,
        DateTimeSelectorControlValueAccessor,
        DatetimeValidatorDirective,
        DatetimeMinValidatorDirective,
        DatetimeMaxValidatorDirective
    ]
})
export class DateTimeSelectorModule
{
}