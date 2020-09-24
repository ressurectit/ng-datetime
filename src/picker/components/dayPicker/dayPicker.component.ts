import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DateTimePicker} from '../../misc/datetimePicker.interface';

/**
 * Component used for displaying day picker
 */
@Component(
{
    selector: 'date-time-day-picker',
    templateUrl: 'dayPicker.component.html',
    styleUrls: ['dayPicker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeDayPickerComponent<TDate = any> implements DateTimePicker
{
    //######################### protected fields #########################

    /**
     * Current value of datetime
     */
    protected _value: DateTimeValue<TDate>|null = null;

    /**
     * Occurs when value changes
     */
    protected _valueChange: Subject<void> = new Subject<void>();
    
    /**
     * Occurs when user scales up
     */
    protected _scaleUp: Subject<TDate> = new Subject<TDate>();

    /**
     * Occurs when user scales down
     */
    protected _scaleDown: Subject<TDate> = new Subject<TDate>();

    /**
     * Function for testing whether can go down
     */
    protected _canGoDown: () => boolean = () => false;

    /**
     * Currently displayed period of time
     */
    protected _display!: TDate;

    //######################### public properties - implementation of DateTimePicker #########################

    /**
     * Gets current value of datetime
     */
    public get value(): DateTimeValue<TDate>|null
    {
        return null;
    }

    /**
     * Occurs when value changes
     */
    public get valueChange(): Observable<void>
    {
        return this._valueChange.asObservable();
    }

    /**
     * Occurs when user scales up
     */
    public get scaleUp(): Observable<TDate>
    {
        return this._scaleUp.asObservable();
    }

    /**
     * Occurs when user scales down
     */
    public get scaleDown(): Observable<TDate>
    {
        return this._scaleDown.asObservable();
    }

    //######################### public properties - template bindings #########################

    /**
     * Array of days to be displayed
     * @internal
     */
    public days: string[] = [];

    //######################### constructor #########################
    constructor()
    {
        for(let x = 1; x <= 31; x++)
        {
            this.days.push(x.toString());
        }
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Sets value of datetime picker
     * @param value - Value to be set to this picker
     */
    public setValue(value: DateTimeValue<TDate>|null): void
    {
    }

    /**
     * Set displays date to be displayed
     * @param value - Value that identifies period that is going to be displayed
     */
    public display(value: TDate): void
    {
        this._display = value;
    }

    /**
     * Sets callback for testing whether picker can go down
     * @param fn - Callback function that is called when picker is testing whether can go down
     */
    public setupCanGoDown(fn: () => boolean): void
    {
        this._canGoDown = fn;
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
    }
}