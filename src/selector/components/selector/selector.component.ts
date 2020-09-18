import {Component, ChangeDetectionStrategy, Input, Inject, Optional, Type, OnInit, OnDestroy} from '@angular/core';
import {extend} from '@jscrpt/common';
import {Observable, Subject, Subscription} from 'rxjs';

import {DateTimeConfiguration, DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API, FORMAT_PROVIDER} from '../../../misc/tokens';
import {DateApi, FormatProvider} from '../../../services';
import {DateTimeSelector} from '../../misc/datetimeSelector.interface';
import {DATE_TIME_SELECTOR_CONFIGURATION} from '../../misc/tokens';
import {InputDateTimeSelectorComponent} from '../inputDateTime/inputDateTime.component';

/**
 * Default configuration for selector
 */
const defaultConfiguration: DateTimeConfiguration<DateTimeSelector> =
{
    defaultPeriod: 'day',
    periodsDefinition:
    {
        "day": InputDateTimeSelectorComponent
    }
};

/**
 * Component used for displaying and selecting date time
 */
@Component(
{
    selector: 'date-time-selector',
    templateUrl: 'selector.component.html',
    // styleUrls: ['selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeSelectorComponent<TDate = any> implements OnInit, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Current value of datetime
     */
    protected _value: DateTimeValue<TDate>|null = null;

    /**
     * Instance of active date time selector
     */
    protected _activeSelector?: DateTimeSelector<TDate>;

    /**
     * Occurs when selector is touched by user
     */
    protected _touched: Subject<void> = new Subject<void>();

    /**
     * Occurs when selector was changed anyway
     */
    protected _anyChange: Subject<void> = new Subject<void>();

    /**
     * Occurs when value changes
     */
    protected _valueChange: Subject<void> = new Subject<void>();

    /**
     * All subscriptions for active selector
     */
    protected _activeSelectorSubscriptions: Subscription = new Subscription();

    //######################### public properties #########################

    /**
     * Gets or sets current value of datetime
     */
    public get value(): DateTimeValue<TDate>|null
    {
        return this._value;
    }
    public set value(value: DateTimeValue<TDate>|null)
    {
    }

    /**
     * Gets or sets formatted value
     */
    public get formattedValue(): string|null
    {
        return null;
    }
    public set formattedValue(value: string|null)
    {
    }

    /**
     * Occurs when selector is touched by user
     */
    public get touched(): Observable<void>
    {
        return this._touched.asObservable();
    }

    /**
     * Occurs when selector was changed anyway
     */
    public get anyChange(): Observable<void>
    {
        return this._anyChange.asObservable();
    }

    /**
     * Occurs when value changes
     */
    public get valueChange(): Observable<void>
    {
        return this._valueChange.asObservable();
    }

    //######################### public properties - template bindings #########################

    /**
     * Currently active date time selector component type
     * @internal
     */
    public activeSelectorComponent?: Type<DateTimeSelector<TDate>>;

    //######################### public properties - inputs #########################

    /**
     * Format of displayed
     */
    @Input()
    public format: string;

    /**
     * Current configuration used by selector
     */
    @Input()
    public config: DateTimeConfiguration<DateTimeSelector<TDate>>;

    //######################### constructor #########################
    constructor(@Optional() @Inject(DATE_TIME_SELECTOR_CONFIGURATION) configuration: DateTimeConfiguration<DateTimeSelector<TDate>>,
                @Inject(DATE_API) protected _dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) formatProvider: FormatProvider)
    {
        this.format = formatProvider.date;
        this.config = extend(true, {}, defaultConfiguration, configuration);
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(!this.config.periodsDefinition[this.config.defaultPeriod])
        {
            throw new Error(`There is no period '${this.config.defaultPeriod}' configuration`);
        }

        this.activeSelectorComponent = this.config.periodsDefinition[this.config.defaultPeriod];
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
        this._activeSelectorSubscriptions.unsubscribe();
    }

    //######################### public methods - template bindings #########################

    /**
     * Handles created or destroyed date time selector instance
     * @param selector - Instance of selector or null
     * @internal
     */
    public selectorCreated(selector: DateTimeSelector<TDate>)
    {
        this._activeSelector = selector;

        this._activeSelectorSubscriptions.unsubscribe();
        this._activeSelectorSubscriptions = new Subscription();
    }

    //######################### public methods #########################
}