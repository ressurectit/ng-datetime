import {Inject, Injectable, ValueProvider} from '@angular/core';
import {DateApi, DateValue, DateApiObject, DateTimeRelativeParser, DateApiObjectCtor, DATE_API_OBJECT_TYPE, DateObject} from '@anglr/datetime';
import {isBlank, isPresent, isString} from '@jscrpt/common';
import {toDate, getDate, setDate, isAfter, isBefore, isEqual, differenceInCalendarDays, format, formatISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, addMonths, addWeeks, addDays, subMonths, subWeeks, subDays, getDaysInMonth, isSameDay, isSameWeek, isSameMonth, isValid, parse, parseISO, addYears, subYears, startOfYear, endOfYear, isWeekend, setYear, getYear, isSameYear, startOfDecade, endOfDecade, setMonth, getMonth, setISODay, getISODay, subHours, addHours, endOfHour, startOfHour, startOfMinute, endOfMinute, addMinutes, subMinutes, getHours, setHours, getMinutes, setMinutes, isDate, getUnixTime, getTime, Day, FormatLongWidth} from 'date-fns';

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
     * @inheritdoc
     */
    public get originalValue(): Date
    {
        return this._originalValue;
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    public isValid(): boolean
    {
        return isValid(this._value);
    }

    /**
     * @inheritdoc
     */
    public isWeekend(): boolean
    {
        return isWeekend(this._value);
    }

    /**
     * @inheritdoc
     */
    public format(formatString: string): string
    {
        return format(this._value, formatString, {locale: this._localeSvc.locale});
    }

    /**
     * @inheritdoc
     */
    public formatISO(): string
    {
        return formatISO(this._value);
    }

    /**
     * @inheritdoc
     */
    public unixTimestamp(): number
    {
        return getUnixTime(this._value);
    }

    /**
     * @inheritdoc
     */
    public timestamp(): number
    {
        return getTime(this._value);
    }

    /**
     * @inheritdoc
     */
    public startOfDecade(): DateApiObject<Date>
    {
        this._value = startOfDecade(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfDecade(): DateApiObject<Date>
    {
        this._value = endOfDecade(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfYear(): DateApiObject<Date>
    {
        this._value = startOfYear(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfYear(): DateApiObject<Date>
    {
        this._value = endOfYear(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public addYears(count?: number): DateApiObject<Date>
    {
        this._value = addYears(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractYears(count?: number): DateApiObject<Date>
    {
        this._value = subYears(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfMonth(): DateApiObject<Date>
    {
        this._value = startOfMonth(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfMonth(): DateApiObject<Date>
    {
        this._value = endOfMonth(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public addMonths(count?: number): DateApiObject<Date>
    {
        this._value = addMonths(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractMonths(count?: number): DateApiObject<Date>
    {
        this._value = subMonths(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfWeek(): DateApiObject<Date>
    {
        this._value = startOfWeek(this._value, {locale: this._localeSvc.locale});

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfWeek(): DateApiObject<Date>
    {
        this._value = endOfWeek(this._value, {locale: this._localeSvc.locale});

        return this;
    }

    /**
     * @inheritdoc
     */
    public addWeeks(count?: number): DateApiObject<Date>
    {
        this._value = addWeeks(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractWeeks(count?: number): DateApiObject<Date>
    {
        this._value = subWeeks(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfDay(): DateApiObject<Date>
    {
        this._value = startOfDay(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfDay(): DateApiObject<Date>
    {
        this._value = endOfDay(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public addDays(count?: number): DateApiObject<Date>
    {
        this._value = addDays(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractDays(count?: number): DateApiObject<Date>
    {
        this._value = subDays(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfHour(): DateApiObject<Date>
    {
        this._value = startOfHour(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfHour(): DateApiObject<Date>
    {
        this._value = endOfHour(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public addHours(count?: number): DateApiObject<Date>
    {
        this._value = addHours(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractHours(count?: number): DateApiObject<Date>
    {
        this._value = subHours(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfMinute(): DateApiObject<Date>
    {
        this._value = startOfMinute(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfMinute(): DateApiObject<Date>
    {
        this._value = endOfMinute(this._value);

        return this;
    }

    /**
     * @inheritdoc
     */
    public addMinutes(count?: number): DateApiObject<Date>
    {
        this._value = addMinutes(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractMinutes(count?: number): DateApiObject<Date>
    {
        this._value = subMinutes(this._value, count ?? 1);

        return this;
    }

    /**
     * @inheritdoc
     */
    public daysInMonth(): number
    {
        return getDaysInMonth(this._value);
    }

    /**
     * @inheritdoc
     */
    public year(): number;
    public year(year: number): DateApiObject<Date>;
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
     * @inheritdoc
     */
    public month(): number
    public month(month: number): DateApiObject<Date>
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
     * @inheritdoc
     */
    public dayOfMonth(): number;
    public dayOfMonth(day: number): DateApiObject<Date>;
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
     * @inheritdoc
     */
    public dayOfWeek(): number;
    public dayOfWeek(day: number): DateApiObject<Date>;
    public dayOfWeek(day?: number): number|DateApiObject<Date>
    {
        if(isPresent(day))
        {
            this._value = setISODay(this._value, day + 1);

            return this;
        }

        return getISODay(this._value) - 1;
    }

    /**
     * @inheritdoc
     */
    public hour(): number;
    public hour(hour: number): DateApiObject<Date>;
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
     * @inheritdoc
     */
    public minute(): number;
    public minute(minute: number): DateApiObject<Date>;
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
     * @inheritdoc
     */
    public isBefore(date: DateObject<Date>): boolean
    {
        date = this.getDate(date);

        return isBefore(this._value, date);
    }

    /**
     * @inheritdoc
     */
    public isAfter(date: DateObject<Date>): boolean
    {
        date = this.getDate(date);

        return isAfter(this._value, date);
    }

    /**
     * @inheritdoc
     */
    public diffDays(date: DateObject<Date>): number
    {
        date = this.getDate(date);

        return differenceInCalendarDays(this._value, date);
    }

    /**
     * @inheritdoc
     */
    public isSameWeek(date: DateObject<Date>): boolean
    {
        date = this.getDate(date);

        return isSameWeek(this._value, date, {locale: this._localeSvc.locale});
    }

    /**
     * @inheritdoc
     */
    public isSameDecade(date: DateObject<Date>): boolean
    {
        date = this.getDate(date);

        const year = getYear(this._value);
        const start = year - (year % 10);
        const end = start + 10;

        return getYear(date) >= start && getYear(date) < end;
    }

    /**
     * @inheritdoc
     */
    public isSameYear(date: DateObject<Date>): boolean
    {
        date = this.getDate(date);

        return isSameYear(this._value, date);
    }

    /**
     * @inheritdoc
     */
    public isSameMonth(date: DateObject<Date>): boolean
    {
        date = this.getDate(date);

        return isSameMonth(this._value, date);
    }

    /**
     * @inheritdoc
     */
    public isSameDay(date: DateObject<Date>): boolean
    {
        date = this.getDate(date);

        return isSameDay(this._value, date);
    }

    /**
     * @inheritdoc
     */
    public isSame(date: DateObject<Date>): boolean
    {
        date = this.getDate(date);

        return isEqual(this._value, date);
    }

    /**
     * @inheritdoc
     */
    public clone(): DateApiObject<Date>
    {
        return new DateFnsDateApiObject(new Date(this._value), null, this._localeSvc);
    }

    /**
     * @inheritdoc
     */
    public cloneOriginal(): DateApiObject<Date>
    {
        return new DateFnsDateApiObject(new Date(this._originalValue), null, this._localeSvc);
    }

    /**
     * @inheritdoc
     */
    public updateOriginal(value?: Date): DateApiObject<Date>
    {
        if(isBlank(value))
        {
            this._originalValue = this._value;
        }
        else
        {
            this._value = this._originalValue = value;
        }

        return this;
    }

    /**
     * @inheritdoc
     */
    public resetOriginal(): DateApiObject<Date>
    {
        this._value = this._originalValue;

        return this;
    }

    //######################### protected methods #########################

    /**
     * Converts date object to date
     * @param value - Value to be converted to date
     */
    protected getDate(value: DateObject<Date>): Date
    {
        if(value instanceof Date)
        {
            return value;
        }

        return value.value;
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
                @Inject(DATE_API_OBJECT_TYPE) protected _dateApiObjecType: DateApiObjectCtor<Date, DateFnsDateApiObject>)
    {
    }

    //######################### public methods - implementation of DateApi #########################

    /**
     * @inheritdoc
     */
    public getValue(value: DateValue|Date, format?: string): DateApiObject<Date>
    {
        return new this._dateApiObjecType(this._relativeParser.parse(value), format, this._localeSvc);
    }

    /**
     * @inheritdoc
     */
    public now(): DateApiObject<Date>
    {
        return new this._dateApiObjecType(new Date(), undefined, this._localeSvc);
    }

    /**
     * @inheritdoc
     */
    public getFormat(pseudoFormat: string): string
    {
        if(/^p+$/i.test(pseudoFormat))
        {
            if(!this._localeSvc.locale.formatLong)
            {
                throw new Error('Missing long formats for locale in DateApi');
            }

            const widths: {[index: number]: FormatLongWidth} =
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
     * @inheritdoc
     */
    public weekStartsOnMonday(): boolean
    {
        return this._localeSvc.locale.options?.weekStartsOn === 1;
    }

    /**
     * @inheritdoc
     */
    public weekdays(short?: boolean): string[]
    {
        let startIndex = this._localeSvc.locale.options!.weekStartsOn!;
        const weekdays: string[] = [];

        for(let x = 0; x < 7; x++)
        {
            weekdays.push(this._localeSvc.locale.localize!.day(startIndex++ % 7 as Day, {width: short ? 'short' : 'wide'}));
        }

        return weekdays;
    }

    /**
     * @inheritdoc
     */
    public weekdaysShort(): string[]
    {
        let startIndex = this._localeSvc.locale.options!.weekStartsOn!;
        const weekdays: string[] = [];

        for(let x = 0; x < 7; x++)
        {
            weekdays.push(this._localeSvc.locale.localize!.day(startIndex++ % 7 as Day, {width: 'short'}));
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
export const dateFnsDateApiObjectType: DateApiObjectCtor<Date, DateFnsDateApiObject> = DateFnsDateApiObject;

/**
 * Injection token used for injecting type that creates instance of DateApiObject for date-fns
 */
export const DATE_FNS_DATE_API_OBJECT_TYPE: ValueProvider =
{
    provide: DATE_API_OBJECT_TYPE,
    useValue: dateFnsDateApiObjectType,
};