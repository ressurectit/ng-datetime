import {NgModule} from '@angular/core';
import {CommonModule} from '@anglr/common';

import {DateTimeSelectorComponent, InputDateTimeSelectorComponent} from '../components';
import {DateTimeSelectorControlValueAccessor} from '../directives';

/**
 * Angular module for date time selector components
 */
@NgModule(
{
    imports:
    [
        CommonModule
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