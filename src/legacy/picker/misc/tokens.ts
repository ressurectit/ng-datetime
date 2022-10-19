import {InjectionToken} from '@angular/core';

import {DateTimePickerLegacyOptions} from './datetimePicker.interface';

/**
 * Injection token used for obtaining datetime picker configuration
 */
export const DATE_TIME_PICKER_CONFIGURATION: InjectionToken<DateTimePickerLegacyOptions<any>> = new InjectionToken<DateTimePickerLegacyOptions<any>>('DATE_TIME_PICKER_CONFIGURATION');