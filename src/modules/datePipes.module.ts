import {NgModule} from '@angular/core';

import {AsRequiredTypePipe} from '../pipes/asRequiredType';
import {DateConvertPipe} from '../pipes/dateConvert.pipe';
import {DateFormatPipe} from '../pipes/dateFormat.pipe';

/**
 * Module used for exporting date pipes
 */
@NgModule(
{
    declarations:
    [
        AsRequiredTypePipe,
        DateFormatPipe,
        DateConvertPipe,
    ],
    exports:
    [
        AsRequiredTypePipe,
        DateFormatPipe,
        DateConvertPipe,
    ]
})
export class DatePipesModule
{
}