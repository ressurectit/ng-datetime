import {Type} from '@angular/core';
import {Dictionary} from '@jscrpt/common';

import {DateTimePicker} from '../../interfaces';

/**
 * Defintion of date time picker component options
 */
export interface DateTimePickerOptions<TDate = unknown>
{
    /**
     * Definition of types for each period type for picker
     */
    periodsDefinition: Dictionary<Type<DateTimePicker<TDate>>>;

    /**
     * Name of default period for picker that is displayed after opening
     */
    defaultPeriod: string;
}