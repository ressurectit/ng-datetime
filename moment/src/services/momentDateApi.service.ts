import {Inject, Injectable, ValueProvider} from '@angular/core';
import {DateApi, DateValue, DateApiObject, DateTimeRelativeParser, DateApiObjectCtor, DATE_API_OBJECT_TYPE, DateObject} from '@anglr/datetime';
import {isBlank, isPresent} from '@jscrpt/common';
import moment, {LongDateFormatKey} from 'moment';

/**
 * Instance of object wrapping TDate, allowing manipulation with it
 */
export class MomentDateApiObject implements DateApiObject<moment.Moment>
{
    //######################### protected fields #########################

    /**
     * Original value that is not changed unless 'updateOriginal' is called
     */
    protected _originalValue: moment.Moment;

    /**
     * Instance of date
     */
    protected _value: moment.Moment;

    //######################### public properties - implementation of DateApiObject #########################

    /**
     * Original value that is not changed unless 'updateOriginal' is called
     */
    public get originalValue(): moment.Moment
    {
        return this._originalValue;
    }

    /**
     * Instance of date
     */
    public get value(): moment.Moment
    {
        return this._value;
    }

    //######################### constructor #########################
    constructor(value: DateValue|moment.Moment, format?: string)
    {
        this._value = this._originalValue = moment(value, format);
    }

    //######################### public methods - implementation of DateApiObject #########################

    /**
     * Gets indication whether provided instance of date is valid
     */
    public isValid(): boolean
    {
        return this._value.isValid();
    }

    /**
     * Gets indication whether provided instance of date is weekend day
     */
    public isWeekend(): boolean
    {
        const weekday = this._value.isoWeekday();

        return weekday == 6 || weekday == 7;
    }

    /**
     * Formats date value
     * @param format - Format token used for creating formatted string
     */
    public format(format: string): string
    {
        return this._value.format(format.replace(/y/g, 'Y').replace(/d/g, 'D'));
    }

    /**
     * @inheritdoc
     */
    public formatISO(): string
    {
        return this._value.format();
    }

    /**
     * @inheritdoc
     */
    public unixTimestamp(): number
    {
        return this._value.unix();
    }

    /**
     * @inheritdoc
     */
    public timestamp(): number
    {
        return this._value.valueOf();
    }

    /**
     * Updates value to start date and time of current decade
     * @returns Itself for fluent API
     */
    public startOfDecade(): DateApiObject<moment.Moment>
    {
        const diff = (this._value.year() % 10);

        this._value = moment(this._value).subtract(diff, 'years').startOf('year');
        
        return this;
    }

    /**
     * Updates value to end date and time of current decade
     * @returns Itself for fluent API
     */
    public endOfDecade(): DateApiObject<moment.Moment>
    {
        const diff = 9 - (this._value.year() % 10);

        this._value = moment(this._value).add(diff, 'years').endOf('year');
        
        return this;
    }

    /**
     * Updates value to start date and time of current year
     * @returns Itself for fluent API
     */
    public startOfYear(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('year');

        return this;
    }

    /**
     * Updates value to end date and time of current year
     * @returns Itself for fluent API
     */
    public endOfYear(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('year');

        return this;
    }

    /**
     * Add years, if count not specified adds 1 year
     * @param count - Number of years count
     * @returns Itself for fluent API
     */
    public addYears(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'years');

