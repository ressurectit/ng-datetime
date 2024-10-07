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
     * @inheritdoc
     */
    public get originalValue(): moment.Moment
    {
        return this._originalValue;
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    public isValid(): boolean
    {
        return this._value.isValid();
    }

    /**
     * @inheritdoc
     */
    public isWeekend(): boolean
    {
        const weekday = this._value.isoWeekday();

        return weekday == 6 || weekday == 7;
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    public startOfDecade(): DateApiObject<moment.Moment>
    {
        const diff = (this._value.year() % 10);

        this._value = moment(this._value).subtract(diff, 'years').startOf('year');

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfDecade(): DateApiObject<moment.Moment>
    {
        const diff = 9 - (this._value.year() % 10);

        this._value = moment(this._value).add(diff, 'years').endOf('year');

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfYear(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('year');

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfYear(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('year');

        return this;
    }

    /**
     * @inheritdoc
     */
    public addYears(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'years');

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractYears(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'years');

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfMonth(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('month');

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfMonth(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('month');

        return this;
    }

    /**
     * @inheritdoc
     */
    public addMonths(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'months');

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractMonths(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'months');

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfWeek(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('week');

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfWeek(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('week');

        return this;
    }

    /**
     * @inheritdoc
     */
    public addWeeks(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'weeks');

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractWeeks(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'weeks');

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfDay(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('day');

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfDay(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('day');

        return this;
    }

    /**
     * @inheritdoc
     */
    public addDays(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'days');

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractDays(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'days');

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfHour(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('hour');

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfHour(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('hour');

        return this;
    }

    /**
     * @inheritdoc
     */
    public addHours(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'hours');

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractHours(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'hours');

        return this;
    }

    /**
     * @inheritdoc
     */
    public startOfMinute(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).startOf('minute');

        return this;
    }

    /**
     * @inheritdoc
     */
    public endOfMinute(): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).endOf('minute');

        return this;
    }

    /**
     * @inheritdoc
     */
    public addMinutes(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).add(count ?? 1, 'minutes');

        return this;
    }

    /**
     * @inheritdoc
     */
    public subtractMinutes(count?: number): DateApiObject<moment.Moment>
    {
        this._value = moment(this._value).subtract(count ?? 1, 'minutes');

        return this;
    }

    /**
     * @inheritdoc
     */
    public daysInMonth(): number
    {
        return this._value.daysInMonth();
    }

    /**
     * @inheritdoc
     */
    public year(): number;
    public year(year: number): DateApiObject<moment.Moment>;
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
     * @inheritdoc
     */
    public month(): number
    public month(month: number): DateApiObject<moment.Moment>
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
     * @inheritdoc
     */
    public dayOfMonth(): number;
    public dayOfMonth(day: number): DateApiObject<moment.Moment>;
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
     * @inheritdoc
     */
    public dayOfWeek(): number;
    public dayOfWeek(day: number): DateApiObject<moment.Moment>;
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
     * @inheritdoc
     */
    public hour(): number;
    public hour(hour: number): DateApiObject<moment.Moment>;
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
     * @inheritdoc
     */
    public minute(): number;
    public minute(minute: number): DateApiObject<moment.Moment>;
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
     * @inheritdoc
     */
    public isBefore(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isBefore(date);
    }

    /**
     * @inheritdoc
     */
    public isAfter(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isAfter(date);
    }

    /**
     * @inheritdoc
     */
    public diffDays(date: DateObject<moment.Moment>): number
    {
        date = this.getDate(date);

        return moment(this._value).startOf('day').diff(moment(date).startOf('day'), 'days');
    }

    /**
     * @inheritdoc
     */
    public isSameWeek(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isSame(date, 'week');
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    public isSameYear(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isSame(date, 'year');
    }

    /**
     * @inheritdoc
     */
    public isSameMonth(date: DateObject<moment.Moment>): boolean
    {
        date = this.getDate(date);

        return this._value.isSame(date, 'month');
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    public clone(): DateApiObject<moment.Moment>
    {
        return new MomentDateApiObject(moment(this._value));
    }

    /**
     * @inheritdoc
     */
    public cloneOriginal(): DateApiObject<moment.Moment>
    {
        return new MomentDateApiObject(moment(this._originalValue));
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
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
     * @inheritdoc
     */
    public getValue(value: DateValue|moment.Moment, format?: string): DateApiObject<moment.Moment>
    {
        return new this._dateApiObjecType(this._relativeParser.parse(value), format);
    }

    /**
     * @inheritdoc
     */
    public now(): DateApiObject<moment.Moment>
    {
        return new this._dateApiObjecType(moment());
    }

    /**
     * @inheritdoc
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
     * @inheritdoc
     */
    public weekStartsOnMonday(): boolean
    {
        return moment.localeData().firstDayOfWeek() === 1;
    }

    /**
     * @inheritdoc
     */
    public weekdays(short?: boolean): string[]
    {
        return short ? moment.weekdaysShort(true) : moment.weekdays(true);
    }

    /**
     * @inheritdoc
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
