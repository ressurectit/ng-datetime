import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MonthCalendarComponent} from '../components';
import {CalendarDayTemplateDirective} from '../directives';

/**
 * Module used for calendar displaying month
 */
@NgModule(
{
    imports:
    [
        CommonModule,
    ],
    declarations:
    [
        MonthCalendarComponent,
        CalendarDayTemplateDirective,
    ],
    exports:
    [
        MonthCalendarComponent,
        CalendarDayTemplateDirective,
    ],
})
export class MonthCalendarModule
{
}