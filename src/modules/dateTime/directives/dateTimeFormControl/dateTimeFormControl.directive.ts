import {Directive, effect, Inject, inject, input, InputSignal, model, ModelSignal, OnDestroy} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';
import {LOGGER, Logger} from '@anglr/common';
import {isNumber} from '@jscrpt/common';
import {isEqual} from 'lodash-es';
import {Subscription} from 'rxjs';

import {DATE_TIME_INPUT} from '../../../../misc/tokens';
import {DateTimeInput} from '../../../../interfaces';
import {DateTimeDirective} from '../dateTime/dateTime.directive';
import {DateTimeValueFormat} from '../../../../misc/enums';
import {DateTimeInputOutputValue} from '../../../../misc/types';

/**
 * Form value control for DateTime
 */
@Directive(
{
    selector: '[dateTime][formField]',
})
export class DateTimeFormControl<TDate = unknown> implements FormValueControl<DateTimeInputOutputValue<TDate>|null|undefined>, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of logger for logging purposes
     */
    protected logger: Logger = inject(LOGGER);

    /**
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

    //######################### public properties - implementation of FormValueControl #########################

    /**
     * @inheritdoc
     */
    public readonly value: ModelSignal<DateTimeInputOutputValue<TDate>|null|undefined> = model<DateTimeInputOutputValue<TDate>|null|undefined>(undefined);

    /**
     * @inheritdoc
     */
    public checked: undefined;

    /**
     * @inheritdoc
     */
    public readonly disabled: InputSignal<boolean> = input(false);

    /**
     * @inheritdoc
     */
    public readonly readonly: InputSignal<boolean> = input(false);

    /**
     * @inheritdoc
     */
    public readonly touched: ModelSignal<boolean> = model(false);

    //######################### constructor #########################
    constructor(@Inject(DATE_TIME_INPUT) protected dateTimeInput: DateTimeInput<TDate>,
                protected dateTime: DateTimeDirective<TDate>,)
    {
        this.initSubscriptions.add(this.dateTimeInput.focus.subscribe(() => this.touched.set(true)));

        this.initSubscriptions.add(this.dateTimeInput.valueChange.subscribe(() =>
        {
            const value = this.dateTimeInput.value;

            if(this.dateTime.valueFormat == DateTimeValueFormat.UnixTimestamp && isNumber(value))
            {
                const val = value / 1000;
                this.logger.verbose('DateTime: Form control: setting control value "{{@(4)val}}"', {val});
                this.value.set(val);
            }
            else
            {
                this.logger.verbose('DateTime: Form control: setting control value "{{@(4)value}}"', {value});
                this.value.set(value);
            }
        }));

        effect(() => this.dateTimeInput.disabled = this.disabled() || this.readonly());

        effect(() =>
        {
            const value = this.value();

            if(!isEqual(this.dateTimeInput.value, value))
            {
                this.logger.verbose('DateTime: Form control: setting datetime value "{{@(4)value}}"', {value});
                this.dateTimeInput.value = value;
            }
        });
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * @inheritdoc
     */
    public ngOnDestroy(): void
    {
        this.initSubscriptions.unsubscribe();
    }
}
