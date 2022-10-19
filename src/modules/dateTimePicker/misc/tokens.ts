import {InjectionToken} from '@angular/core';

import {DateTimePickerDirectiveOptions} from '../directives/dateTimePicker/dateTimePicker.interface';

/**
 * Injection token for global options for date time picker directive
 */
export const DATE_TIME_PICKER_DIRECTIVE_OPTIONS: InjectionToken<Partial<DateTimePickerDirectiveOptions>> = new InjectionToken<Partial<DateTimePickerDirectiveOptions>>('DATE_TIME_PICKER_DIRECTIVE_OPTIONS');