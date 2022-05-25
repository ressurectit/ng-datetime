import {ClassProvider, FactoryProvider} from '@angular/core';
import {DATE_API_OBJECT_TYPE, FormatProvider, FORMAT_PROVIDER} from '@anglr/datetime';

import {momentDateApiObjectType} from '../services/momentDateApi.service';

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
            time: 'LT',
            year: 'YYYY',
            month: 'MM',
            week: 'ww',
            day: 'DD',
            hour: 'HH',
            minute: 'mm',
            second: 'ss',
            dayName: 'dddd',
            dayNameShort: 'dd',
            monthName: 'MMMM',
            monthNameShort: 'MMM'
        };
    }
};

/**
 * Injection token used for injecting type that creates instance of DateApiObject for moment
 */
export const MOMENT_DATE_API_OBJECT_TYPE: ClassProvider =
{
    provide: DATE_API_OBJECT_TYPE,
    useClass: momentDateApiObjectType
};