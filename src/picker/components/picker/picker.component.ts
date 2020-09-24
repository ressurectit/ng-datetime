import {Component, ChangeDetectionStrategy, Optional, Inject, Input, Type, OnInit} from '@angular/core';
import {extend} from '@jscrpt/common';

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
        console.log(picker);
    }
}