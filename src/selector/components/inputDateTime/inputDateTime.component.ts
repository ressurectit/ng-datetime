import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {DateTimeValue} from '../../../datetime';
import {DateTimeSelector} from '../../misc/datetimeSelector.interface';

/**
 * Component used as datetime selector with input
 */
@Component(
{
    selector: 'input-date-time-selector',
    templateUrl: 'inputDateTime.component.html',
    // styleUrls: ['inputDateTime.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDateTimeSelectorComponent<TDate = any> implements DateTimeSelector<TDate>
{
    //######################### protected fields #########################

    /**
     * Gets current value of datetime
     */
    protected _value: DateTimeValue<TDate>;

    /**
     * Gets formatted value
     */
    protected _formattedValue: string;

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

    //######################### public properties - implementation of DateTimeSelector #########################
    
    /**
     * Currently used format for displaying data
     */
    public format: string;

    /**
     * Gets current value of datetime
     */
    public get value(): DateTimeValue<TDate>
    {
        return this._value;
    }

    /**
     * Gets formatted value
     */
    public get formattedValue(): string
    {
        return this._formattedValue;
    }

    /**
     * Occurs when value changes
     */
    public get valueChange(): Observable<void>
    {
        return this._valueChange;
    }

    /**
     * Occurs when user scales up
     */
    public get scaleUp(): Observable<TDate>
    {
        return this._scaleUp;
    }

    /**
     * Occurs when user scales down
     */
    public get scaleDown(): Observable<TDate>
    {
        return this._scaleDown;
    }

    //######################### public methods - implementation of DateTimeSelector #########################

    /**
     * Sets value of datetime selector
     * @param value - Value to be set to this selector
     * @param options - Additional options, emitChange defaults to true, if set to false valueChange did not fire
     */
    public setValue(value: DateTimeValue<TDate>, options?: {emitChange?: boolean}): void
    {
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
    }
}