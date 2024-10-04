import {NgModule} from '@angular/core';

import {MonthCalendarComponent} from '../components';
import {CalendarDayTemplateDirective} from '../directives';

/**
 * Module used for calendar displaying month
 */
@NgModule(
{
    imports:
    [
        CalendarDayTemplateDirective,
        MonthCalendarComponent,
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