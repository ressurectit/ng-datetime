import {Directive, ElementRef, EventEmitter, ExistingProvider, forwardRef, Inject, Input, OnDestroy} from '@angular/core';
import {BindThis, isString} from '@jscrpt/common';

import {DateTimeInput, FormatProvider} from '../../../../interfaces';
import {DateTimeValueFormat} from '../../../../misc/enums';
import {DATE_API, DATE_TIME_INPUT, FORMAT_PROVIDER} from '../../../../misc/tokens';
import {DateTimeInputOutputValue, DateTimeObjectValue} from '../../../../misc/types';
import {formatDateTime, parseDateTime} from '../../../../misc/utils';
import {DateApi} from '../../../../services';

//TODO: range is unimplemented

/**
 * Directive that is used for setting up date time input
 */
@Directive(
{
    selector: 'input[dateTime]',
    providers:
    [
        <ExistingProvider>
        {
            provide: DATE_TIME_INPUT,
            useExisting: forwardRef(() => DateTimeInputDirective),
        },
    ],
})
export class DateTimeInputDirective<TDate = unknown> implements DateTimeInput, OnDestroy
{
    //######################### private fields #########################

    /**
     * Date time value format which is being worked with in this date time
     */
    private _valueFormat: DateTimeValueFormat = DateTimeValueFormat.DateInstance;

    /**
     * Value of date time
     */
    private _value: DateTimeInputOutputValue<TDate>|undefined|null;

    /**
     * Format of string representation of date
     */
    private _format: keyof FormatProvider = 'date';

    //######################### protected properties #########################

    /**
     * Internal representation of current date time value
     */
    protected internalValue: DateTimeObjectValue<TDate>|undefined|null;

    //######################### public properties - implementation of DateTimeInput #########################

    /**
     * @inheritdoc
     */
    public get rawValue(): string|undefined|null
    {
        return this.element.nativeElement.value;
    }
    public set rawValue(value: string|undefined|null)
    {
        this.element.nativeElement.value = value ?? '';
    }

    /**
     * @inheritdoc
     */
    public get value(): DateTimeInputOutputValue<TDate>|undefined|null
    {
        return this._value;
    }
    public set value(value: DateTimeInputOutputValue<TDate>|undefined|null)
    {
        this._value = value;

        //accepts all available formats
        this.internalValue = parseDateTime(value, this.dateApi, null, this.customFormat);
        
        //not range value
        if(!Array.isArray(this.internalValue))
        {
            this.rawValue = this.internalValue?.format(this.customFormat);
        }
        else
        {
            //TODO: add support for ranges
        }
    }

    /**
     * @inheritdoc
     */
    public get disabled(): boolean
    {
        return this.element.nativeElement.disabled;
    }
    public set disabled(value: boolean)
    {
        this.element.nativeElement.disabled = value;
    }

    /**
     * @inheritdoc
     */
    public valueChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * @inheritdoc
     */
    public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    /**
     * @inheritdoc
     */
    public blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    //######################### public properties - inputs #########################

    /**
     * Gets or sets date time value format which is being worked with in this date time
     */
    @Input()
    public get valueFormat(): DateTimeValueFormat
    {
        return this._valueFormat;
    }
    public set valueFormat(value: DateTimeValueFormat)
    {
        if(isString(value))
        {
            this._valueFormat = DateTimeValueFormat[value] as unknown as DateTimeValueFormat;

            return;
        }

        this._valueFormat = value;
    }

    /**
     * Gets or sets format of string representation of date
     */
    @Input()
    public get format(): keyof FormatProvider
    {
        return this._format;
    }
    public set format(value: keyof FormatProvider)
    {
        this._format = value;
        this.customFormat = this.dateApi.getFormat(this.formatProvider[value]);
    }

    /**
     * Custom format string representation of date
     */
    @Input()
    public customFormat: string = this.dateApi.getFormat(this.formatProvider[this._format]);

    //######################### constructors #########################
    constructor(protected element: ElementRef<HTMLInputElement>,
                @Inject(DATE_API) protected dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) protected formatProvider: FormatProvider,)
    {
        this.element.nativeElement.addEventListener('input', this.handleInput);
        this.element.nativeElement.addEventListener('focus', this.handleFocus);
        this.element.nativeElement.addEventListener('blur', this.handleBlur);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this.element.nativeElement.removeEventListener('input', this.handleInput);
        this.element.nativeElement.removeEventListener('focus', this.handleFocus);
        this.element.nativeElement.removeEventListener('blur', this.handleBlur);
    }

    //######################### protected methods #########################

    /**
     * Handles input event on input
     */
    @BindThis
    protected handleInput(): void
    {
        this.internalValue = parseDateTime(this.rawValue, this.dateApi, this.valueFormat, this.customFormat);
        this._value = formatDateTime(this.internalValue, this.valueFormat, this.customFormat);

        this.valueChange.next();
    }

    /**
     * Handles focus event on input
     * @param event - Event that occured
     */
    @BindThis
    protected handleFocus(event: FocusEvent): void
    {
        this.focus.emit(event);
    }

    /**
     * Handles blur event on input
     * @param event - Event that occured
     */
    @BindThis
    protected handleBlur(event: FocusEvent): void
    {
        this.blur.emit(event);
    }

    //######################### ng language server #########################
    
    /**
     * Custom input type for `valueFormat` input
     */
    public static ngAcceptInputType_valueFormat: keyof typeof DateTimeValueFormat|DateTimeValueFormat;
}