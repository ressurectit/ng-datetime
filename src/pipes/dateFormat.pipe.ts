import {Inject, Pipe, PipeTransform} from '@angular/core';
import {nameof} from '@jscrpt/common';

import {FormatProvider} from '../interfaces';
import {DATE_API, FORMAT_PROVIDER} from '../misc/tokens';
import {DateApi, DateValue} from '../services';

/**
 * Pipe that is used for formatting date
 */
@Pipe({name: 'dateFormat'})
export class DateFormatPipe<TDate = any> implements PipeTransform
{
    //######################### constructors #########################
    constructor(@Inject(FORMAT_PROVIDER) private _formatProvider: FormatProvider,
                @Inject(DATE_API) private _dateApi: DateApi<TDate>)
    {
    }

    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Formats provided date into formatted string
     * @param value - value to be transformed
     * @param format - Format that is used for formatting, can be also 'FormatProvider' key
     * @param parseFormat - format used for parsing string date
     */
    public transform(value: TDate|DateValue, format: string|keyof FormatProvider = nameof<FormatProvider>('date'), parseFormat?: string): string
    {
        //format provider value
        if(format in this._formatProvider)
        {
            format = (<any>this._formatProvider)[format];
        }

        const dateObj = this._dateApi.getValue(value, parseFormat);

        if(dateObj.isValid())
        {
            return dateObj.format(this._dateApi.getFormat(format));
        }

        return '';
    }
}