import {Directive, ElementRef, EventEmitter, ExistingProvider, forwardRef, Inject, Input, OnDestroy} from '@angular/core';
import {BindThis} from '@jscrpt/common';

import {DATE_API, DATE_TIME_INPUT} from '../../misc/tokens';
import {DateTimeBase} from '../../modules/dateTime/directives/dateTimeBase';
import {DateTimeInput} from '../../interfaces';
import {DateTimeInputOutputValue, DateTimeObjectValue} from '../../misc/types';
import {formatDateTime, getInternalValue} from '../../misc/utils';
import {DateApi, DateValueProvider} from '../../services';

/**
 * Directive that is used for setting up date time input for button
 */
@Directive(
{
    selector: 'button[dateTime][dateTimeInput],a[dateTime][dateTimeInput]',
    providers:
    [
        <ExistingProvider>
        {
            provide: DATE_TIME_INPUT,
            useExisting: forwardRef(() => ButtonDateTimeInputDirective),
        },
    ],
    standalone: true,
    exportAs: 'dateTime',
})
export class ButtonDateTimeInputDirective<TDate = unknown> extends DateTimeBase<TDate> implements DateTimeInput, OnDestroy
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
    public rawValue: string|undefined|null;

    /**
     * @inheritdoc
     */
    @Input()
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
        //TODO: check if anchor
        return this.elementRef.nativeElement.disabled;
    }
    public set disabled(value: boolean)
    {
        this.elementRef.nativeElement.disabled = value;
    }

    /**
     * @inheritdoc
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
    constructor(protected elementRef: ElementRef<HTMLButtonElement>,
                @Inject(DATE_API) protected dateApi: DateApi<TDate>,
                protected valueProvider: DateValueProvider<TDate>,)
    {
        super();

        this.elementRef.nativeElement.addEventListener('click', this.handleClick);
        this.elementRef.nativeElement.addEventListener('blur', this.handleBlur);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public override ngOnDestroy(): void
    {
        super.ngOnDestroy();

        this.elementRef.nativeElement.removeEventListener('click', this.handleClick);
        this.elementRef.nativeElement.removeEventListener('blur', this.handleBlur);
    }

    //######################### protected methods #########################

    /**
     * Sets internal value and fix lowest time difference
     * @param value - Value to be set
     */
    protected setInternalValue(value: DateTimeInputOutputValue<TDate>|undefined|null): void
    {
        this.internalValue = getInternalValue(value, this.dateApi, this.dateTimeData, this.valueProvider);
    }

    /**
     * Handles focus event on input
     * @param event - Event that occured
     */
    @BindThis
    protected handleClick(event: FocusEvent): void
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