import {Directive, Inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {DATE_API} from '../../misc/tokens';
import {DateTimeInputDirective} from '../../modules';
import {DateApi} from '../../services';

/**
 * Directive that sets today (start of a day) as day for empty date time on focus
 */
@Directive(
{
    selector: '[dateTime][withToday]',
    standalone: true,
})
export class WithTodayDirective<TDate = unknown> implements OnDestroy
{
    //######################### protected fields #########################

    /**
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

    //######################### constructor #########################
    constructor(input: DateTimeInputDirective<TDate>,
                @Inject(DATE_API) dateApi: DateApi<TDate>,)
    {
        this.initSubscriptions.add(input.focus.subscribe(() =>
        {
            if(!input.value)
            {
                input.value = dateApi.now().startOfDay().value;
            }
        }));
    }
    
    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this.initSubscriptions.unsubscribe();
    }
}