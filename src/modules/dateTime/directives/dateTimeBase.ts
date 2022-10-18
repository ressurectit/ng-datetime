import {Directive, EventEmitter, Input} from '@angular/core';
import {isString} from '@jscrpt/common';

import {DateTimeInputValue, FormatProvider} from '../../../interfaces';
import {DateTimeValueFormat} from '../../../misc/enums';
import {DateTimeInputOutputValue} from '../../../misc/types';
import {DateApi} from '../../../services';

/**
 * Base class for date time directives, contains basic shared data
 */
@Directive()
export class DateTimeBase<TDate = unknown> implements DateTimeInputValue<TDate>
{
    //######################### protected properties #########################

    /**
     * Date time value format which is being worked with in this date time
     */
    protected ɵValueFormat: DateTimeValueFormat = DateTimeValueFormat.DateInstance;

    /**
     * Format of string representation of date
     */
    protected ɵFormat: keyof FormatProvider = 'date';

    /**
     * Current value of date time, could be string, unix timestamp, Date, TDate object, or ranged DateTimeValue
     */
    protected ɵValue: DateTimeInputOutputValue<TDate>|undefined|null;

    //######################### public properties - implementation of DateTimeInputValue #########################

    /**
     * @inheritdoc
     */
    public get value(): DateTimeInputOutputValue<TDate>|undefined|null
    {
        return this.ɵValue;
    }
    public set value(value: DateTimeInputOutputValue<TDate>|undefined|null)
    {
        this.ɵValue = value;
    }

    /**
     * @inheritdoc
     */
    public valueChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### public properties - inputs #########################

    /**
     * Gets or sets date time value format which is being worked with in this date time
     */
    @Input()
    public get valueFormat(): DateTimeValueFormat
    {
        return this.ɵValueFormat;
    }
    public set valueFormat(value: DateTimeValueFormat)
    {
        if(isString(value))
        {
            this.ɵValueFormat = DateTimeValueFormat[value] as unknown as DateTimeValueFormat;

            return;
        }

        this.ɵValueFormat = value;
    }

    /**
     * Gets or sets format of string representation of date
     */
    @Input()
    public get format(): keyof FormatProvider
    {
        return this.ɵFormat;
    }
    public set format(value: keyof FormatProvider)
    {
        this.ɵFormat = value;
        this.customFormat = this.dateApi.getFormat(this.formatProvider[value]);
    }

    /**
     * Custom format string representation of date
     */
    @Input()
    public customFormat: string = this.dateApi.getFormat(this.formatProvider[this.ɵFormat]);

    //######################### constructors #########################
    constructor(protected dateApi: DateApi<TDate>,
                protected formatProvider: FormatProvider,)
    {
    }

    //######################### ng language server #########################
    
    /**
     * Custom input type for `valueFormat` input
     */
    public static ngAcceptInputType_valueFormat: keyof typeof DateTimeValueFormat|DateTimeValueFormat;
}
