import {Directive, ExistingProvider, forwardRef, Inject, OnDestroy} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNumber} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {DateTimeInput} from '../../../../interfaces';
import {DATE_TIME_INPUT} from '../../../../misc/tokens';
import {DateTimeInputOutputValue} from '../../../../misc/types';
import {DateTimeDirective} from '../dateTime/dateTime.directive';
import {DateTimeValueFormat} from '../../../../misc/enums';

/**
 * Control value accessor that is used for getting and setting value for date time
 */
@Directive(
{
    selector: '[dateTime][formControlName],[dateTime][formControl],[dateTime][ngModel]',
    providers:
    [
        <ExistingProvider>
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateTimeControlValueAccessorDirective),
            multi: true,
        },
    ],
})
export class DateTimeControlValueAccessorDirective<TDate = unknown> implements ControlValueAccessor, OnDestroy
{
    //######################### protected properties #########################

    /**
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

    //######################### constructor #########################
    constructor(@Inject(DATE_TIME_INPUT) protected input: DateTimeInput<TDate>,
                protected dateTime: DateTimeDirective<TDate>,)
    {
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this.initSubscriptions.unsubscribe();
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * @inheritdoc
     */
    public writeValue(value: DateTimeInputOutputValue<TDate>|undefined|null): void
    {
        if(this.dateTime.valueFormat == DateTimeValueFormat.UnixTimestamp)
        {
            if(!isNumber(value))
            {
                throw new Error('DateTimeControlValueAccessorDirective: value is not a number!');
            }
            else
            {
                value = value * 1000;
            }
        }

        this.input.value = value;
    }

    /**
     * @inheritdoc
     */
    public registerOnChange(fn: (data: DateTimeInputOutputValue<TDate>|undefined|null) => void): void
    {
        this.initSubscriptions.add(this.input.valueChange.subscribe(() =>
        {
            const value = this.input.value;

            if(this.dateTime.valueFormat == DateTimeValueFormat.UnixTimestamp && isNumber(value))
            {
                fn(value / 1000);
            }
            else
            {
                fn(this.input.value);
            }
        }));
    }

    /**
     * @inheritdoc
     */
    public registerOnTouched(fn: () => void): void
    {
        this.initSubscriptions.add(this.input.focus.subscribe(() => fn()));
    }

    /**
     * @inheritdoc
     */
    public setDisabledState(isDisabled: boolean): void
    {
        this.input.disabled = isDisabled;
    }
}
