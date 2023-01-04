import {Directive, Inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {DATE_API} from '../../misc/tokens';
import {DateTimeInputSADirective} from '../../modules';
import {DateApi} from '../../services';

/**
 * Directive that sets current date and time as day and time for empty date time on focus
 */
@Directive(
{
    selector: '[dateTime][withNow]',
    standalone: true,
})
export class WithNowSADirective<TDate = unknown> implements OnDestroy
{
    //######################### protected fields #########################

    /**
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

    //######################### constructor #########################
    constructor(input: DateTimeInputSADirective<TDate>,
                @Inject(DATE_API) dateApi: DateApi<TDate>,)
    {
        this.initSubscriptions.add(input.focus.subscribe(() =>
        {
            if(!input.value)
            {
                input.value = dateApi.now().value;
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