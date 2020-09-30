import {Component, ChangeDetectionStrategy, Input, Inject, Optional, Type, OnInit, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {extend, nameof} from '@jscrpt/common';
import {Observable, Subject, Subscription} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API, FORMAT_PROVIDER} from '../../../misc/tokens';
import {DateTimeDayPickerComponent, DateTimeMonthPickerComponent, DateTimeYearPickerComponent} from '../../../picker';
import {DateApi, DateValueProvider, FormatProvider} from '../../../services';
import {DateTimeSelector, DateTimeSelectorOptions} from '../../misc/datetimeSelector.interface';
import {DATE_TIME_SELECTOR_CONFIGURATION} from '../../misc/tokens';
import {InputDateTimeSelectorComponent} from '../inputDateTime/inputDateTime.component';
import {enterLeaveAnimateChildTrigger} from './selector.component.animations';

//TODO - add support for body absolute picker

/**
 * Default configuration for selector
 */
const defaultConfiguration: DateTimeSelectorOptions<DateTimeSelector> =
{
    selectorComponent: InputDateTimeSelectorComponent,
    closeOnValueSelect: false,
    defaultPeriod: 'day',
    pickerPeriodsDefinition:
    {
        "day": DateTimeDayPickerComponent,
        "month": DateTimeMonthPickerComponent,
        "year": DateTimeYearPickerComponent
    }
};

/**
 * Component used for displaying and selecting date time
 */
@Component(
{
    selector: 'date-time-selector',
    templateUrl: 'selector.component.html',
    styleUrls: ['selector.component.css'],
    animations: [enterLeaveAnimateChildTrigger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeSelectorComponent<TDate = any> implements OnInit, OnChanges ,OnDestroy
{
    //######################### protected fields #########################

    /**
     * Current value of datetime
     */
    protected _value: DateTimeValue<TDate>|null = null;

    /**
     * Occurs when selector is touched by user
     */
    protected _touched: Subject<void> = new Subject<void>();

    /**
     * Occurs when value changes
     */
    protected _valueChange: Subject<void> = new Subject<void>();

    /**
     * Indication whether is control disabled
     */
    protected _disabled: boolean = false;

    /**
     * Instance of active date time selector
     */
    protected _activeSelector?: DateTimeSelector<TDate>;

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
        this._value = value;

        this._activeSelector?.setValue(this._value);
    }

    /**
     * Gets indication whether is current value valid
     */
    public get valid(): boolean
    {
        return !!this._value && !!this._activeSelector?.valid;
    }

    /**
     * Gets or sets formatted value
     */
    public get formattedValue(): string|null
    {
        return this._activeSelector?.formattedValue ?? null;
    }
    public set formattedValue(value: string|null)
    {
        if(value)
        {
            let val = this._dateApi.getValue(value, this.format);
            this.value = this._valueProvider.getValue(val.value, this.format);
        }
        else
        {
            this.value = null;
        }
    }

    /**
     * Occurs when selector is touched by user
     */
    public get touched(): Observable<void>
    {
        return this._touched.asObservable();
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

    /**
     * Indication whether is picker visible or not
     * @internal
     */
    public pickerVisible: boolean = false;

    //######################### public properties - inputs #########################

    /**
     * Format of displayed
     */
    @Input()
    public format: string;

    /**
     * Current options used by selector
     */
    @Input()
    public options: DateTimeSelectorOptions<DateTimeSelector<TDate>>;

    //######################### constructor #########################
    constructor(@Optional() @Inject(DATE_TIME_SELECTOR_CONFIGURATION) configuration: DateTimeSelectorOptions<DateTimeSelector<TDate>>,
                protected _valueProvider: DateValueProvider<TDate>,
                @Inject(DATE_API) protected _dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) formatProvider: FormatProvider)
    {
        this.format = formatProvider.date;
        this.options = extend(true, {}, defaultConfiguration, configuration);
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this.activeSelectorComponent = this.options.selectorComponent;
    }

    //######################### public methods - implementation of OnChanges #########################

    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(nameof<DateTimeSelectorComponent>('format') in changes && this._activeSelector)
        {
            this._activeSelector.format = this.format;
            this._activeSelector.invalidateVisuals();
        }
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

        this._activeSelectorSubscriptions.add(selector.touched.subscribe(() => this._touched.next()));
        this._activeSelectorSubscriptions.add(selector.pickerRequest.subscribe(visible => this.pickerVisible = visible));

        this._activeSelectorSubscriptions.add(selector.valueChange.subscribe(() =>
        {
            this._value = selector.value;
            this._valueChange.next();
        }));

        selector.format = this.format;
        selector.setValue(this._value);
        selector.setDisabled(this._disabled);

        selector.invalidateVisuals();
    }

    /**
     * Handles changed value by picker
     * @param value - Value that was changed
     * @intenral
     */
    public pickerChangedValue(value: DateTimeValue<TDate>)
    {
        this._activeSelector?.setValue(value);
        this._value = value;
        this._valueChange.next();

        if(this.options.closeOnValueSelect)
        {
            this.pickerVisible = false;
        }
    }

    //######################### public methods #########################

    /**
     * Sets as 'control' disabled
     * @param disabled - Indication whether sets value as disabled, if omitted it is same as disabled set to true
     */
    public setDisabled(disabled: boolean = true): void
    {
        this._disabled = disabled;
        this._activeSelector?.setDisabled(disabled);
    }
}