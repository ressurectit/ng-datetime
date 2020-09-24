import {Component, ChangeDetectionStrategy, Optional, Inject, Input, Type, OnInit} from '@angular/core';
import {extend} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DateTimePicker, DateTimePickerOptions} from '../../misc/datetimePicker.interface';
import {DATE_TIME_PICKER_CONFIGURATION} from '../../misc/tokens';
import {DateTimeDayPickerComponent} from '../dayPicker/dayPicker.component';

/**
 * Default configuration for picker
 */
const defaultConfiguration: DateTimePickerOptions<DateTimePicker> =
{
    defaultPeriod: 'day',
    pickerPeriodsDefinition:
    {
        "day": DateTimeDayPickerComponent
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
export class DateTimePickerComponent<TDate = any> implements OnInit
{
    //######################### protected fields #########################

    /**
     * Instance of active date time picker
     */
    protected _activePicker?: DateTimePicker<TDate>;

    /**
     * Current selected value
     */
    protected _value: DateTimeValue<TDate>|null = null;

    /**
     * All subscriptions for active picker
     */
    protected _activePickerSubscriptions: Subscription = new Subscription();

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

    public get value(): DateTimeValue<TDate>|null
    {
        return this._value;
    }

    //######################### constructor #########################
    constructor(@Optional() @Inject(DATE_TIME_PICKER_CONFIGURATION) configuration: DateTimePickerOptions<DateTimePicker<TDate>>)
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
    }

    //######################### public methods - template bindings #########################

    /**
     * Handles created or destroyed date time picker instance
     * @param picker - Instance of picker or null
     * @internal
     */
    public pickerCreated(picker: DateTimePicker<TDate>)
    {
        this._activePicker = picker;

        this._activePickerSubscriptions.unsubscribe();
        this._activePickerSubscriptions = new Subscription();

        // this._activePickerSubscriptions.add(picker.touched.subscribe(() => this._touched.next()));
        // this._activePickerSubscriptions.add(picker.pickerRequest.subscribe((request) => console.log('picker', request)));

        this._activePickerSubscriptions.add(picker.valueChange.subscribe(() =>
        {
            // this._value = picker.value;
            // this._valueChange.next();
        }));

        picker.setValue(this._value);
        picker.display(this._value?.from!);

        picker.invalidateVisuals();
    }
}