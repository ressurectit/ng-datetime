import {FactoryProvider} from '@angular/core';
import {FormatProvider, FORMAT_PROVIDER} from '@anglr/datetime';

/**
 * Injection token used for obtaining moment FormatProvider implementation
 */
export const MOMENT_FORMAT_PROVIDER: FactoryProvider =
{
    provide: FORMAT_PROVIDER,
    useFactory: () =>
    {
        return <FormatProvider>{
            date: 'L',
            dateTime: 'L LT',
            time: 'LT'
        };
    }
};