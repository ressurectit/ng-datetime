import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {DateTimeValue, DATE_API} from '../../../datetime';
import {DateApi, DatePositionParser, DatePositionParserService} from '../../../services';
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

    /**
     * Instance of parser created for specific format
     */
    protected _parser: DatePositionParser|null = null;

    /**
     * Currently used format for displaying data
     */
    protected _format: string = '';

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

    //######################### public properties - template bindings #########################

    /**
     * String representation current of value
     * @internal
     */
    public currentValue: string|null = null;

    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected _dateApi: DateApi<TDate>,
                protected _parserSvc: DatePositionParserService,
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
        console.log(this.format, this._dateApi.getFormat(this.format));
        console.log(this._dateApi.now().format(this.format));
    }

    //######################### public methods - template bindings #########################

    public handleFocus(input: HTMLInputElement)
    {
        this.currentValue = this._dateApi.now().format(this.format);
        input.value = this.currentValue;

        console.log(this._parser?.parse(input.value, input.selectionStart!));
    }

    public handleBlur()
    {

    }

    public handleInput()
    {

    }

    public handleChange()
    {

    }

    public handleClick(input: HTMLInputElement)
    {
        this.currentValue = this._dateApi.now().format(this.format);
        input.value = this.currentValue;

        let result = this._parser!.parse(input.value, input.selectionStart!);

        console.log(result);

        input.selectionStart = result.positionFrom;
        input.selectionEnd = result.positionTo;
    }

    public handleSelect(input: HTMLInputElement)
    {
        console.log('select', input.selectionStart, input.selectionEnd);
    }

    public handleKeyboard(event: KeyboardEvent, input: HTMLInputElement)
    {
        console.log(event);

        switch(event.key)
        {
            case 'ArrowRight':
            {
                event.preventDefault();
                event.stopPropagation();

                let result = this._parser!.next(input.value, input.selectionStart!);

                console.log(result);

                if(result)
                {
                    input.selectionStart = result.positionFrom;
                    input.selectionEnd = result.positionTo;
                }

                break;
            }
            case 'ArrowLeft':
            {
                event.preventDefault();
                event.stopPropagation();

                let result = this._parser!.previous(input.value, input.selectionStart!);

                console.log(result);

                if(result)
                {
                    input.selectionStart = result.positionFrom;
                    input.selectionEnd = result.positionTo;
                }

                break;
            }
            case 'Tab':
            {
                let result = event.shiftKey ? this._parser!.previous(input.value, input.selectionStart!) : this._parser!.next(input.value, input.selectionStart!);

                if(result)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    input.selectionStart = result.positionFrom;
                    input.selectionEnd = result.positionTo;
                }

                break;
            }
        }
    }
}