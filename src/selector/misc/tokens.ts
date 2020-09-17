import {InjectionToken} from '@angular/core';

import {DateTimeConfiguration} from '../../datetime';

/**
 * Injection token used for obtaining datetime selector configuration
 */
export const DATE_TIME_SELECTOR_CONFIGURATION: InjectionToken<DateTimeConfiguration<any>> = new InjectionToken<DateTimeConfiguration<any>>('DATE_TIME_SELECTOR_CONFIGURATION');