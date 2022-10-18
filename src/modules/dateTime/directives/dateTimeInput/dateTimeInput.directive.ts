import {Directive, ElementRef, EventEmitter, ExistingProvider, forwardRef, Inject, OnDestroy} from '@angular/core';
import {BindThis, isBlank} from '@jscrpt/common';

import {DateTimeInput, FormatProvider} from '../../../../interfaces';
import {DATE_API, DATE_TIME_INPUT, FORMAT_PROVIDER} from '../../../../misc/tokens';
import {DateTimeInputOutputValue, DateTimeObjectValue} from '../../../../misc/types';
import {formatDateTime, parseDateTime} from '../../../../misc/utils';
import {DateApi, DateValueProvider} from '../../../../services';
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
    exportAs: 'dateTime',
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
        //accepts all available formats
        this.setInternalValue(value);
        this.ɵValue = formatDateTime(this.internalValue, this.valueFormat, this.customFormat);
        
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
    public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    /**
     * @inheritdoc
     */
    public blur: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    //######################### constructors #########################
    constructor(protected element: ElementRef<HTMLInputElement>,
                @Inject(DATE_API) dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) formatProvider: FormatProvider,
                protected valueProvider: DateValueProvider<TDate>,)
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
     * Sets internal value and fix lowest time difference
     * @param value - Value to be set
     */
    protected setInternalValue(value: DateTimeInputOutputValue<TDate>|undefined|null): void
    {
        this.internalValue = parseDateTime(value, this.dateApi, null, this.customFormat);

        if(isBlank(this.internalValue))
        {
            return;
        }

        //ranged value
        if(Array.isArray(this.internalValue))
        {
            const [from, to] = this.internalValue;

            if(from)
            {
                const val = this.valueProvider.getValue(from.value, this.customFormat).from;

                if(val)
                {
                    this.internalValue[0] = this.dateApi.getValue(val, this.customFormat);
                }
            }

            if(to)
            {
                const val = this.valueProvider.getValue(to.value, this.customFormat).to;

                if(val)
                {
                    this.internalValue[1] = this.dateApi.getValue(val, this.customFormat);
                }
            }
        }
        else
        {
            const val = this.valueProvider.getValue(this.internalValue.value, this.customFormat).from;

            if(val)
            {
                this.internalValue = this.dateApi.getValue(val, this.customFormat);
            }
        }
    }

    /**
     * Handles input event on input
     */
    @BindThis
    protected handleInput(): void
    {
        if(!this.rawValue)
        {
            this.internalValue = null;
            this.ɵValue = null;

            this.valueChange.next();

            return;
        }

        this.setInternalValue(this.rawValue);
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