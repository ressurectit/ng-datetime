import {EventEmitter} from '@angular/core';

import {DateTimeInputOutputValue} from '../../misc/types';

/**
 * Defines date time input and communication API for it
 */
export interface DateTimeInput<TDate = unknown>
{
    /**
     * Value of date time, raw string value which is visible to user
     */
    rawValue: string|undefined|null;

    /**
     * Current value of date time, could be string, unix timestamp, TDate object, or ranged DateTimeValue
     */
    value: DateTimeInputOutputValue<TDate>|undefined|null;

    /**
     * Indication whether is date time disabled
     */
    disabled: boolean;

    /**
     * Occurs when value changes
     */
    valueChange: EventEmitter<void>;

    /**
     * Occurs when input gains focus
     */
    focus: EventEmitter<FocusEvent>;

    /**
     * Occurs when input loses focus
     */
    blur: EventEmitter<FocusEvent>;
}