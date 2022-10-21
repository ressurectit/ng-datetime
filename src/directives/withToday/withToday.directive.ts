import {Directive, Inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {DATE_API} from '../../misc/tokens';
import {DateTimeInputDirective} from '../../modules';
import {DateApi} from '../../services';

/**
 * Directive that sets today as day for empty date time on focus
 */
@Directive(
{
    selector: '[dateTime][withToday]',
    standalone: true,
})
export class WithTodaySADirective<TDate = unknown> implements OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscriptions created during initialization
     */
    private _initSubscriptions: Subscription = new Subscription();

    //######################### constructor #########################
    constructor(input: DateTimeInputDirective<TDate>,
                @Inject(DATE_API) dateApi: DateApi<TDate>,)
    {
        this._initSubscriptions.add(input.focus.subscribe(() =>
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
        this._initSubscriptions.unsubscribe();
    }
}