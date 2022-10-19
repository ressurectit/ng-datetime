import {Type} from '@angular/core';
import {PositionOptions} from '@anglr/common';
import {Observable} from 'rxjs';

import {DateTimeValue} from '../../../interfaces/dateTime/datetime.interface';
import {DateTimePickerLegacyOptions} from '../../picker/misc/datetimePicker.interface';

/**
 * Defintion of datetime selector component options
 */
export interface DateTimeSelectorOptions<TSelector = any, TPicker = any> extends DateTimePickerLegacyOptions<TPicker>
{
    /**
     * Definition of type that is used for selector
     */
    selectorComponent: Type<TSelector>;

    /**
     * Indication whether close picker on value selection
     */
    pickerCloseOnValueSelect: boolean;

    /**
     * Indication whether picker is disabled
     */
    pickerDisabled: boolean;

    /**
     * Indication whether use absolute positioning of picker
     */
    pickerAbsolute: boolean;

    /**
     * Position options that are used in case of absolute picker
     */
    positionOptions: Partial<PositionOptions>;

    /**
     * Css selector for absolute picker container
     */
    pickerAbsoluteContainer: string;
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
     * Placeholder that is displayed when there is no value selected
     */
    placeholder: string|null;

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
     * Sets minimal possible value for picker, that can be picked
     * @param value - Minimal possible value that can be picked
     */
    setMinValue(value: TDate|null): void;

    /**
     * Sets maximal possible value for picker, that can be picked
     * @param value - Maximal possible value that can be picked
     */
    setMaxValue(value: TDate|null): void;

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