import {Inject, Injectable} from '@angular/core';

import {DateTimeValue} from '../misc/datetime.interface';
import {DATE_API} from '../misc/tokens';
import {DateApi} from './dateApi.interface';

/**
 * Class used for obtaining DateTimeValue for various formats
 */
@Injectable({providedIn: 'root'})
export class DateValueProvider<TDate = any>
{
    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected _dateApi: DateApi<TDate>)
    {
    }

    //######################### public methods #########################

    /**
     * Gets DateTimeValue from single value based on format
     * @param value - Current value to be converted to ranged value
     * @param format - Format that is requested to be displayed, it tells what range should be created
     */
    public getValue(value: TDate, format: string): DateTimeValue<TDate>
    {
        let val = this._dateApi.getValue(value, format);
        let fullFormat = this._dateApi.getFormat(format);
        let start: TDate = value;
        let end: TDate;

        //day
        if(fullFormat.indexOf('d') >= 0 || fullFormat.indexOf('D') >= 0)
        {
            start = val.startOfDay().value;
            end = val.endOfDay().value;
        }
        //week
        else if(fullFormat.indexOf('w') >= 0)
        {
            start = val.startOfWeek().value;
            end = val.endOfWeek().value;
        }
        //month
        else if(fullFormat.indexOf('M') >= 0)
        {
            start = val.startOfMonth().value;
            end = val.endOfMonth().value;
        }
        //year
        else if(fullFormat.indexOf('Y') >= 0 || fullFormat.indexOf('y') >= 0)
        {
            start = val.startOfYear().value;
            end = val.endOfYear().value;
        }

        return {
            from: start,
            to: end!
        };
    }
}