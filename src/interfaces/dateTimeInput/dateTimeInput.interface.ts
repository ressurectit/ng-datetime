import {EventEmitter} from '@angular/core';

import {DateTimeInputOutputValue} from '../../misc/types';

/**
 * Defines date time input value API
 */
export interface DateTimeInputValue<TDate = unknown>
{
    /**
     * Current value of date time, could be string, unix timestamp, Date, TDate object, or ranged DateTimeValue
     */
    value: DateTimeInputOutputValue<TDate>|undefined|null;

    /**
     * Occurs when value changes
     */
    valueChange: EventEmitter<void>;
}
/**
 * Defines date time input and communication API for it
 */
export interface DateTimeInput<TDate = unknown> extends DateTimeInputValue<TDate>
{
    /**
     * Value of date time, raw string value which is visible to user
     */
    rawValue: string|undefined|null;

    /**
     * Indication whether is date time disabled
     */
    disabled: boolean;

    /**
     * Occurs when input gains focus
     */
    focus: EventEmitter<FocusEvent>;

    /**
     * Occurs when input loses focus
     */
    blur: EventEmitter<FocusEvent>;
}