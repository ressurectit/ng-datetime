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
    readonly value: DateTimeValue<TDate>;

    /**
     * Gets formatted value
     */
    readonly formattedValue: string;

    /**
     * Occurs when value changes
     */
    readonly valueChange: Observable<void>;

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
     * @param options - Additional options, emitChange defaults to true, if set to false valueChange did not fire
     */
    setValue(value: DateTimeValue<TDate>, options?: {emitChange?: boolean}): void;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;
}