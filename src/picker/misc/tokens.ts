import {InjectionToken} from '@angular/core';

import {DateTimePickerOptions} from './datetimePicker.interface';

/**
 * Injection token used for obtaining datetime picker configuration
 */
export const DATE_TIME_PICKER_CONFIGURATION: InjectionToken<DateTimePickerOptions<any>> = new InjectionToken<DateTimePickerOptions<any>>('DATE_TIME_PICKER_CONFIGURATION');