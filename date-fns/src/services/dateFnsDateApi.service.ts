import {Inject, Injectable, ValueProvider} from '@angular/core';
import {DateApi, DateValue, DateApiObject, DateTimeRelativeParser, DateApiObjectCtor, DATE_API_OBJECT_TYPE} from '@anglr/datetime';
import {isBlank, isPresent, isString} from '@jscrpt/common';
import {toDate, getDate, setDate, isAfter, isBefore, differenceInCalendarDays, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, addMonths, addWeeks, addDays, subMonths, subWeeks, subDays, getDaysInMonth, isSameDay, isSameWeek, isSameMonth, isValid, parse, parseISO, addYears, subYears, startOfYear, endOfYear, isWeekend, setYear, getYear, isSameYear, startOfDecade, endOfDecade, setMonth, getMonth, setISODay, getISODay, subHours, addHours, endOfHour, startOfHour, startOfMinute, endOfMinute, addMinutes, subMinutes, getHours, setHours, getMinutes, setMinutes, isDate, getUnixTime} from 'date-fns';

import {DATE_FNS_LOCALE} from '../misc/tokens';
import {DateFnsLocale} from './dateFnsLocale.service';

/**
 * Instance of object wrapping TDate, allowing manipulation with it
 */
export class DateFnsDateApiObject implements DateApiObject<Date>
{
    //######################### protected fields #########################

    /**
     * Original value that is not changed unless 'updateOriginal' is called
     */
    protected _originalValue: Date;

    /**
     * Instance of date
     */
    protected _value: Date;

    //######################### public properties - implementation of DateApiObject #########################

    /**
     * Original value that is not changed unless 'updateOriginal' is called
     */
    public get originalValue(): Date
    {
        return this._originalValue;
    }

    /**
     * Instance of date
     */
    public get value(): Date
    {
        return this._value;
    }

    //######################### constructor #########################
    constructor(value: DateValue|Date,
                format: string|null|undefined,
                protected _localeSvc: DateFnsLocale)
    {
        if(isString(value))
        {
            //ISO string
            if(/^\d+-\d+-\d+(T\d+:\d+:\d+)?/.test(value))
            {
                this._value = this._originalValue = parseISO(value);
            }
            else
            {
                if(isBlank(format))
                {
                    throw new Error('date-fns requires format parameter to be set for parsing non ISO string date!');
                }

                this._value = this._originalValue = parse(value, format, new Date(1970, 0));
            }
        }
        else
        {
            this._value = this._originalValue = toDate(value);
        }
    }

    //######################### public methods - implementation of DateApiObject #########################

    /**
     * Gets indication whether provided instance of date is valid
     */
    public isValid(): boolean
    {
        return isValid(this._value);
    }

    /**
     * Gets indication whether provided instance of date is weekend day
     */
    public isWeekend(): boolean
    {
        return isWeekend(this._value);
    }

    /**
     * Formats date value
     * @param formatString - Format token used for creating formatted string
     */
    public format(formatString: string): string
    {
        return format(this._value, formatString, {locale: this._localeSvc.locale});
    }

    /**
     * @inheritdoc
     */
    public unixTimestamp(): number
    {
        return getUnixTime(this._value);
    }

    /**
     * Updates value to start date and time of current decade
     * @returns Itself for fluent API
     */
    public startOfDecade(): DateApiObject<Date>
    {
        this._value = startOfDecade(this._value);
        
        return this;
    }

    /**
     * Updates value to end date and time of current decade
     * @returns Itself for fluent API
     */
    public endOfDecade(): DateApiObject<Date>
    {
        this._value = endOfDecade(this._value);
        
        return this;
    }

    /**
     * Updates value to start date and time of current year
     * @returns Itself for fluent API
     */
    public startOfYear(): DateApiObject<Date>
    {
        this._value = startOfYear(this._value);

        return this;
    }

