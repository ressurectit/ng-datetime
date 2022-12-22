import {Directive, EventEmitter, inject, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {DateTimeInputValue} from '../../../interfaces';
import {DateTimeInputOutputValue} from '../../../misc/types';
import {DateTimeSADirective} from './dateTime/dateTime.directive';

/**
 * Base class for date time directives, contains basic shared data
 */
@Directive()
export class DateTimeBase<TDate = unknown> implements DateTimeInputValue<TDate>, OnDestroy
{
    //######################### protected properties #########################

    /**
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

    /**
     * Current value of date time, could be string, unix timestamp, Date, TDate object, or ranged DateTimeValue
     */
    protected ɵValue: DateTimeInputOutputValue<TDate>|undefined|null;

    /**
     * Instance of date time shared data, like formats and restrictions
     */
    protected dateTimeData: DateTimeSADirective<TDate> = inject(DateTimeSADirective<TDate>);

    //######################### public properties - implementation of DateTimeInputValue #########################

    /**
     * @inheritdoc
     */
    public get value(): DateTimeInputOutputValue<TDate>|undefined|null
    {
        return this.ɵValue;
    }
    public set value(value: DateTimeInputOutputValue<TDate>|undefined|null)
    {
        this.ɵValue = value;
    }

    /**
     * @inheritdoc
     */
    public valueChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### constructor #########################
    constructor()
    {
        this.initSubscriptions.add(this.dateTimeData.maxDateTimeChanges.subscribe(() => this.onMaxDateTimeChange()));
        this.initSubscriptions.add(this.dateTimeData.minDateTimeChanges.subscribe(() => this.onMinDateTimeChange()));
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this.initSubscriptions.unsubscribe();
    }

    //######################### protected methods #########################

    /**
     * Called whenever max date time restriction changes
     */
    protected onMaxDateTimeChange(): void
    {
    }

    /**
     * Called whenever min date time restriction changes
     */
    protected onMinDateTimeChange(): void
    {
    }
}
