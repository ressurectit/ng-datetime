import {InjectionToken} from '@angular/core';

import {DateFnsLocale} from '../services/dateFnsLocale.service';

/**
 * Injection token used for obtaining Date fns locale service
 */
export const DATE_FNS_LOCALE: InjectionToken<DateFnsLocale> = new InjectionToken<DateFnsLocale>('DATE_FNS_LOCALE');