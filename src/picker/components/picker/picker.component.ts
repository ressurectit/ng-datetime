import {Component, ChangeDetectionStrategy, Optional, Inject, Input, Type, OnInit, EventEmitter, Output, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {extend} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API} from '../../../misc/tokens';
import {DateApi} from '../../../services';
import {DateTimePicker, DateTimePickerOptions} from '../../misc/datetimePicker.interface';
import {DATE_TIME_PICKER_CONFIGURATION} from '../../misc/tokens';
import {DateTimeDayPickerComponent} from '../dayPicker/dayPicker.component';
import {DateTimeMonthPickerComponent} from '../monthPicker/monthPicker.component';

/**
 * Default configuration for picker
 */
const defaultConfiguration: DateTimePickerOptions<DateTimePicker> =
{
    defaultPeriod: 'day',
    pickerPeriodsDefinition:
    {
        "day": DateTimeDayPickerComponent,
        "month": DateTimeMonthPickerComponent
    }
};

/**
 * Component used for displaying date time picker
 */
@Component(
{
    selector: 'date-time-picker',
    templateUrl: 'picker.component.html',
    // styleUrls: ['picker.component.scss'],
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

    //######################### public properties - template bindings #########################

    /**
     * Currently active date time picker component type
     * @internal
     */
    public activePickerComponent?: Type<DateTimePicker<TDate>>;

    //######################### public properties - inputs #########################

    /**
     * Current options used by picker
     */
    @Input()
    public options: DateTimePickerOptions<DateTimePicker<TDate>>;

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

    //######################### public properties - outputs #########################

    /**
     * Occurs when value changes
     */
    @Output()
    public valueChange: EventEmitter<DateTimeValue<TDate>> = new EventEmitter<DateTimeValue<TDate>>();

    //######################### constructor #########################
    constructor(@Optional() @Inject(DATE_TIME_PICKER_CONFIGURATION) configuration: DateTimePickerOptions<DateTimePicker<TDate>>,
                @Inject(DATE_API) protected _dateApi: DateApi<TDate>,
                protected _changeDetector: ChangeDetectorRef)
    {
        this.options = extend(true, {}, defaultConfiguration, configuration);
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(!this.options.pickerPeriodsDefinition[this.options.defaultPeriod])
        {
            throw new Error(`There is no period '${this.options.defaultPeriod}' in picker options`);
        }

        this.activePickerComponent = this.options.pickerPeriodsDefinition[this.options.defaultPeriod];
        this._activePickerName = this.options.defaultPeriod;
        this._pickerNames = Object.keys(this.options.pickerPeriodsDefinition);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
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
    public pickerCreated(picker: DateTimePicker<TDate>)
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
            let index = this._pickerNames.indexOf(this._activePickerName) + 1;
            this._activePickerName = this._pickerNames[index];
            this.activePickerComponent = this.options.pickerPeriodsDefinition[this._activePickerName];
        }));

        this._activePickerSubscriptions.add(picker.scaleDown.subscribe(display =>
        {
            this._display = display;
            let index = this._pickerNames.indexOf(this._activePickerName) - 1;
            this._activePickerName = this._pickerNames[index];
            this.activePickerComponent = this.options.pickerPeriodsDefinition[this._activePickerName];
        }));

        picker.setCanGoDown(this._pickerNames.indexOf(this._activePickerName) > 0);
        picker.setCanGoUp(this._pickerNames.indexOf(this._activePickerName) < this._pickerNames.length - 1);

        picker.setValue(this._value);
        picker.display(this._display ? this._dateApi.getValue(this._display) : this._dateApi.getValue(this._value?.from ?? this._dateApi.now().value));

        picker.invalidateVisuals();
    }
}