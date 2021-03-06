import {Injectable} from '@angular/core';
import {DateApi, DateValue, DateApiObject, DateTimeRelativeParser} from '@anglr/datetime';
import {isBlank, isPresent} from '@jscrpt/common';
import moment, {LongDateFormatKey} from 'moment';

/**
 * Instance of object wrapping TDate, allowing manipulation with it
 */
class MomentDateApiObject implements DateApiObject<moment.Moment>
{
    //######################### private fields #########################

    /**
     * Original value that is not changed unless 'updateOriginal' is called
     */
    private _originalValue: moment.Moment;

    /**
     * Instance of date
     */
    private _value: moment.Moment;

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
        let weekday = this._value.isoWeekday();

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
     * Updates value to start date and time of current decade
     * @returns Itself for fluent API
     */
    public startOfDecade(): DateApiObject<moment.Moment>
    {
        let diff = (this._value.year() % 10);

        this._value = moment(this._value).subtract(diff, 'years').startOf('year');
        
        return this;
    }

    /**
     * Updates value to end date and time of current decade
     * @returns Itself for fluent API
     */
    public endOfDecade(): DateApiObject<moment.Moment>
    {
        let diff = 9 - (this._value.year() % 10);

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
            this._value = moment(this._value).year(year!);

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
            this._value = moment(this._value).month(month!);

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
            this._value = moment(this._value).date(day!);

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
            this._value = moment(this._value).weekday(day!);

            return this;
        }

        return this._value.weekday();
    }

    /**
     * Gets indication whether current value is before 'date'
     * @param date - Date which is this date compared to
     */
    public isBefore(date: moment.Moment): boolean
    {
        return this._value.isBefore(date);
    }

    /**
     * Gets indication whether current value is after 'date'
     * @param date - Date which is this date compared to
     */
    public isAfter(date: moment.Moment): boolean
    {
        return this._value.isAfter(date);
    }

    /**
     * Gets number of days between this and provided date
     * @param date - Date which is used for computation of diff against
     */
    public diffDays(date: moment.Moment): number
    {
        return moment(this._value).startOf('day').diff(moment(date).startOf('day'), 'days');
    }

    /**
     * Compares whether this date is same week as provided date
     * @param date - Date which is used for comparison of same week
     */
    public isSameWeek(date: moment.Moment): boolean
    {
        return this._value.isSame(date, 'week');
    }

    /**
     * Compares whether this date is same decade as provided date
     * @param date - Date which is used for comparison of same decade
     */
    public isSameDecade(date: moment.Moment): boolean
    {
        let year = this._value.year();
        let start = year - (year % 10);
        let end = start + 10;

        return date.year() >= start && date.year() < end;
    }

    /**
     * Compares whether this date is same year as provided date
     * @param date - Date which is used for comparison of same year
     */
    public isSameYear(date: moment.Moment): boolean
    {
        return this._value.isSame(date, 'year');
    }

    /**
     * Compares whether this date is same month as provided date
     * @param date - Date which is used for comparison of same month
     */
    public isSameMonth(date: moment.Moment): boolean
    {
        return this._value.isSame(date, 'month');
    }

    /**
     * Compares whether this date is same day as provided date
     * @param date - Date which is used for comparison of same day
     */
    public isSameDay(date: moment.Moment): boolean
    {
        return this._value.isSame(date, 'day');
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
}

/**
 * Date api using MomentJS, used for obtaining DateApi wrapper object
 */
@Injectable()
export class MomentDateApi implements DateApi<moment.Moment>
{
    //######################### constructor #########################
    constructor(protected _relativeParser: DateTimeRelativeParser<moment.Moment>)
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
        return new MomentDateApiObject(this._relativeParser.parse(value), format);
    }

    /**
     * Gets wrapping object used for manipulation instantiated to current date and time
     */
    public now(): DateApiObject<moment.Moment>
    {
        return new MomentDateApiObject(moment());
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
}