import {InjectionToken} from '@angular/core';

import {DateTimeSelectorOptions} from './datetimeSelector.interface';

/**
 * Injection token used for obtaining datetime selector configuration
 */
export const DATE_TIME_SELECTOR_CONFIGURATION: InjectionToken<DateTimeSelectorOptions<any>> = new InjectionToken<DateTimeSelectorOptions<any>>('DATE_TIME_SELECTOR_CONFIGURATION');