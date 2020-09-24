import {Type} from '@angular/core';
import {Dictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {DateTimeValue} from '../../misc/datetime.interface';

/**
 * Defintion of datetime picker component options
 */
export interface DateTimePickerOptions<TPicker = any>
{
    /**
     * Definition of types for each period type for picker
     */
    pickerPeriodsDefinition: Dictionary<Type<TPicker>>;

    /**
     * Name of default period for picker that is displayed
     */
    defaultPeriod: string;
}

/**
 * Describes datetime picker component used for displaying and selecting value
 */
export interface DateTimePicker<TDate = any>
{
    /**
     * Gets current value of datetime
     */
    readonly value: DateTimeValue<TDate>|null;

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
     * Sets value of datetime picker
     * @param value - Value to be set to this picker
     */
    setValue(value: DateTimeValue<TDate>|null): void;

    /**
     * Set displays date to be displayed
     * @param value - Value that identifies period that is going to be displayed
     */
    display(value: TDate): void;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;
}