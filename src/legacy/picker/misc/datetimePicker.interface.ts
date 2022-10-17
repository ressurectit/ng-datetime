import {Type} from '@angular/core';
import {Dictionary} from '@jscrpt/common';
import {Observable} from 'rxjs';

import {DateTimeValue} from '../../../interfaces/dateTime/datetime.interface';
import {DateApiObject} from '../../../services/dateApi/dateApi.interface';

/**
 * Shared css classes for all pickers
 */
export interface CommonPickerCssClasses
{
    /**
     * Period selection element wrapping displayed period and previous, next buttons
     */
    periodSelection: string;

    /**
     * Element used for switching period to previous one
     */
    previousPeriod: string;

    /**
     * Element used for switching period to next one
     */
    nextPeriod: string;

    /**
     * Element representing currently displayed period
     */
    periodValue: string;

    /**
     * Element wrapping displayed period data
     */
    periodData: string;

    /**
     * Element representing single datum for period item
     */
    periodDatum: string;

    /**
     * Name of css class that represents clickable items in picker
     */
    clickable: string;
}

/**
 * Css classes applied to datetime picker
 */
export interface DateTimePickerCssClasses
{
    /**
     * Shared css classes for all pickers
     */
    pickerShared?: CommonPickerCssClasses;

    /**
     * Custom css classes specific for each picker type
     */
    pickerCustom?: Dictionary<object>;
}

/**
 * Defintion of datetime picker component options
 */
export interface DateTimePickerOptions<TPicker = any>
{
    /**
     * Order of pickers, it's possible use less pickers as is defined in pickerPeriodsDefinition for example 'month,year'
     */
    pickerPeriodsOrder: string[]|string|null;

    /**
     * Definition of types for each period type for picker
     */
    pickerPeriodsDefinition: Dictionary<Type<TPicker>>;

    /**
     * Name of default period for picker that is displayed
     */
    defaultPeriod: string;

    /**
     * Css classes for date time picker
     */
    cssClasses: DateTimePickerCssClasses;
}

/**
 * Describes datetime picker component used for displaying and selecting value
 */
export interface DateTimePicker<TDate = any, TCssClasses = object>
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
     * Sets css classes for picker, allowing to override defaults
     * @param cssClasses - Css classes to be set for picker
     */
    setCssClasses(cssClasses: TCssClasses): void;

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
     * Indication that this period item is active and selected
     */
    active: boolean;

    /**
     * Indication that this period item is disabled
     */
    disabled: boolean;

    /**
     * Date for this period item
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

/**
 * Data that represents year in date picker
 */
export interface YearData<TDate = any> extends PeriodData<TDate>
{
    /**
     * Value of year
     */
    value: number;
}
