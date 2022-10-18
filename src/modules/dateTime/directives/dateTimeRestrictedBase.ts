import {Directive, Input} from '@angular/core';
import {isBlank} from '@jscrpt/common';

import {DateTimeInput} from '../../../interfaces';
import {DateTimeInputOutputValue} from '../../../misc/types';
import {isDateTimeValue} from '../../../misc/utils';
import {DateTimeBase} from './dateTimeBase';

/**
 * Base class for date time directives with value restrictions
 */
@Directive()
export class DateTimeRestrictedBase<TDate = unknown> extends DateTimeBase<TDate>
{
    //######################### protected properties #########################

    /**
     * Max allowed value of date time
     */
    protected ɵMaxDateTime: TDate|undefined|null;

    /**
     * Min allowed value of date time
     */
    protected ɵMinDateTime: TDate|undefined|null;

    //######################### public properties - inputs #########################

    /**
     * Gets or sets max allowed date for date time
     */
    @Input()
    public get maxDateTime(): TDate|undefined|null
    {
        return this.ɵMaxDateTime;
    }
    public set maxDateTime(value: TDate|undefined|null)
    {
        if(isBlank(value))
        {
            this.ɵMaxDateTime = value;

            return;
        }

        let val: DateTimeInputOutputValue<TDate> = value;

        if(value instanceof DateTimeBase<TDate>)
        {
            if(isDateTimeValue(value.value))
            {
                throw new Error('DateTime: Unable to apply ranged date time input as value restriction!');
            }

            val = value.value as string|number|TDate;
        }
        
        const maxDateTime = this.dateApi.getValue(val, this.customFormat);

        if(maxDateTime.isValid())
        {
            this.ɵMaxDateTime = maxDateTime.value;
        }
    }

    /**
     * Gets or sets min allowed date for date time
     */
    @Input()
    public get minDateTime(): TDate|undefined|null
    {
        return this.ɵMinDateTime;
    }
    public set minDateTime(value: TDate|undefined|null)
    {
        if(isBlank(value))
        {
            this.ɵMinDateTime = value;

            return;
        }

        let val: DateTimeInputOutputValue<TDate> = value;

        if(value instanceof DateTimeBase<TDate>)
        {
            if(isDateTimeValue(value.value))
            {
                throw new Error('DateTime: Unable to apply ranged date time input as value restriction!');
            }

            val = value.value as string|number|TDate;
        }
        
        const minDateTime = this.dateApi.getValue(val, this.customFormat);

        if(minDateTime.isValid())
        {
            this.ɵMinDateTime = minDateTime.value;
        }
    }

    //######################### ng language server #########################
    
    /**
     * Custom input type for `maxDateTime` input
     */
    public static ngAcceptInputType_maxDateTime: string|number|DateTimeInput|Date;

    /**
     * Custom input type for `minDateTime` input
     */
    public static ngAcceptInputType_minDateTime: string|number|DateTimeInput|Date;
}