    /**
     * Updates value to end date and time of current year
     * @returns Itself for fluent API
     */
    public endOfYear(): DateApiObject<Date>
    {
        this._value = endOfYear(this._value);

        return this;
    }

    /**
     * Add years, if count not specified adds 1 year
     * @param count - Number of years count
     * @returns Itself for fluent API
     */
    public addYears(count?: number): DateApiObject<Date>
    {
        this._value = addYears(this._value, count ?? 1);

        return this;
    }

    /**
     * Subtract years, if count not specified subtract 1 year
     * @param count - Number of years count
     * @returns Itself for fluent API
     */
    public subtractYears(count?: number): DateApiObject<Date>
    {
        this._value = subYears(this._value, count ?? 1);

        return this;
    }

    /**
     * Updates value to start date and time of current month
     * @returns Itself for fluent API
     */
    public startOfMonth(): DateApiObject<Date>
    {
        this._value = startOfMonth(this._value);

        return this;
    }

    /**
     * Updates value to end date and time of current month
     * @returns Itself for fluent API
     */
    public endOfMonth(): DateApiObject<Date>
    {
        this._value = endOfMonth(this._value);

        return this;
    }

    /**
     * Add months, if count not specified adds 1 month
     * @param count - Number of months count
     * @returns Itself for fluent API
     */
    public addMonths(count?: number): DateApiObject<Date>
    {
        this._value = addMonths(this._value, count ?? 1);

        return this;
    }

    /**
     * Subtract months, if count not specified subtract 1 month
     * @param count - Number of months count
     * @returns Itself for fluent API
     */
    public subtractMonths(count?: number): DateApiObject<Date>
    {
        this._value = subMonths(this._value, count ?? 1);

        return this;
    }

    /**
     * Updates value to start date and time of current week
     * @returns Itself for fluent API
     */
    public startOfWeek(): DateApiObject<Date>
    {
        this._value = startOfWeek(this._value, {locale: this._localeSvc.locale});

        return this;
    }

    /**
     * Updates value to end date and time of current week
     * @returns Itself for fluent API
     */
    public endOfWeek(): DateApiObject<Date>
    {
        this._value = endOfWeek(this._value, {locale: this._localeSvc.locale});

        return this;
    }

    /**
     * Add weeks, if count not specified adds 1 week
     * @param count - Number of weeks count
     * @returns Itself for fluent API
     */
    public addWeeks(count?: number): DateApiObject<Date>
    {
        this._value = addWeeks(this._value, count ?? 1);

        return this;
    }

    /**
     * Subtract weeks, if count not specified subtract 1 week
     * @param count - Number of weeks count
     * @returns Itself for fluent API
     */
    public subtractWeeks(count?: number): DateApiObject<Date>
    {
        this._value = subWeeks(this._value, count ?? 1);

        return this;
    }

    /**
     * Updates value to start date and time of current day
     * @returns Itself for fluent API
     */
    public startOfDay(): DateApiObject<Date>
    {
        this._value = startOfDay(this._value);

        return this;
    }

    /**
     * Updates value to end date and time of current day
     * @returns Itself for fluent API
     */
    public endOfDay(): DateApiObject<Date>
    {
        this._value = endOfDay(this._value);

        return this;
    }

    /**
     * Add days, if count not specified adds 1 day
     * @param count - Number of days count
     * @returns Itself for fluent API
     */
    public addDays(count?: number): DateApiObject<Date>
    {
        this._value = addDays(this._value, count ?? 1);

        return this;
    }

    /**
     * Subtract days, if count not specified subtract 1 day
     * @param count - Number of days count
     * @returns Itself for fluent API
     */
    public subtractDays(count?: number): DateApiObject<Date>
    {
        this._value = subDays(this._value, count ?? 1);

        return this;
    }

    /**
     * Updates value to start date and time of current hour
     * @returns Itself for fluent API
     */
    public startOfHour(): DateApiObject<Date>
    {
        this._value = startOfHour(this._value);

        return this;
    }

