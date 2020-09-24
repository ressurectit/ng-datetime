import {Type} from '@angular/core';
import {Observable} from 'rxjs';

import {DateTimeValue} from '../../misc/datetime.interface';
import {DateTimePickerOptions} from '../../picker';

/**
 * Defintion of datetime selector component options
 */
export interface DateTimeSelectorOptions<TSelector = any, TPicker = any> extends DateTimePickerOptions<TPicker>
{
    /**
     * Definition of type that is used for selector
     */
    selectorComponent: Type<TSelector>;
}

/**
 * Describes datetime selector component used for displaying and selecting value
 */
export interface DateTimeSelector<TDate = any>
{
    /**
     * Currently used format for displaying data
     */
    format: string;

    /**
     * Gets current value of datetime
     */
    readonly value: DateTimeValue<TDate>|null;

    /**
     * Gets formatted value
     */
    readonly formattedValue: string|null;

    /**
     * Gets indication whether is current value valid
     */
    readonly valid: boolean;

    /**
     * Occurs when value changes
     */
    readonly valueChange: Observable<void>;

    /**
     * Occurs when selector is touched by user
     */
    readonly touched: Observable<void>;

    /**
     * Occurs when selector requires picker to be displayed or hidden
     */
    readonly pickerRequest: Observable<boolean>;

    /**
     * Sets value of datetime selector
     * @param value - Value to be set to this selector
     */
    setValue(value: DateTimeValue<TDate>|null): void;

    /**
     * Sets as 'control' disabled
     * @param disabled - Indication whether sets value as disabled, if omitted it is same as disabled set to true
     */
    setDisabled(disabled?: boolean): void;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;
}