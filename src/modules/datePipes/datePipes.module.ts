import {NgModule} from '@angular/core';

import {DateConvertPipe, DateFormatPipe, IsAfterPipe, IsBeforePipe} from '../../pipes';

/**
 * Module used for exporting date pipes
 */
@NgModule(
{
    imports:
    [
        IsAfterPipe,
        IsBeforePipe,
        DateFormatPipe,
        DateConvertPipe,

    ],
    exports:
    [
        IsAfterPipe,
        IsBeforePipe,
        DateFormatPipe,
        DateConvertPipe,
    ],
})
export class DatePipesModule
{
}