    /**
     * Updates value to end date and time of current hour
     * @returns Itself for fluent API
     */
    public endOfHour(): DateApiObject<Date>
    {
        this._value = endOfHour(this._value);

        return this;
    }

    /**
     * Add hours, if count not specified adds 1 hour
     * @param count - Number of hours count
     * @returns Itself for fluent API
     */
    public addHours(count?: number): DateApiObject<Date>
    {
        this._value = addHours(this._value, count ?? 1);

        return this;
    }

    /**
     * Subtract hours, if count not specified subtract 1 hour
     * @param count - Number of hours count
     * @returns Itself for fluent API
     */
    public subtractHours(count?: number): DateApiObject<Date>
    {
        this._value = subHours(this._value, count ?? 1);

        return this;
    }

    /**
     * Updates value to start date and time of current minute
     * @returns Itself for fluent API
     */
    public startOfMinute(): DateApiObject<Date>
    {
        this._value = startOfMinute(this._value);

        return this;
    }

    /**
     * Updates value to end date and time of current minute
     * @returns Itself for fluent API
     */
    public endOfMinute(): DateApiObject<Date>
    {
        this._value = endOfMinute(this._value);

        return this;
    }

    /**
     * Add minutes, if count not specified adds 1 minute
     * @param count - Number of minutes count
     * @returns Itself for fluent API
     */
    public addMinutes(count?: number): DateApiObject<Date>
    {
        this._value = addMinutes(this._value, count ?? 1);

        return this;
    }

    /**
     * Subtract minutes, if count not specified subtract 1 minute
     * @param count - Number of minutes count
     * @returns Itself for fluent API
     */
    public subtractMinutes(count?: number): DateApiObject<Date>
    {
        this._value = subMinutes(this._value, count ?? 1);

        return this;
    }

    /**
     * Gets number of days in month
     */
    public daysInMonth(): number
    {
        return getDaysInMonth(this._value);
    }

    /**
     * Gets year
     */
    public year(): number;
    /**
     * Sets year
     * @param year - Year to be set
     */
    public year(year: number): DateApiObject<Date>;
    /**
     * Gets or sets year
     * @param year - If specified, sets year
     */
    public year(year?: number): DateApiObject<Date>|number
    {
        if(isPresent(year))
        {
            this._value = setYear(this._value, year);

            return this;
        }

        return getYear(this._value);
    }

    /**
     * Gets month
     */
    public month(): number
    /**
     * Sets month
     * @param month - Month to be set
     */
    public month(month: number): DateApiObject<Date>
    /**
     * Gets or sets month
     * @param month - If specified, sets month
     */
    public month(month?: number): DateApiObject<Date>|number
    {
        if(isPresent(month))
        {
            this._value = setMonth(this._value, month);

            return this;
        }

        return getMonth(this._value);
    }

    /**
     * Gets day of month one based
     */
    public dayOfMonth(): number;
    /**
     * Sets day of month one based
     * @param day - Day of month to be set
     */
    public dayOfMonth(day: number): DateApiObject<Date>;
    /**
     * Gets or sets day of month one based
     * @param day - If specified, sets day of month
     */
    public dayOfMonth(day?: number): DateApiObject<Date>|number
    {
        if(isPresent(day))
        {
            this._value = setDate(this._value, day);

            return this;
        }

        return getDate(this._value);
    }

    /**
     * Gets day of week zero based, first is monday
     */
    public dayOfWeek(): number;
    /**
     * Sets day of week zero based, first is monday
     * @param day - Day of week to be set
     */
    public dayOfWeek(day: number): DateApiObject<Date>;
    /**
     * Gets or sets day of week zero based, first is monday
     * @param day - If specified, sets day of week
     */
    public dayOfWeek(day?: number): number|DateApiObject<Date>
    {
        if(isPresent(day))
        {
            this._value = setISODay(this._value, day + 1!);

            return this;
        }

        return getISODay(this._value) - 1;
    }

