import {Type} from '@angular/core';
import {Dictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {DateTimeValue} from '../../misc/datetime.interface';
import {DateApiObject} from '../../services/dateApi.interface';

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
    display(value: DateApiObject<TDate>): void;

    /**
     * Sets indication whether can go down
     * @param value - Indication whether can go down in period
     */
    setCanGoDown(value: boolean): void;

    /**
     * Sets indication whether can go up
     * @param value - Indication whether can go up in period
     */
    setCanGoUp(value: boolean): void;

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    invalidateVisuals(): void;
}

/**
 * Data that represents data for any picker type
 */
export interface PeriodData<TDate = any>
{
    /**
     * Indication that this day is active and selected
     */
    active: boolean;

    /**
     * Date for this day
     */
    date: TDate;
}

/**
 * Data that represents day in date picker
 */
export interface DayData<TDate = any> extends PeriodData<TDate>
{
    /**
     * Indication that range is selected and this day is between selected dates
     */
    betweenActive: boolean;

    /**
     * Indication that this day is out of currently selected month
     */
    otherMonth: boolean;

    /**
     * Indication that this day is today
     */
    today: boolean;

    /**
     * Indication that this day is weekend day
     */
    weekend: boolean;

    /**
     * Day number of month
     */
    day: number;
}

/**
 * Data that represents month in date picker
 */
export interface MonthData<TDate = any> extends PeriodData<TDate>
{
    /**
     * Name of month
     */
    name: string;
}