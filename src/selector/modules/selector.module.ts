import {NgModule} from '@angular/core';
import {CommonModule as AngularCommonModule} from '@angular/common';
import {CommonModule} from '@anglr/common';

import {DateTimeSelectorComponent, InputDateTimeSelectorComponent} from '../components';
import {DateTimeSelectorControlValueAccessor} from '../directives';
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
        DateTimeSelectorControlValueAccessor,
        InputDateTimeSelectorComponent,
    ],
    exports:
    [
        DateTimeSelectorComponent,
        DateTimeSelectorControlValueAccessor
    ]
})
export class DateTimeSelectorModule
{
}