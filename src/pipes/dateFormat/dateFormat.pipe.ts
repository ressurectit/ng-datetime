import {Inject, Pipe, PipeTransform} from '@angular/core';
import {isBlank, isString, nameof} from '@jscrpt/common';

import {FormatProvider} from '../../interfaces';
import {DATE_API, FORMAT_PROVIDER} from '../../misc/tokens';
import {DateApi, DateValue} from '../../services';

/**
 * Pipe that is used for formatting date
 */
@Pipe({name: 'dateFormat'})
export class DateFormatPipe<TDate = unknown> implements PipeTransform
{
    //######################### constructors #########################
    constructor(@Inject(FORMAT_PROVIDER) private _formatProvider: FormatProvider,
                @Inject(DATE_API) private _dateApi: DateApi<TDate>)
    {
    }

    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Formats provided date into formatted string, with default format 'date'
     * @param value - value to be transformed
     */
    public transform(value: TDate|DateValue|undefined|null): string;
    /**
     * Formats provided date into formatted string
     * @param value - value to be transformed
     * @param format - predefined format that is used for formatting, one of 'FormatProvider' keys
     */
    public transform(value: TDate|DateValue|undefined|null, format: keyof FormatProvider): string;
    /**
     * Formats provided date into formatted string
     * @param value - value to be transformed
     * @param format - predefined format that is used for formatting, one of 'FormatProvider' keys
     * @param parseFormat - format used for parsing string date
     */
    public transform(value: TDate|DateValue|undefined|null, format: keyof FormatProvider, parseFormat: string): string;
    /**
     * Formats provided date into formatted string
     * @param value - value to be transformed
     * @param format - format that is used for formatting
     * @param customFormat - indication that custom format is used
     */
    public transform(value: TDate|DateValue|undefined|null, format: string, customFormat: true): string;
    /**
     * Formats provided date into formatted string
     * @param value - value to be transformed
     * @param format - format that is used for formatting
     * @param parseFormat - format used for parsing string date
     * @param customFormat - indication that custom format is used
     */
    public transform(value: TDate|DateValue|undefined|null, format: string, parseFormat: string, customFormat: true): string;
    public transform(value: TDate|DateValue|undefined|null, format: string|keyof FormatProvider = nameof<FormatProvider>('date'), parseFormatOrCustomFormat?: string|boolean, _customFormat?: boolean): string
    {
        if(isBlank(value))
        {
            return '';
        }

        const parseFormat: string|undefined = isString(parseFormatOrCustomFormat) ? parseFormatOrCustomFormat : undefined;

        //format provider value
        if(format in this._formatProvider)
        {
            format = (this._formatProvider)[format as keyof FormatProvider];
        }

        const dateObj = this._dateApi.getValue(value, parseFormat);

        if(dateObj.isValid())
        {
            return dateObj.format(this._dateApi.getFormat(format));
        }

        return '';
    }
}
