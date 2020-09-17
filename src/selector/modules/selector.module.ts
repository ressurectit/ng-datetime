import {NgModule} from '@angular/core';
import {CommonModule} from '@anglr/common';

import {DateTimeSelectorComponent, InputDateTimeSelectorComponent} from '../components';

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
        InputDateTimeSelectorComponent
    ],
    exports:
    [
        DateTimeSelectorComponent
    ]
})
export class DateTimeSelectorModule
{
}