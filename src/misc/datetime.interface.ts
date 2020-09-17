import {Type} from '@angular/core';
import {Dictionary} from '@jscrpt/common';

/**
 * Defintion of datetime component configuration
 */
export interface DateTimeConfiguration<TComponent = any>
{
    /**
     * Definition of types for each period type
     */
    periodsDefinition: Dictionary<Type<TComponent>>;

    /**
     * Name of default period that is displayed
     */
    defaultPeriod: string;
}

/**
 * Represents datetime value as period
 */
export interface DateTimeValue<TDate = any>
{
    /**
     * Starting date and time of period
     */
    from: TDate;

    /**
     * Ending date and time of period
     */
    to: TDate;
}