import {Observable} from 'rxjs';

import {DateTimeValue} from '../../datetime';

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
     * Occurs when value changes
     */
    readonly valueChange: Observable<void>;

    /**
     * Occurs when selector is touched by user
     */
    readonly touched: Observable<void>;

    /**
     * Occurs when selector was changed anyway
     */
    readonly anyChange: Observable<void>;

    /**
     * Occurs when selector requires picker to be displayed
     */
    readonly pickerRequest: Observable<void>;

    /**
     * Occurs when user scales up
     */
    readonly scaleUp: Observable<TDate>;

    /**
     * Occurs when user scales down
     */
    readonly scaleDown: Observable<TDate>;

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