import {Directive, ElementRef, EventEmitter, ExistingProvider, forwardRef, Inject, OnDestroy} from '@angular/core';
import {BindThis} from '@jscrpt/common';

import {DateTimeInput} from '../../../../interfaces';
import {DATE_API, DATE_TIME_INPUT} from '../../../../misc/tokens';
import {DateTimeInputOutputValue, DateTimeObjectValue} from '../../../../misc/types';
import {formatDateTime, getInternalValue} from '../../../../misc/utils';
import {DateApi, DateValueProvider} from '../../../../services';
import {DateTimeBase} from '../dateTimeBase';
import {DateTimeValueFormat} from '../../../../misc/enums';

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
        return this.elementRef.nativeElement.value;
    }
    public set rawValue(value: string|undefined|null)
    {
        this.elementRef.nativeElement.value = value ?? '';
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
        this.ɵValue = formatDateTime(this.internalValue, this.dateTimeData.valueFormat, this.dateTimeData.customFormat, this.dateTimeData.dataFormat);

        //not range value
        if(!Array.isArray(this.internalValue))
        {
            this.rawValue = this.internalValue?.format(this.dateTimeData.customFormat);
        }
        else
        {
            //TODO: add support for ranges
        }

        this.valueSet.next();
    }

    /**
     * @inheritdoc
     */
    public get disabled(): boolean
    {
        return this.elementRef.nativeElement.disabled;
    }
    public set disabled(value: boolean)
    {
        this.elementRef.nativeElement.disabled = value;
    }

    /**
     * Html element that represents input itself
     */
    public get element(): HTMLElement
    {
        return this.elementRef.nativeElement;
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
    constructor(protected elementRef: ElementRef<HTMLInputElement>,
                @Inject(DATE_API) protected dateApi: DateApi<TDate>,
                protected valueProvider: DateValueProvider<TDate>,)
    {
        super();

        this.elementRef.nativeElement.addEventListener('input', this.handleInput);
        this.elementRef.nativeElement.addEventListener('focus', this.handleFocus);
        this.elementRef.nativeElement.addEventListener('blur', this.handleBlur);
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public override ngOnDestroy(): void
    {
        super.ngOnDestroy();

        this.elementRef.nativeElement.removeEventListener('input', this.handleInput);
        this.elementRef.nativeElement.removeEventListener('focus', this.handleFocus);
        this.elementRef.nativeElement.removeEventListener('blur', this.handleBlur);
    }

    //######################### protected methods #########################

    /**
     * Sets internal value and fix lowest time difference
     * @param value - Value to be set
     * @param dateTimeFormat - Date time format type, optional, if not specified autodetection of format will be used, used when obtaining value from users input
     */
    protected setInternalValue(value: DateTimeInputOutputValue<TDate>|undefined|null,
                               dateTimeFormat: DateTimeValueFormat|undefined|null = null,): void
    {
        this.internalValue = getInternalValue(value, this.dateApi, this.dateTimeData, this.valueProvider, dateTimeFormat);
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

            this.valueSet.next();
            this.valueChange.next();

            return;
        }

        this.setInternalValue(this.rawValue, DateTimeValueFormat.FormattedString);
        this.ɵValue = formatDateTime(this.internalValue, this.dateTimeData.valueFormat, this.dateTimeData.customFormat, this.dateTimeData.dataFormat);

        this.valueSet.next();
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