    /**
     * Gets hours zero based
     */
    public hour(): number;
    /**
     * Sets hours zero based
     * @param hour - hour to be set
     */
    public hour(hour: number): DateApiObject<Date>;
    /**
     * Gets or sets hours zero based
     * @param hour - If specified, sets hour
     */
    public hour(hour?: number): DateApiObject<Date>|number
    {
        if(isPresent(hour))
        {
            this._value = setHours(this._value, hour);

            return this;
        }

        return getHours(this._value);
    }

    /**
     * Gets minutes zero based
     */
    public minute(): number;
    /**
     * Sets minutes zero based
     * @param minute - minutes to be set
     */
    public minute(minute: number): DateApiObject<Date>;
    /**
     * Gets or sets minutes zero based
     * @param minute - If specified, sets minutes
     */
    public minute(minute?: number): DateApiObject<Date>|number
    {
        if(isPresent(minute))
        {
            this._value = setMinutes(this._value, minute);

            return this;
        }

        return getMinutes(this._value);
    }

    /**
     * Gets indication whether current value is before 'date'
     * @param date - Date which is this date compared to
     */
    public isBefore(date: Date): boolean
    {
        return isBefore(this._value, date);
    }

    /**
     * Gets indication whether current value is after 'date'
     * @param date - Date which is this date compared to
     */
    public isAfter(date: Date): boolean
    {
        return isAfter(this._value, date);
    }

    /**
     * Gets number of days between this and provided date
     * @param date - Date which is used for computation of diff against
     */
    public diffDays(date: Date): number
    {
        return differenceInCalendarDays(this._value, date);
    }

    /**
     * Compares whether this date is same week as provided date
     * @param date - Date which is used for comparison of same week
     */
    public isSameWeek(date: Date): boolean
    {
        return isSameWeek(this._value, date, {locale: this._localeSvc.locale});
    }

    /**
     * Compares whether this date is same decade as provided date
     * @param date - Date which is used for comparison of same decade
     */
    public isSameDecade(date: Date): boolean
    {
        const year = getYear(this._value);
        const start = year - (year % 10);
        const end = start + 10;

        return getYear(date) >= start && getYear(date) < end;
    }

    /**
     * Compares whether this date is same year as provided date
     * @param date - Date which is used for comparison of same year
     */
    public isSameYear(date: Date): boolean
    {
        return isSameYear(this._value, date);
    }

    /**
     * Compares whether this date is same month as provided date
     * @param date - Date which is used for comparison of same month
     */
    public isSameMonth(date: Date): boolean
    {
        return isSameMonth(this._value, date);
    }

    /**
     * Compares whether this date is same day as provided date
     * @param date - Date which is used for comparison of same day
     */
    public isSameDay(date: Date): boolean
    {
        return isSameDay(this._value, date);
    }

    /**
     * Creates clone of this instance, value and originalValue have same value and are cloned from value
     */
    public clone(): DateApiObject<Date>
    {
        return new DateFnsDateApiObject(new Date(this._value), null, this._localeSvc);
    }

    /**
     * Creates clone of this instance, value and originalValue have same value and are cloned from originalValue
     */
    public cloneOriginal(): DateApiObject<Date>
    {
        return new DateFnsDateApiObject(new Date(this._originalValue), null, this._localeSvc);
    }

    /**
     * Updates originalValue, if value is not provided originalValue is set to value
     * @param value - Value to be set as original, or null (value will be used as value)
     * @returns Itself for fluent API
     */
    public updateOriginal(value?: Date): DateApiObject<Date>
    {
        if(isBlank(value))
        {
            this._originalValue = this._value;
        }
        else
        {
            this._value = this._originalValue = value!;
        }

        return this;
    }

    /**
     * Changes value to same value as originalValue
     * @returns Itself for fluent API
     */
    public resetOriginal(): DateApiObject<Date>
    {
        this._value = this._originalValue;

        return this;
    }
}

