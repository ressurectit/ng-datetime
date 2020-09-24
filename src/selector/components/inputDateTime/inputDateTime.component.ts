import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef, ElementRef, ViewChild} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {DateTimeValue, DATE_API} from '../../../datetime';
import {DateApi, DateApiObject, DatePositionParser, DatePositionParserService, DateValueProvider} from '../../../services';
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
     * Instance of parser created for specific format
     */
    protected _parser: DatePositionParser|null = null;

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
    protected _isValid: boolean = false;

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
        //only if format changes
        if(this._format != value)
        {
            this._parser = this._parserSvc.createParser(this._dateApi.getFormat(value));
        }

        this._format = value;
    }

    /**
     * Gets current value of datetime
     */
    public get value(): DateTimeValue<TDate>|null
    {
        if(!this._dateApiValue)
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
                protected _parserSvc: DatePositionParserService,
                protected _valueProvider: DateValueProvider<TDate>,
                protected _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods - implementation of DateTimeSelector #########################

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
            this._dateApiValue = null;
            this._isValid = false;
            this.currentValue = null;
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
            this._valueChange.next();
        }

        if(!this._isValid)
        {
            return;
        }

        this._show();

        let result = this._parser!.parse(this.currentValue!, this.input.selectionStart!);

        this.input.selectionStart = result.positionFrom;
        this.input.selectionEnd = result.positionTo;
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
            this._dateApiValue = null;
            this._isValid = false;
            this._valueChange.next();

            return;
        }

        this._dateApiValue = this._dateApi.getValue(this.currentValue, this._format);
        this._isValid = this._dateApiValue.isValid();
        this._valueChange.next();
    }

    /**
     * Handles selection of text inside of input
     * @internal
     */
    public handleSelect()
    {
        //handles when all text is selected
        if(this.currentValue && this.input.selectionStart == 0 && this.input.selectionEnd == this.input.value.length)
        {
            let result = this._parser!.parse(this.input.value, this.input.selectionStart!);

            this.input.selectionStart = result.positionFrom;
            this.input.selectionEnd = result.positionTo;
        }
    }

    /**
     * Handles click event inside of input
     * @internal
     */
    public handleClick()
    {
        this._pickerRequest.next(true);

        if(!this._dateApiValue)
        {
            return;
        }

        let result = this._parser!.parse(this.input.value, this.input.selectionStart!);

        this.input.selectionStart = result.positionFrom;
        this.input.selectionEnd = result.positionTo;
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

                let result = event.key == 'ArrowLeft' ? this._parser!.previous(this.input.value, this.input.selectionStart!) : this._parser!.next(this.input.value, this.input.selectionStart!);

                if(result)
                {
                    this.input.selectionStart = result.positionFrom;
                    this.input.selectionEnd = result.positionTo;
                }

                break;
            }
            case 'ArrowUp':
            case 'ArrowDown':
            {
                event.preventDefault();
                event.stopPropagation();

                let result = this._parser!.parse(this.input.value, this.input.selectionStart!);
                let selectionStart = result.positionFrom;

                this._stepChangeValue(result.part, event.key == 'ArrowUp');
                this._show();

                result = this._parser!.parse(this.input.value, selectionStart);

                this.input.selectionStart = result.positionFrom;
                this.input.selectionEnd = result.positionTo;

                break;
            }
            case 'Tab':
            {
                let result = event.shiftKey ? this._parser!.previous(this.input.value, this.input.selectionStart!) : this._parser!.next(this.input.value, this.input.selectionStart!);

                if(result)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    this.input.selectionStart = result.positionFrom;
                    this.input.selectionEnd = result.positionTo;
                }

                break;
            }
            case 'a':
            {
                if(event.ctrlKey)
                {
                    event.preventDefault();
                    event.stopPropagation();
                }

                break;
            }
            case 'Backspace':
            {
                this.currentValue = null;

                break;
            }
        }
    }

    //######################### protected methods #########################

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

    /**
     * Changes current value of date for for specified part by single step
     * @param part - Part of date that should be changed
     * @param increment - Indication whether value should be incremented or decremented
     */
    protected _stepChangeValue(part: string, increment: boolean)
    {
        if(!this._dateApiValue?.isValid())
        {
            return;
        }

        switch(part)
        {
            case 'y':
            case 'Y':
            {
                increment ? this._dateApiValue.addYears(1) : this._dateApiValue.subtractYears(1);
                this._valueChange.next();

                break;
            }
            case 'Q':
            {
                break;
            }
            case 'M':
            {
                increment ? this._dateApiValue.addMonths(1) : this._dateApiValue.subtractMonths(1);
                this._valueChange.next();

                break;
            }
            case 'w':
            {
                increment ? this._dateApiValue.addWeeks(1) : this._dateApiValue.subtractWeeks(1);
                this._valueChange.next();

                break;
            }
            case 'd':
            case 'D':
            {
                increment ? this._dateApiValue.addDays(1) : this._dateApiValue.subtractDays(1);
                this._valueChange.next();

                break;
            }
        }
    }
}