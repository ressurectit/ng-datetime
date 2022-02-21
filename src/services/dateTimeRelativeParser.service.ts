import {Injectable, Injector} from '@angular/core';
import {isString} from '@jscrpt/common';

import {DATE_API} from '../misc/tokens';
import {DateApi, DateValue} from './dateApi.interface';

/**
 * Service used for parsing relative date time strings
 */
@Injectable({providedIn: 'root'})
export class DateTimeRelativeParser<TDate = any>
{
    //######################### protected fields #########################
    
    /**
     * Date api for handling
     */
    protected _dateApi?: DateApi<TDate>;

    //######################### constructor #########################
    constructor(protected _injector: Injector)
    {
    }

    //######################### public methods #########################

    /**
     * Tries to parse relative value and returns parsed TDate, otherwise returns input value
     * @param value - Value to be parsed
     */
    public parse(value: TDate|DateValue): TDate|DateValue
    {
        const regex = /([+-])\s*(\d+)\s*([hdwmy])/;

        //relative date provided
        if(isString(value) && regex.test(value))
        {
            const matches = regex.exec(value);
            const operation = matches![1];
            const amount = matches![2];
            const period = matches![3];
            this._dateApi = this._dateApi ?? this._injector.get(DATE_API);
            const now = this._dateApi.now();

            switch(period)
            {
                case 'h':
                {
                    break;
                }
                case 'd':
                {
                    operation == '+' ? now.addDays(+amount).endOfDay() : now.subtractDays(+amount).startOfDay();

                    break;
                }
                case 'w':
                {
                    operation == '+' ? now.addWeeks(+amount).endOfDay() : now.subtractWeeks(+amount).startOfDay();

                    break;
                }
                case 'm':
                {
                    operation == '+' ? now.addMonths(+amount).endOfDay() : now.subtractMonths(+amount).startOfDay();

                    break;
                }
                case 'y':
                {
                    operation == '+' ? now.addYears(+amount).endOfDay() : now.subtractYears(+amount).startOfDay();

                    break;
                }
            }

            value = now.value;
        }

        return value;
    }
}