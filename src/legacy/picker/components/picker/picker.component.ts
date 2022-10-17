import {Component, ChangeDetectionStrategy, Optional, Inject, Input, Type, OnInit, EventEmitter, Output, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {extend} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {DateTimeValue} from '../../../../misc/datetime.interface';
import {DATE_API} from '../../../../misc/tokens';
import {DateApi} from '../../../../services';
import {DateTimePicker, DateTimePickerOptions} from '../../misc/datetimePicker.interface';
import {DATE_TIME_PICKER_CONFIGURATION} from '../../misc/tokens';
import {DateTimeDayPickerComponent} from '../dayPicker/dayPicker.component';
import {DateTimeMonthPickerComponent} from '../monthPicker/monthPicker.component';
import {DateTimeYearPickerComponent} from '../yearPicker/yearPicker.component';
import {scaleUpDownTrigger} from './picker.component.animations';

//TODO - merge options

/**
 * Default configuration for picker
 */
const defaultConfiguration: DateTimePickerOptions<DateTimePicker> =
{
    defaultPeriod: 'day',
    pickerPeriodsDefinition:
    {
        'day': DateTimeDayPickerComponent,
        'month': DateTimeMonthPickerComponent,
        'year': DateTimeYearPickerComponent
    },
    pickerPeriodsOrder: null,
    cssClasses:
    {
    }
};

/**
 * Component used for displaying date time picker
 */
@Component(
{
    selector: 'date-time-picker',
    templateUrl: 'picker.component.html',
    styleUrls: ['picker.component.css'],
    animations: [scaleUpDownTrigger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerComponent<TDate = any> implements OnInit, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of active date time picker
     */
    protected _activePicker?: DateTimePicker<TDate>;

    /**
     * Name, id of displayed picker
     */
    protected _activePickerName!: string;

    /**
     * Array of available picker names
     */
    protected _pickerNames: string[] = [];

    /**
     * Current selected value
     */
    protected _value: DateTimeValue<TDate>|null = null;

    /**
     * All subscriptions for active picker
     */
    protected _activePickerSubscriptions: Subscription = new Subscription();

    /**
     * Date that should be displayed in picker, used when moving up or down in periods
     */
    protected _display?: TDate;

    /**
     * Minimal possible value that can be picked
     */
    protected _minValue: TDate|null = null;

    /**
     * Maximal possible value that can be picked
     */
    protected _maxValue: TDate|null = null;

    /**
     * Current options used by picker
     */
    protected _options: DateTimePickerOptions<DateTimePicker<TDate>>;

    //######################### public properties - template bindings #########################

    /**
     * Currently active date time picker component type
     * @internal
     */
    public activePickerComponent?: Type<DateTimePicker<TDate>>;

    /**
     * Active picker index
     * @internal
     */
    public activePickerIndex: number = 0;

    //######################### public properties - inputs #########################

    /**
     * Current options used by picker
     */
    @Input()
    public get options(): Partial<DateTimePickerOptions<DateTimePicker<TDate>>>
    {
        return this._options;
    }
    public set options(value: Partial<DateTimePickerOptions<DateTimePicker<TDate>>>)
    {
        this._options = extend(true, this._options, value);

        // without deep-copy for this attribute
        if (value?.pickerPeriodsDefinition)
        {
            this._options.pickerPeriodsDefinition = value.pickerPeriodsDefinition;
        }
    }

    /**
     * Current selected value
     */
    @Input()
    public get value(): DateTimeValue<TDate>|null
    {
        return this._value;
    }
    public set value(value: DateTimeValue<TDate>|null)
    {
        this._value = value;

        this._activePicker?.setValue(value);
        this._activePicker?.invalidateVisuals();
    }

    /**
     * Gets or sets minimal possible value for picker, that can be picked
     */
    @Input()
    public get minValue(): TDate|null
    {
        return this._minValue;
    }
    public set minValue(value: TDate|null)
    {
        this._minValue = value;
        this._activePicker?.setMinValue(this._minValue);
    }

    /**
     * Gets or sets maximal possible value for picker, that can be picked
     */
    @Input()
    public get maxValue(): TDate|null
    {
        return this._maxValue;
    }
    public set maxValue(value: TDate|null)
    {
        this._maxValue = value;
        this._activePicker?.setMaxValue(this._maxValue);
    }

    //######################### public properties - outputs #########################

    /**
     * Occurs when value changes
     */
    @Output()
    public valueChange: EventEmitter<DateTimeValue<TDate>> = new EventEmitter<DateTimeValue<TDate>>();

    //######################### constructor #########################
    constructor(@Optional() @Inject(DATE_TIME_PICKER_CONFIGURATION) configuration: Partial<DateTimePickerOptions<DateTimePicker<TDate>>>,
                @Inject(DATE_API) protected _dateApi: DateApi<TDate>,
                protected _changeDetector: ChangeDetectorRef)
    {
        this._options = extend(true, {}, defaultConfiguration, configuration);
        // without deep-copy for this attribute
        if (configuration?.pickerPeriodsDefinition)
        {
            this._options.pickerPeriodsDefinition = configuration.pickerPeriodsDefinition;
        }
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        if (this._options.pickerPeriodsOrder)
        {
            if (Array.isArray(this._options.pickerPeriodsOrder))
            {
                this._pickerNames = this._options.pickerPeriodsOrder;
            }
            else
            {
                this._pickerNames = this._options.pickerPeriodsOrder.split(',')
                                    .map(x => x.trim())
                                    .filter(x => x);
            }
        }
        if (this._pickerNames && this._pickerNames.length > 0)
        {
            this._pickerNames.forEach(x => 
            {
                if(!this._options.pickerPeriodsDefinition![x!])
                {
                    throw new Error(`There is no period '${x}' in picker options`);
                }
            });
        }
        else
        {
            this._pickerNames = Object.keys(this._options.pickerPeriodsDefinition!);
        }

        if(this._pickerNames.findIndex(x => x == this._options.defaultPeriod) < 0)
        {
            throw new Error(`There is no period '${this._options.defaultPeriod}' in picker options`);
        }

        this.activePickerComponent = this._options.pickerPeriodsDefinition![this._options.defaultPeriod!];
        this._activePickerName = this._options.defaultPeriod!;
        this.activePickerIndex = this._pickerNames.indexOf(this._activePickerName);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this._display = undefined;
        this._activePickerSubscriptions.unsubscribe();
    }

    //######################### public methods - template bindings #########################

    /**
     * Handles created or destroyed date time picker instance
     * @param picker - Instance of picker or null
     * @internal
     */
    public pickerCreated(picker: DateTimePicker<TDate>): void
    {
        if(picker == this._activePicker)
        {
            return;
        }

        this._activePicker = picker;

        this._activePickerSubscriptions.unsubscribe();
        this._activePickerSubscriptions = new Subscription();

        if(!this._activePicker)
        {
            return;
        }

        this._activePickerSubscriptions.add(picker.valueChange.subscribe(() =>
        {
            this._value = picker.value;
            this.valueChange.emit(this._value!);
        }));

        this._activePickerSubscriptions.add(picker.scaleUp.subscribe(display =>
        {
            this._display = display;
            const index = this._pickerNames.indexOf(this._activePickerName) + 1;
            this._activePickerName = this._pickerNames[index];
            this.activePickerIndex = this._pickerNames.indexOf(this._activePickerName);
            this.activePickerComponent = this._options.pickerPeriodsDefinition![this._activePickerName];
        }));

        this._activePickerSubscriptions.add(picker.scaleDown.subscribe(display =>
        {
            this._display = display;
            const index = this._pickerNames.indexOf(this._activePickerName) - 1;
            this._activePickerName = this._pickerNames[index];
            this.activePickerIndex = this._pickerNames.indexOf(this._activePickerName);
            this.activePickerComponent = this._options.pickerPeriodsDefinition![this._activePickerName];
        }));

        picker.setCanGoDown(this._pickerNames.indexOf(this._activePickerName) > 0);
        picker.setCanGoUp(this._pickerNames.indexOf(this._activePickerName) < this._pickerNames.length - 1);

        this._setPickerCssClasses();
        picker.setValue(this._value);
        picker.setMinValue(this._minValue);
        picker.setMaxValue(this._maxValue);
        picker.display(this._display ? this._dateApi.getValue(this._display) : this._dateApi.getValue(this._value?.from ?? this._dateApi.now().value));

        picker.invalidateVisuals();
    }

    //######################### protected methods #########################

    /**
     * Sets picker css classes
     */
    protected _setPickerCssClasses(): void
    {
        if(!this._activePicker)
        {
            return;
        }

        //sets shared css
        this._activePicker.setCssClasses(this._options?.cssClasses?.pickerShared ?? {});

        if(this._options?.cssClasses?.pickerCustom && this._options?.cssClasses?.pickerCustom[this._activePickerName])
        {
            this._activePicker.setCssClasses(this._options?.cssClasses?.pickerCustom[this._activePickerName]);
        }
    }
}
