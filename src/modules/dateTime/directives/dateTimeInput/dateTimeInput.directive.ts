import {Directive, ElementRef, EventEmitter, ExistingProvider, forwardRef, Inject, OnDestroy} from '@angular/core';
import {BindThis} from '@jscrpt/common';

import {DateTimeInput, FormatProvider} from '../../../../interfaces';
import {DATE_API, DATE_TIME_INPUT, FORMAT_PROVIDER} from '../../../../misc/tokens';
import {DateTimeInputOutputValue, DateTimeObjectValue} from '../../../../misc/types';
import {formatDateTime, parseDateTime} from '../../../../misc/utils';
import {DateApi} from '../../../../services';
import {DateTimeBase} from '../dateTimeBase';

//TODO: range is unimplemented

/**
 * Directive that is used for setting up date time input
 */
@Directive(
{
    selector: 'input[dateTime][dateTimeInput]',
    providers:
    [
        <ExistingProvider>
        {
            provide: DATE_TIME_INPUT,
            useExisting: forwardRef(() => DateTimeInputDirective),
        },
    ],
})
export class DateTimeInputDirective<TDate = unknown> extends DateTimeBase<TDate> implements DateTimeInput, OnDestroy
{
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
    public override get value(): DateTimeInputOutputValue<TDate>|undefined|null
    {
        return this.ɵValue;
    }
    public override set value(value: DateTimeInputOutputValue<TDate>|undefined|null)
    {
        this.ɵValue = value;

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

    //######################### constructors #########################
    constructor(protected element: ElementRef<HTMLInputElement>,
                @Inject(DATE_API) dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) formatProvider: FormatProvider,)
    {
        super(dateApi, formatProvider);

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
        this.ɵValue = formatDateTime(this.internalValue, this.valueFormat, this.customFormat);

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
}