/**
 * Date api using DateFnsJS, used for obtaining DateApi wrapper object
 */
@Injectable()
export class DateFnsDateApi implements DateApi<Date>
{
    //######################### constructor #########################
    constructor(@Inject(DATE_FNS_LOCALE) protected _localeSvc: DateFnsLocale,
                protected _relativeParser: DateTimeRelativeParser<Date>,
                @Inject(DATE_API_OBJECT_TYPE) protected _dateApiObjecType: DateApiObjectCtor<DateFnsDateApiObject, Date>)
    {
    }

    //######################### public methods - implementation of DateApi #########################

    /**
     * Gets wrapping object used for manipulation
     * @param value - Value to be converted (parsed) and used for manipulation
     * @param format - Format string used for parsing string value
     */
    public getValue(value: DateValue|Date, format?: string): DateApiObject<Date>
    {
        return new this._dateApiObjecType(this._relativeParser.parse(value), format, this._localeSvc);
    }

    /**
     * Gets wrapping object used for manipulation instantiated to current date and time
     */
    public now(): DateApiObject<Date>
    {
        return new this._dateApiObjecType(new Date(), null ?? undefined, this._localeSvc);
    }

    /**
     * Gets format string using pseudo format
     * @param pseudoFormat - Pseudo format token, used for obtaining 'date' or 'time' format string
     */
    public getFormat(pseudoFormat: string): string
    {
        if(/^p+$/i.test(pseudoFormat))
        {
            if(!this._localeSvc.locale.formatLong)
            {
                throw new Error('Missing long formats for locale in DateApi');
            }

            const widths: {[index: number]: string} =
            {
                1: 'short',
                2: 'medium',
                3: 'long',
                4: 'full'
            };

            //date time format
            if(pseudoFormat.indexOf('Pp') >= 0 && pseudoFormat.length <= 8)
            {
                const partLength = pseudoFormat.length / 2;

                return `${this._localeSvc.locale.formatLong.date({width: widths[partLength]})} ${this._localeSvc.locale.formatLong.time({width: widths[partLength]})}`;
            }
            //date format
            else if(pseudoFormat.indexOf('P') >= 0 && pseudoFormat.length <= 4)
            {
                return this._localeSvc.locale.formatLong.date({width: widths[pseudoFormat.length]});
            }
            //time format
            else if(pseudoFormat.indexOf('p') >= 0 && pseudoFormat.length <= 4)
            {
                return this._localeSvc.locale.formatLong.time({width: widths[pseudoFormat.length]});
            }
        }

        return pseudoFormat;
    }

    /**
     * Gets information 
     */
    public weekStartsOnMonday(): boolean
    {
        return this._localeSvc.locale.options?.weekStartsOn === 1;
    }

    /**
     * Gets array of weekday names in short format, order of days is dependent on locale
     */
    public weekdaysShort(): string[]
    {
        let startIndex = this._localeSvc.locale.options!.weekStartsOn!;
        const weekdays: string[] = [];

        for(let x = 0; x < 7; x++)
        {
            weekdays.push(this._localeSvc.locale.localize!.day(startIndex++ % 7, {width: 'short'}));
        }

        return weekdays;
    }

    /**
     * @inheritdoc
     */
    public isDate(value: unknown): value is Date
    {
        return isDate(value);
    }
}

/**
 * Type that represents creation of DateApiObject for date-fns
 */
export const dateFnsDateApiObjectType: DateApiObjectCtor<DateFnsDateApiObject, Date> = DateFnsDateApiObject;

/**
 * Injection token used for injecting type that creates instance of DateApiObject for date-fns
 */
export const DATE_FNS_DATE_API_OBJECT_TYPE: ValueProvider =
{
    provide: DATE_API_OBJECT_TYPE,
    useValue: dateFnsDateApiObjectType
};