import {Directive, ElementRef, EventEmitter, ExistingProvider, forwardRef, Input, OnDestroy} from '@angular/core';
import {BindThis} from '@jscrpt/common';

import {DateTimeInput, DateTimeValue} from '../../../../interfaces';
import {DATE_TIME_INPUT} from '../../../../misc/tokens';

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
    public value: string|DateTimeValue<TDate>|TDate|undefined|null;

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
     * Indication whether value for date time input is represented as range from, to
     */
    @Input()
    public range: boolean = false;

    /**
     * Indication whether value for date time input is represented as formatted string value, if both 'formatted' and 'range' are set, 'range' takes precedence
     */
    @Input()
    public formatted: boolean = false;

    //######################### constructors #########################
    constructor(protected element: ElementRef<HTMLInputElement>,)
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
     * @param event - Event that occured
     */
    @BindThis
    protected handleInput(event: Event): void
    {
        console.log(event);

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