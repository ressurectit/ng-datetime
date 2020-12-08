import {Component, ChangeDetectionStrategy, Input, Inject, Optional, Type, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import {extend, isBlank, isString, nameof} from '@jscrpt/common';
import {Observable, Subject, Subscription} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API, FORMAT_PROVIDER} from '../../../misc/tokens';
import {DateTimeDayPickerComponent} from '../../../picker/components/dayPicker/dayPicker.component';
import {DateTimeMonthPickerComponent} from '../../../picker/components/monthPicker/monthPicker.component';
import {DateTimeYearPickerComponent} from '../../../picker/components/yearPicker/yearPicker.component';
import {DateApi, FormatProvider} from '../../../services';
import {DateValueProvider} from '../../../services/dateValueProvider.service';
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
    pickerCloseOnValueSelect: false,
    pickerDisabled: false,
    defaultPeriod: 'day',
    pickerPeriodsDefinition:
    {
        "day": DateTimeDayPickerComponent,
        "month": DateTimeMonthPickerComponent,
        "year": DateTimeYearPickerComponent
    },
    cssClasses:
    {
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

    /**
     * Subscription for changes of min value selector
     */
    protected _minValueChangeSubscription: Subscription|null = null;

    /**
     * Subscription for changes of max value selector
     */
    protected _maxValueChangeSubscription: Subscription|null = null;

    /**
     * Current options used by selector
     */
    protected _options: DateTimeSelectorOptions<DateTimeSelector<TDate>>;

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
        return this._activeSelector?.valid ?? true;
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

    /**
     * Gets or sets minimal possible value for picker, that can be picked
     */
    public min: TDate|null = null;

    /**
     * Gets or sets maximal possible value for picker, that can be picked
     */
    public max: TDate|null = null;

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
    public get options(): DateTimeSelectorOptions<DateTimeSelector<TDate>>
    {
        return this._options;
    }
    public set options(value: DateTimeSelectorOptions<DateTimeSelector<TDate>>)
    {
        this._options = extend(true, this._options, value);
    }

    /**
     * Gets or sets minimal possible value for picker, that can be picked
     */
    @Input()
    public get minValue(): TDate|string|null|DateTimeSelectorComponent<TDate>
    {
        return this.min;
    }
    public set minValue(value: TDate|string|null|DateTimeSelectorComponent<TDate>)
    {
        this._minValueChangeSubscription?.unsubscribe();
        this._minValueChangeSubscription = null;

        if(isBlank(value))
        {
            this.min = null;
        }
        else if(isString(value))
        {
            let date = this._dateApi.getValue(value);

            if(date.isValid())
            {
                this.min = date.value;
            }
        }
        else if(value instanceof DateTimeSelectorComponent)
        {
            this.min = value.valueOf();

            this._minValueChangeSubscription = value.valueChange.subscribe(() =>
            {
                this.min = value.valueOf();
                this._activeSelector?.setMinValue(this.min);

                this._changeDetector.detectChanges();
            });
        }
        else
        {
            this.min = value;
        }

        this._activeSelector?.setMinValue(this.min);
    }

    /**
     * Gets or sets maximal possible value for picker, that can be picked
     */
    @Input()
    public get maxValue(): TDate|string|null|DateTimeSelectorComponent<TDate>
    {
        return this.max;
    }
    public set maxValue(value: TDate|string|null|DateTimeSelectorComponent<TDate>)
    {
        this._maxValueChangeSubscription?.unsubscribe();
        this._maxValueChangeSubscription = null;

        if(isBlank(value))
        {
            this.max = null;
        }
        else if(isString(value))
        {
            let date = this._dateApi.getValue(value);

            if(date.isValid())
            {
                this.max = date.value;
            }
        }
        else if(value instanceof DateTimeSelectorComponent)
        {
            this.max = value.valueOf();

            this._maxValueChangeSubscription = value.valueChange.subscribe(() =>
            {
                this.max = value.valueOf();
                this._activeSelector?.setMaxValue(this.max);

                this._changeDetector.detectChanges();
            });
        }
        else
        {
            this.max = value;
        }

        this._activeSelector?.setMaxValue(this.max);
    }

    //######################### constructor #########################
    constructor(@Optional() @Inject(DATE_TIME_SELECTOR_CONFIGURATION) configuration: DateTimeSelectorOptions<DateTimeSelector<TDate>>,
                protected _valueProvider: DateValueProvider<TDate>,
                protected _changeDetector: ChangeDetectorRef,
                @Inject(DATE_API) protected _dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) formatProvider: FormatProvider)
    {
        this.format = formatProvider.date;
        this._options = extend(true, {}, defaultConfiguration, configuration);
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        this.activeSelectorComponent = this._options.selectorComponent;
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

        this._minValueChangeSubscription?.unsubscribe();
        this._minValueChangeSubscription = null;

        this._maxValueChangeSubscription?.unsubscribe();
        this._maxValueChangeSubscription = null;
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
        selector.setMaxValue(this.max);
        selector.setMinValue(this.min);
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

        if(this._options.pickerCloseOnValueSelect)
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

    /**
     * Gets simple value of selector
     */
    public valueOf(): TDate|null
    {
        if(!this._value)
        {
            return null;
        }

        return this._value.from;
    }
}