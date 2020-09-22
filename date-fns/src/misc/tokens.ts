import {FactoryProvider, InjectionToken} from '@angular/core';
import {FormatProvider, FORMAT_PROVIDER} from '@anglr/datetime';

import {DateFnsLocale} from '../services/dateFnsLocale.service';

/**
 * Injection token used for obtaining Date fns locale service
 */
export const DATE_FNS_LOCALE: InjectionToken<DateFnsLocale> = new InjectionToken<DateFnsLocale>('DATE_FNS_LOCALE');

/**
 * Injection token used for obtaining date-fns FormatProvider implementation
 */
export const DATEFNS_FORMAT_PROVIDER: FactoryProvider =
{
    provide: FORMAT_PROVIDER,
    useFactory: () =>
    {
        return <FormatProvider>{
            date: 'P',
            dateTime: 'Pp',
            time: 'p'
        };
    }
};