        return this;
    }

    /**
     * Subtract years, if count not specified subtract 1 year
     * @param count - Number of years count
     * @returns Itself for fluent API
     */
    public subtractYears(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'years');

        return this;
    }

    /**
     * Updates value to start date and time of current month
     * @returns Itself for fluent API
     */
    public startOfMonth(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('month');

        return this;
    }

    /**
     * Updates value to end date and time of current month
     * @returns Itself for fluent API
     */
    public endOfMonth(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('month');

        return this;
    }

    /**
     * Add months, if count not specified adds 1 month
     * @param count - Number of months count
     * @returns Itself for fluent API
     */
    public addMonths(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'months');

        return this;
    }

    /**
     * Subtract months, if count not specified subtract 1 month
     * @param count - Number of months count
     * @returns Itself for fluent API
     */
    public subtractMonths(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'months');

        return this;
    }

    /**
     * Updates value to start date and time of current week
     * @returns Itself for fluent API
     */
    public startOfWeek(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('week');

        return this;
    }

    /**
     * Updates value to end date and time of current week
     * @returns Itself for fluent API
     */
    public endOfWeek(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('week');

        return this;
    }

    /**
     * Add weeks, if count not specified adds 1 week
     * @param count - Number of weeks count
     * @returns Itself for fluent API
     */
    public addWeeks(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'weeks');

        return this;
    }

    /**
     * Subtract weeks, if count not specified subtract 1 week
     * @param count - Number of weeks count
     * @returns Itself for fluent API
     */
    public subtractWeeks(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'weeks');

        return this;
    }

    /**
     * Updates value to start date and time of current day
     * @returns Itself for fluent API
     */
    public startOfDay(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('day');

        return this;
    }

    /**
     * Updates value to end date and time of current day
     * @returns Itself for fluent API
     */
    public endOfDay(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('day');

        return this;
    }

    /**
     * Add days, if count not specified adds 1 day
     * @param count - Number of days count
     * @returns Itself for fluent API
     */
    public addDays(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'days');

        return this;
    }

    /**
     * Subtract days, if count not specified subtract 1 day
     * @param count - Number of days count
     * @returns Itself for fluent API
     */
    public subtractDays(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'days');

        return this;
    }

    /**
     * Updates value to start date and time of current hour
     * @returns Itself for fluent API
     */
    public startOfHour(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('hour');

        return this;
    }

    /**
     * Updates value to end date and time of current hour
     * @returns Itself for fluent API
     */
    public endOfHour(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('hour');

        return this;
    }

    /**
     * Add hours, if count not specified adds 1 hour
     * @param count - Number of hours count
     * @returns Itself for fluent API
     */
    public addHours(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'hours');

        return this;
    }

    /**
     * Subtract hours, if count not specified subtract 1 hour
     * @param count - Number of hours count
     * @returns Itself for fluent API
     */
    public subtractHours(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'hours');

        return this;
    }

    /**
     * Updates value to start date and time of current minute
     * @returns Itself for fluent API
     */
    public startOfMinute(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('minute');

        return this;
    }

    /**
     * Updates value to end date and time of current minute
     * @returns Itself for fluent API
     */
    public endOfMinute(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('minute');

        return this;
    }

    /**
     * Add minutes, if count not specified adds 1 minute
     * @param count - Number of minutes count
     * @returns Itself for fluent API
     */
    public addMinutes(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'minutes');

        return this;
    }

    /**
     * Subtract minutes, if count not specified subtract 1 minute
     * @param count - Number of minutes count
     * @returns Itself for fluent API
     */
    public subtractMinutes(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'minutes');

        return this;
    }

    /**
     * Gets number of days in month
     */
    public daysInMonth(): number
    {
        return this._value.daysInMonth();
    }

    /**
     * Gets year
     */
    public year(): number;
    /**
     * Sets year
     * @param year - Year to be set
     */
    public year(year: number): DateApiObject<moment.Moment>;
    /**
     * Gets or sets year
     * @param year - If specified, sets year
     */
    public year(year?: number): DateApiObject<moment.Moment>|number
    {
        if(isPresent(year))
        {
            this._value = moment(this._value).year(year);

            return this;
        }

        return this._value.year();
    }

    /**
     * Gets month
     */
    public month(): number
    /**
     * Sets month
     * @param month - Month to be set
     */
    public month(month: number): DateApiObject<moment.Moment>
    /**
     * Gets or sets month
     * @param month - If specified, sets month
     */
    public month(month?: number): DateApiObject<moment.Moment>|number
    {
        if(isPresent(month))
        {
            this._value = moment(this._value).month(month);

            return this;
        }

        return this._value.month();
    }

    /**
     * Gets day of month one based
     */
    public dayOfMonth(): number;
    /**
     * Sets day of month one based
     * @param day - Day of month to be set
     */
    public dayOfMonth(day: number): DateApiObject<moment.Moment>;
    /**
     * Gets or sets day of month one based
     * @param day - If specified, sets day of month
     */
    public dayOfMonth(day?: number): DateApiObject<moment.Moment>|number
    {
        if(isPresent(day))
        {
            this._value = moment(this._value).date(day);

            return this;
        }

        return this._value.date();
    }

    /**
     * Gets day of week zero based, first is monday
     */
    public dayOfWeek(): number;
    /**
     * Sets day of week zero based, first is monday
     * @param day - Day of week to be set
     */
    public dayOfWeek(day: number): DateApiObject<moment.Moment>;
    /**
     * Gets or sets day of week zero based, first is monday
     * @param day - If specified, sets day of week
     */
    public dayOfWeek(day?: number): number|DateApiObject<moment.Moment>
    {
        if(isPresent(day))
        {
            this._value = moment(this._value).weekday(day);

            return this;
        }

        return this._value.weekday();
    }

    /**
     * Gets hours zero based
     */
    public hour(): number;
    /**
     * Sets hours zero
     * @param hour - hour to be set
     */
    public hour(hour: number): DateApiObject<moment.Moment>;
    /**
     * Gets or sets hours zero
     * @param hour - If specified, sets hour
     */
    public hour(hour?: number): DateApiObject<moment.Moment>|number
    {
        if(isPresent(hour))
        {
            this._value = moment(this._value).hours(hour);

            return this;
        }

        return this._value.hours();
    }

    /**
     * Gets minutes zero based
     */
    public minute(): number;
    /**
     * Sets minutes zero based
     * @param minute - minutes to be set
     */
    public minute(minute: number): DateApiObject<moment.Moment>;
    /**
     * Gets or sets minutes zero based
     * @param minute - If specified, sets minutes
     */
    public minute(minute?: number): DateApiObject<moment.Moment>|number
    {
        if(isPresent(minute))
        {
            this._value = moment(this._value).minutes(minute);

            return this;
        }

        return this._value.minutes();
    }

    /**
     * Gets indication whether current value is before 'date'
     * @param date - Date which is this date compared to
     */
    public isBefore(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isBefore(date);
    }

    /**
     * Gets indication whether current value is after 'date'
     * @param date - Date which is this date compared to
     */
    public isAfter(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isAfter(date);
    }

    /**
     * Gets number of days between this and provided date
     * @param date - Date which is used for computation of diff against
     */
    public diffDays(date: DateObject<moment.Moment>): number
    {
        date = this.getDate(date);

        return moment(this._value).startOf('day').diff(moment(date).startOf('day'), 'days');
    }

    /**
     * Compares whether this date is same week as provided date
     * @param date - Date which is used for comparison of same week
     */
    public isSameWeek(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isSame(date, 'week');
    }

    /**
     * Compares whether this date is same decade as provided date
     * @param date - Date which is used for comparison of same decade
     */
    public isSameDecade(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        const year = this._value.year();
        const start = year - (year % 10);
        const end = start + 10;

        return date.year() >= start && date.year() < end;
    }

    /**
     * Compares whether this date is same year as provided date
     * @param date - Date which is used for comparison of same year
     */
    public isSameYear(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isSame(date, 'year');
    }

    /**
     * Compares whether this date is same month as provided date
     * @param date - Date which is used for comparison of same month
     */
    public isSameMonth(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isSame(date, 'month');
    }

    /**
     * Compares whether this date is same day as provided date
     * @param date - Date which is used for comparison of same day
     */
    public isSameDay(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isSame(date, 'day');
    }

    /**
     * @inheritdoc
     */
    public isSame(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isSame(date);
    }

    /**
     * Creates clone of this instance, value and originalValue have same value and are cloned from value
     */
    public clone(): DateApiObject<moment.Moment>
    {
        return new MomentDateApiObject(moment(this._value));
    }

    /**
     * Creates clone of this instance, value and originalValue have same value and are cloned from originalValue
     */
    public cloneOriginal(): DateApiObject<moment.Moment>
    {
        return new MomentDateApiObject(moment(this._originalValue));
    }

    /**
     * Updates originalValue, if value is not provided originalValue is set to value
     * @param value - Value to be set as original, or null (value will be used as value)
     * @returns Itself for fluent API
     */
    public updateOriginal(value?: moment.Moment): DateApiObject<moment.Moment>
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
    public resetOriginal(): DateApiObject<moment.Moment>
    {
        this._value = this._originalValue;

        return this;
    }

    //######################### protected methods #########################

    /**
     * Converts date object to date
     * @param value - Value to be converted to date
     */
    protected getDate(value: DateObject<moment.Moment>): moment.Moment
    {
        if(value instanceof moment)
        {
            return value as moment.Moment;
        }

        return (value as DateApiObject<moment.Moment>).value;
    }
}

