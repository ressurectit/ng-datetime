import {Inject, Pipe, PipeTransform} from '@angular/core';

import {DATE_API} from '../misc/tokens';
import {DateApi, DateApiObject, DateValue} from '../services';

/**
 * Pipe that is used for converting date
 */
@Pipe({name: 'dateConvert'})
export class DateConvertPipe<TDate = any> implements PipeTransform
{
    //######################### constructors #########################
    constructor(@Inject(DATE_API) private _dateApi: DateApi<TDate>)
    {
    }

    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Transforms value into date object
     * @param value - value to be transformed
     * @param parseFormat - format used for parsing string date
     */
    public transform(value: TDate|DateValue, parseFormat?: string): DateApiObject<TDate>|null
    {
        const dateObj = this._dateApi.getValue(value, parseFormat);

        if(dateObj.isValid())
        {
            return dateObj;
        }

        return null;
    }
}