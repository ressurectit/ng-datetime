import {Directive, ExistingProvider, forwardRef, Input, OnDestroy} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Subscription} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DateTimeSelectorComponent} from '../../components/selector/selector.component';

/**
 * Value accessor provider for date time selector
 */
const DATE_TIME_SELECTOR_VALUE_ACCESSOR = <ExistingProvider>
{
    provide: NG_VALUE_ACCESSOR, 
    useExisting: forwardRef(() => DateTimeSelectorControlValueAccessor), 
    multi: true
};

/**
 * Value accessor for getting and setting values for date time selector
 */
@Directive(
{
    selector: 'date-time-selector[formControlName],date-time-selector[formControl],date-time-selector[ngModel]',
    providers: [DATE_TIME_SELECTOR_VALUE_ACCESSOR]
})
export class DateTimeSelectorControlValueAccessor<TDate> implements ControlValueAccessor, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Subscriptions that are destroyed on directive destruction
     */
    protected _subscriptions: Subscription = new Subscription();

    //######################### public properties - inputs #########################

    /**
     * Indication whether value for selector is represented as range from, to
     */
    @Input()
    public range: boolean = false;

    /**
     * Indication whether value for selector is represented as formatted string value, if both 'formatted' and 'range' are set, 'range' takes precedence
     */
    @Input()
    public formatted: boolean = false;

    //######################### constructor #########################
    constructor(protected _selector: DateTimeSelectorComponent<TDate>)
    {
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this._subscriptions?.unsubscribe();
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * Sets value to datetime selector
     */
    public writeValue(value: string|DateTimeValue<TDate>|TDate|null): void
    {
        if(this.range)
        {
            this._selector.value = value as DateTimeValue<TDate>;
        }
        else if(this.formatted)
        {
            this._selector.formattedValue = value as string;
        }
        else
        {
            this._selector.value =
            {
                from: value as TDate,
                to: value as TDate
            };
        }
    }

    /**
     * Registers callback that is called when value of datetime selector value changes
     */
    public registerOnChange(fn: (data: string|DateTimeValue<TDate>|TDate|null) => any): void
    {
        this._subscriptions.add(this._selector.valueChange.subscribe(() => this._emitValue(fn)));
    }

    /**
     * Registers callback that is called when datetime selector was touched by user
     */
    public registerOnTouched(fn: () => any): void
    {
        this._subscriptions.add(this._selector.touched.subscribe(() => fn()));
    }

    /**
     * Used for setting control as disabled
     * @param isDisabled - disabled status to set on the element
     */
    public setDisabledState(isDisabled: boolean): void
    {
        this._selector.setDisabled(isDisabled);
    }

    //######################### protected methods #########################

    /**
     * Used for emitting value that was changed
     * @param fn - Function that is used for emitting changed value
     */
    protected _emitValue(fn: (value: string|DateTimeValue<TDate>|TDate|null) => any): void
    {
        if(this.range)
        {
            fn(this._selector.value);
        }
        else if(this.formatted)
        {
            fn(this._selector.formattedValue);
        }
        else
        {
            const value = this._selector.value;

            if(!value)
            {
                fn(null);
            }
            else
            {
                fn(value.from);
            }
        }
    }
}
