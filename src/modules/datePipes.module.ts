import {NgModule} from '@angular/core';

import {DateConvertPipe} from '../pipes/dateConvert.pipe';
import {DateFormatPipe} from '../pipes/dateFormat.pipe';

/**
 * Module used for exporting date pipes
 */
@NgModule(
{
    declarations:
    [
        DateFormatPipe,
        DateConvertPipe,
    ],
    exports:
    [
        DateFormatPipe,
        DateConvertPipe,
    ]
})
export class DatePipesModule
{
}