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
    protected _value: DateTimeValue<TDate>|null = null;

    /**
     * Gets formatted value
     */
    protected _formattedValue: string|null = null;

    /**
     * Occurs when value changes
     */
    protected _valueChange: Subject<void> = new Subject<void>();

    /**
     * Occurs when selector is touched by user
     */
    protected _touched: Subject<void> = new Subject<void>();

    /**
     * Occurs when selector was changed anyway
     */
    protected _anyChange: Subject<void> = new Subject<void>();

    /**
     * Occurs when selector requires picker to be displayed
     */
    protected _pickerRequest: Subject<void> = new Subject<void>();

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
    public format: string = '';

    /**
     * Gets current value of datetime
     */
    public get value(): DateTimeValue<TDate>|null
    {
        return this._value;
    }

    /**
     * Gets formatted value
     */
    public get formattedValue(): string|null
    {
        return this._formattedValue;
    }

    /**
     * Occurs when value changes
     */
    public get valueChange(): Observable<void>
    {
        return this._valueChange.asObservable();
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
     * Occurs when selector requires picker to be displayed
     */
    public get pickerRequest(): Observable<void>
    {
        return this._pickerRequest.asObservable();
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
     * Sets as 'control' disabled
     * @param disabled - Indication whether sets value as disabled, if omitted it is same as disabled set to true
     */
    public setDisabled(disabled?: boolean): void
    {
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
    }
}