import {DateApi, DateValue, DateApiObject} from '@anglr/datetime';
import {isBlank, isPresent} from '@jscrpt/common';
import {toDate, getDate, setDate, setDay, getDay, isAfter, isBefore, differenceInCalendarDays, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, addMonths, addWeeks, addDays, subMonths, subWeeks, subDays, getDaysInMonth, isSameDay, isSameWeek, isSameMonth} from 'date-fns';
import {sk} from 'date-fns/locale';

/**
 * Instance of object wrapping TDate, allowing manipulation with it
 */
class DateFnsDateApiObject implements DateApiObject<Date>
{
    //######################### private fields #########################

    /**
     * Original value that is not changed unless 'updateOriginal' is called
     */
    private _originalValue: Date;

    /**
     * Instance of date
     */
    private _value: Date;

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
    constructor(value: DateValue|Date)
    {
        this._value = this._originalValue = toDate(value);
    }

    //######################### public methods - implementation of DateApiObject #########################

    /**
     * Formats date value
     * @param formatString Format token used for creating formatted string
     */
    public format(formatString: string): string
    {
        return format(this._value, formatString.replace(/Y/g, 'y').replace(/D/g, 'd'), {locale: sk});
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
     * @param count Number of months count
     * @returns Itself for fluent API
     */
    public addMonths(count?: number): DateApiObject<Date>
    {
        this._value = addMonths(this._value, count ?? 1);

        return this;
    }

    /**
     * Subtract months, if count not specified subtract 1 month
     * @param count Number of months count
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
        this._value = startOfWeek(this._value);

        return this;
    }

    /**
     * Updates value to end date and time of current week
     * @returns Itself for fluent API
     */
    public endOfWeek(): DateApiObject<Date>
    {
        this._value = endOfWeek(this._value);

        return this;
    }

    /**
     * Add weeks, if count not specified adds 1 week
     * @param count Number of weeks count
     * @returns Itself for fluent API
     */
    public addWeeks(count?: number): DateApiObject<Date>
    {
        this._value = addWeeks(this._value, count ?? 1);

        return this;
    }

    /**
     * Subtract weeks, if count not specified subtract 1 week
     * @param count Number of weeks count
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
     * @param count Number of days count
     * @returns Itself for fluent API
     */
    public addDays(count?: number): DateApiObject<Date>
    {
        this._value = addDays(this._value, count ?? 1);

        return this;
    }

    /**
     * Subtract days, if count not specified subtract 1 day
     * @param count Number of days count
     * @returns Itself for fluent API
     */
    public subtractDays(count?: number): DateApiObject<Date>
    {
        this._value = subDays(this._value, count ?? 1);

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
     * Gets day of month one based
     */
    public dayOfMonth(): number;
    /**
     * Sets day of month one based
     * @param day Day of month to be set
     */
    public dayOfMonth(day: number): DateApiObject<Date>;
    /**
     * Gets or sets day of month one based
     * @param day If specified, sets day of month
     */
    public dayOfMonth(day?: number): DateApiObject<Date>|number
    {
        if(isPresent(day))
        {
            this._value = setDate(this._value, day!);

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
     * @param day Day of week to be set
     */
    public dayOfWeek(day: number): DateApiObject<Date>;
    /**
     * Gets or sets day of week zero based, first is monday
     * @param day If specified, sets day of week
     */
    public dayOfWeek(day?: number): number|DateApiObject<Date>
    {
        if(isPresent(day))
        {
            this._value = setDay(this._value, day!);

            return this;
        }

        return getDay(this._value);
    }

    /**
     * Gets indication whether current value is before 'date'
     * @param date Date which is this date compared to
     */
    public isBefore(date: Date): boolean
    {
        return isBefore(this._value, date);
    }

    /**
     * Gets indication whether current value is after 'date'
     * @param date Date which is this date compared to
     */
    public isAfter(date: Date): boolean
    {
        return isAfter(this._value, date);
    }

    /**
     * Gets number of days between this and provided date
     * @param date Date which is used for computation of diff against
     */
    public diffDays(date: Date): number
    {
        return differenceInCalendarDays(this._value, date);
    }

    /**
     * Compares whether this date is same week as provided date
     * @param date Date which is used for comparison of same week
     */
    public isSameWeek(date: Date): boolean
    {
        return isSameWeek(this._value, date);
    }

    /**
     * Compares whether this date is same month as provided date
     * @param date Date which is used for comparison of same month
     */
    public isSameMonth(date: Date): boolean
    {
        return isSameMonth(this._value, date);
    }

    /**
     * Compares whether this date is same day as provided date
     * @param date Date which is used for comparison of same day
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
        return new DateFnsDateApiObject(new Date(this._value));
    }

    /**
     * Creates clone of this instance, value and originalValue have same value and are cloned from originalValue
     */
    public cloneOriginal(): DateApiObject<Date>
    {
        return new DateFnsDateApiObject(new Date(this._originalValue));
    }

    /**
     * Updates originalValue, if value is not provided originalValue is set to value
     * @param value Value to be set as original, or null (value will be used as value)
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
export class DateFnsDateApi implements DateApi<Date>
{
    /**
     * Gets wrapping object used for manipulation
     * @param value Value to be converted (parsed) and used for manipulation
     */
    public getValue(value: DateValue|Date): DateApiObject<Date>
    {
        return new DateFnsDateApiObject(value);
    }

    /**
     * Gets wrapping object used for manipulation instantiated to current date and time
     */
    public now(): DateApiObject<Date>
    {
        return new DateFnsDateApiObject(new Date());
    }
}