/**
 * Date api using MomentJS, used for obtaining DateApi wrapper object
 */
@Injectable()
export class MomentDateApi implements DateApi<moment.Moment>
{
    //######################### constructor #########################
    constructor(protected _relativeParser: DateTimeRelativeParser<moment.Moment>,
                @Inject(DATE_API_OBJECT_TYPE) protected _dateApiObjecType: DateApiObjectCtor<moment.Moment, MomentDateApiObject>)
    {
    }

    //######################### public methods #########################

    /**
     * Gets wrapping object used for manipulation
     * @param value - Value to be converted (parsed) and used for manipulation
     * @param format - Format string used for parsing string value
     */
    public getValue(value: DateValue|moment.Moment, format?: string): DateApiObject<moment.Moment>
    {
        return new this._dateApiObjecType(this._relativeParser.parse(value), format);
    }

    /**
     * Gets wrapping object used for manipulation instantiated to current date and time
     */
    public now(): DateApiObject<moment.Moment>
    {
        return new this._dateApiObjecType(moment());
    }

    /**
     * Gets format string using pseudo format
     * @param pseudoFormat - Pseudo format token, used for obtaining 'date' or 'time' format string
     */
    public getFormat(pseudoFormat: string): string
    {
        if(/^((LT|LTS|L+|l+)\s*)*$/g.test(pseudoFormat))
        {
            return pseudoFormat.split(' ').map(itm => moment.localeData().longDateFormat(itm as LongDateFormatKey)).join(' ');
        }

        return pseudoFormat;
    }

    /**
     * Gets information 
     */
    public weekStartsOnMonday(): boolean
    {
        return moment.localeData().firstDayOfWeek() === 1;
    }

    /**
     * Gets array of weekday names in short format, order of days is dependent on locale
     */
    public weekdaysShort(): string[]
    {
        return moment.weekdaysShort(true);
    }

    /**
     * @inheritdoc
     */
    public isDate(value: unknown): value is moment.Moment
    {
        return value instanceof moment;
    }
}

/**
 * Type that represents creation of DateApiObject for moment
 */
export const momentDateApiObjectType: DateApiObjectCtor<moment.Moment, MomentDateApiObject> = MomentDateApiObject;

/**
 * Injection token used for injecting type that creates instance of DateApiObject for moment
 */
export const MOMENT_DATE_API_OBJECT_TYPE: ValueProvider =
{
    provide: DATE_API_OBJECT_TYPE,
    useValue: momentDateApiObjectType
};
