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
        let regex = /([+-])\s*(\d+)\s*([hdwmy])/;

        //relative date provided
        if(isString(value) && regex.test(value))
        {
            let matches = regex.exec(value);
            let operation = matches![1];
            let amount = matches![2];
            let period = matches![3];
            this._dateApi = this._dateApi ?? this._injector.get(DATE_API);
            let now = this._dateApi.now();

            switch(period)
            {
                case "h":
                {
                    break;
                }
                case "d":
                {
                    operation == "+" ? now.addDays(+amount) : now.subtractDays(+amount);

                    break;
                }
                case "w":
                {
                    operation == "+" ? now.addWeeks(+amount) : now.subtractWeeks(+amount);

                    break;
                }
                case "m":
                {
                    operation == "+" ? now.addMonths(+amount) : now.subtractMonths(+amount);

                    break;
                }
                case "y":
                {
                    operation == "+" ? now.addYears(+amount) : now.subtractYears(+amount);

                    break;
                }
            }

            value = now.value;
        }

        return value;
    }
}