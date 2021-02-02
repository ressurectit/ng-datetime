import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef, ElementRef, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API} from '../../../misc/tokens';
import {DateApi, DateApiObject} from '../../../services';
import {DateValueProvider} from '../../../services/dateValueProvider.service';
import {DateTimeSelector} from '../../misc/datetimeSelector.interface';

/**
 * Component used as datetime selector with simple input
 */
@Component(
{
    selector: 'simple-input-date-time-selector',
    templateUrl: 'simpleInputDateTime.component.html',
    styleUrls: ['simpleInputDateTime.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleInputDateTimeSelectorComponent<TDate = any> implements DateTimeSelector<TDate>
{
    //######################### protected fields #########################

    /**
     * Occurs when value changes
     */
    protected _valueChange: Subject<void> = new Subject<void>();

    /**
     * Occurs when selector is touched by user
     */
    protected _touched: Subject<void> = new Subject<void>();

    /**
     * Occurs when selector requires picker to be displayed or hidden
     */
    protected _pickerRequest: Subject<boolean> = new Subject<boolean>();

    /**
     * Currently used format for displaying data
     */
    protected _format: string = '';

    /**
     * Current value representation as date api wrapper
     */
    protected _dateApiValue: null|DateApiObject<TDate> = null;

    /**
     * Indication whether is current value valid value
     */
    protected _isValid: boolean = true;

    /**
     * Minimal possible value that can be picked
     */
    protected _minValue: TDate|null = null;

    /**
     * Maximal possible value that can be picked
     */
    protected _maxValue: TDate|null = null;

    //######################### public properties - implementation of DateTimeSelector #########################

    /**
     * Gets or sets currently used format for displaying data
     */
    public get format(): string
    {
        return this._format;
    }
    public set format(value: string)
    {
        this._format = value;
    }

    /**
     * Gets or sets placeholder that is displayed when there is no value selected
     */
    public placeholder: string|undefined;

    /**
     * Gets current value of datetime
     */
    public get value(): DateTimeValue<TDate>|null
    {
        if(!this._dateApiValue || !this._isValid)
        {
            return null;
        }

        return this._valueProvider.getValue(this._dateApiValue.value, this._format);
    }

    /**
     * Gets formatted value
     */
    public get formattedValue(): string|null
    {
        if(!this._isValid)
        {
            return null;
        }

        return this.currentValue;
    }

    /**
     * Gets indication whether is current value valid
     */
    public get valid(): boolean
    {
        return this._isValid;
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
     * Occurs when selector requires picker to be displayed
     */
    public get pickerRequest(): Observable<boolean>
    {
        return this._pickerRequest.asObservable();
    }

    //######################### public properties - template bindings #########################

    /**
     * Indication whether is input disabled
     * @internal
     */
    public disabled: boolean = false;

    //######################### public properties - children #########################

    /**
     * Instance of html input element
     * @internal
     */
    @ViewChild('input', {static: true})
    public inputElement?: ElementRef<HTMLInputElement>;

    //######################### protected properties #########################

    /**
     * Gets or sets string representation current of value
     */
    protected get currentValue(): string|null
    {
        return this.input.value || null;
    }
    protected set currentValue(value: string|null)
    {
        if(this.input)
        {
            this.input.value = value ?? '';
        }
    }

    /**
     * Gets input element used for handling date time value
     */
    protected get input(): HTMLInputElement
    {
        return this.inputElement!.nativeElement;
    }

    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected _dateApi: DateApi<TDate>,
                protected _valueProvider: DateValueProvider<TDate>,
                protected _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods - implementation of DateTimeSelector #########################

    /**
     * Sets minimal possible value for picker, that can be picked
     * @param value - Minimal possible value that can be picked
     */
    public setMinValue(value: TDate|null): void
    {
        this._minValue = value;
    }

    /**
     * Sets maximal possible value for picker, that can be picked
     * @param value - Maximal possible value that can be picked
     */
    public setMaxValue(value: TDate|null): void
    {
        this._maxValue = value;
    }

    /**
     * Sets value of datetime selector
     * @param value - Value to be set to this selector
     */
    public setValue(value: DateTimeValue<TDate>|null): void
    {
        if(value?.from)
        {
            this._dateApiValue = this._dateApi.getValue(value?.from, this._format);
            this._isValid = this._dateApiValue.isValid();

            this._show();
        }
        else
        {
            this._clearValue();
        }
    }

    /**
     * Sets as 'control' disabled
     * @param disabled - Indication whether sets value as disabled, if omitted it is same as disabled set to true
     */
    public setDisabled(disabled: boolean = true): void
    {
        this.disabled = disabled;
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    //######################### public methods - template bindings #########################

    /**
     * Handles gaining of focus
     * @internal
     */
    public handleFocus()
    {
        this._pickerRequest.next(true);

        //no value
        if(!this._dateApiValue)
        {
            this._dateApiValue = this._dateApi.now();
            this._isValid = this._dateApiValue.isValid();

            if(this._minMaxConstraintTest())
            {
                this._clearValue();
            }
            else
            {
                this._valueChange.next();
            }
        }

        if(!this._isValid)
        {
            return;
        }

        this._show();
    }

    /**
     * Handles blur on input
     * @internal
     */
    public handleBlur()
    {
        this._pickerRequest.next(false);
    }

    /**
     * Handles user input
     * @internal
     */
    public handleInput()
    {
        //empty value
        if(!this.currentValue)
        {
            this._clearValue();
            this._valueChange.next();

            return;
        }

        this._dateApiValue = this._dateApi.getValue(this.currentValue, this._format);
        this._isValid = this._dateApiValue.isValid();
        this._valueChange.next();
    }

    /**
     * Handles click event inside of input
     * @internal
     */
    public handleClick()
    {
        this._pickerRequest.next(true);
    }

    /**
     * Handles keyboard events
     * @param event - Keyboard event that occured
     * @param input - Html input element that holds current value and selection
     * @internal
     */
    public handleKeyboard(event: KeyboardEvent)
    {
        if(!this._dateApiValue?.isValid())
        {
            return;
        }

        switch(event.key)
        {
            case 'ArrowRight':
            case 'ArrowLeft':
            {
                event.preventDefault();
                event.stopPropagation();

                this._withMinMaxConstraint(() => event.key == 'ArrowLeft' ? this._dateApiValue!.subtractDays(1) : this._dateApiValue!.addDays(1));
                this._show();

                break;
            }
            case 'ArrowUp':
            case 'ArrowDown':
            {
                event.preventDefault();
                event.stopPropagation();

                this._withMinMaxConstraint(() => event.key == 'ArrowUp' ? this._dateApiValue!.subtractWeeks(1) : this._dateApiValue!.addWeeks(1));
                this._show();

                break;
            }
            case 'Escape':
            {
                this._pickerRequest.next(false);

                break;
            }
            case ' ':
            {
                if(event.ctrlKey)
                {
                    this._pickerRequest.next(true);
                }

                break;
            }
        }
    }

    //######################### protected methods #########################

    /**
     * Clears current value
     */
    protected _clearValue()
    {
        this._dateApiValue = null;
        this._isValid = true;
        this.currentValue = null;
    }

    /**
     * Tests whether are min or max constraint broken, returns true if constraint is broken
     */
    protected _minMaxConstraintTest(): boolean
    {
        return (!!this._minValue && this._dateApiValue!.isBefore(this._minValue)) ||
               (!!this._maxValue && this._dateApiValue!.isAfter(this._maxValue));
    }

    /**
     * Runs code with check whether min max constrains was broken
     * @param code - Code that should be executed which can change current value
     */
    protected _withMinMaxConstraint(code: () => void)
    {
        this._dateApiValue!.updateOriginal();

        code();

        //min value constraint failure
        if(this._minMaxConstraintTest())
        {
            this._dateApiValue?.resetOriginal();

            return;
        }

        this._valueChange.next();
    }

    /**
     * Shows current value in input
     */
    protected _show()
    {
        if(this._isValid)
        {
            this.currentValue = this._dateApiValue?.format(this._format) ?? null;
        }
    }
}