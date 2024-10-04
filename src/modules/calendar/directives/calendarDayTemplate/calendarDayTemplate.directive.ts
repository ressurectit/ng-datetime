import {Directive, TemplateRef} from '@angular/core';

import {CalendarDayTemplateContext} from './calendarDayTemplate.context';

/**
 * Directive used for obtaining custom calendar day template
 */
@Directive(
{
    selector: '[calendarDayTemplate]',
    standalone: true,
})
export class CalendarDayTemplateDirective<TDate = unknown, TEvent = unknown>
{
    //######################### constructor #########################
    constructor(public template: TemplateRef<CalendarDayTemplateContext<TDate, TEvent>>)
    {
    }

    //######################### ng language server #########################
    
    /**
     * Allows typechecking for template
     */
    static ngTemplateContextGuard(_dir: CalendarDayTemplateDirective, _ctx: unknown): _ctx is CalendarDayTemplateContext
    {
        return true;
    }
}