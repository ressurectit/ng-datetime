import {Inject, Pipe, PipeTransform} from '@angular/core';

import {DateApi, DateValue} from '../../services';
import {DATE_API} from '../../misc/tokens';

/**
 * Tests whether is provided date before tested date
 */
@Pipe({name: 'isBefore'})
export class IsBeforePipe<TDate = unknown> implements PipeTransform
{
    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected dateApi: DateApi<TDate>)
    {
    }

    //######################### public methods - implementation of PipeTransform #########################

    /**
     * Tests whether is provided date before tested date
     * @param value - Provided date to be tested whether is before
     * @param tested - Date to be tested against
     */
    public transform(value: TDate|DateValue|undefined|null, tested: TDate|DateValue|undefined|null): boolean
    {
        if(value && tested)
        {
            const dateValue = this.dateApi.getValue(value);
            const dateTested = this.dateApi.getValue(tested);

            if(dateValue.isBefore(dateTested))
            {
                return true;
            }
        }

        return false;
    }
}
