import {isBlank, isJsObject, isPresent, isString, nameof} from '@jscrpt/common';

import {DateTimeValue} from '../interfaces';
import {DateApi, DateApiObject} from '../services';
import {DateTimeValueFormat} from './enums';
import {DateTimeInputOutputValue, DateTimeObjectValue} from './types';

/**
 * Parses date time input output value
 * @param value - Value to be parsed
 * @param dateApi - Date api used for obtaining result
 * @param dateTimeFormat - Date time format type, optional, if not specified autodetection of format will be used
 * @param stringFormat - String format for parsing string dates, required only for string dates
 */
export function parseDateTime<TDate = unknown>(value: DateTimeInputOutputValue<TDate>|undefined|null,
                                               dateApi: DateApi<TDate>,
                                               dateTimeFormat: DateTimeValueFormat|undefined|null,
                                               stringFormat: string|undefined|null,): DateTimeObjectValue<TDate>|undefined|null
{
    if(isBlank(value))
    {
        return value;
    }

    //format is specified
    if(isPresent(dateTimeFormat))
    {
        //string format required, but format string was not provided
        if(dateTimeFormat == DateTimeValueFormat.FormattedString && isBlank(stringFormat))
        {
            throw new Error('DateTime: unable to parse string date, because format is missing!');
        }

        //value is range
        if(isDateTimeValue(value))
        {
            //requirested format is different
            if(dateTimeFormat != DateTimeValueFormat.RangeOfDateInstances)
            {
                throw new Error('DateTime: requested datetime format is not range, but value is range!');
            }

            return [
                isBlank(value.from) ? null : parseDateTime(value.from, dateApi, DateTimeValueFormat.DateInstance, null) as DateApiObject<TDate>,
                isBlank(value.to) ? null : parseDateTime(value.to, dateApi, DateTimeValueFormat.DateInstance, null) as DateApiObject<TDate>,
            ];
        }

        //value should be date instance, or number, or string, but it is not
        if(dateTimeFormat != DateTimeValueFormat.DateInstance &&
           dateTimeFormat != DateTimeValueFormat.FormattedString &&
           dateTimeFormat != DateTimeValueFormat.UnixTimestamp)
        {
            throw new Error('DateTime: unable to get date time value, should be date instance, or string, or number!');
        }

        //value is string, instance of date or unix timestamp
        return dateApi.getValue(value, stringFormat ?? undefined);
    }

    //value is range
    if(isDateTimeValue(value))
    {
        return [
            isBlank(value.from) ? null : parseDateTime(value.from, dateApi, DateTimeValueFormat.DateInstance, null) as DateApiObject<TDate>,
            isBlank(value.to) ? null : parseDateTime(value.to, dateApi, DateTimeValueFormat.DateInstance , null) as DateApiObject<TDate>,
        ];
    }

    //string format, but format string was not provided
    if(isString(value) && isBlank(stringFormat))
    {
        throw new Error('DateTime: unable to parse string date, because format is missing!');
    }

    //value is string, instance of date or unix timestamp
    return dateApi.getValue(value, stringFormat ?? undefined);
}

/**
 * Formats value into specified format of date time
 * @param value - Value that should be converted to input output date time value
 * @param dateTimeFormat - Date time format type
 * @param stringFormat - String format for parsing string dates, required only for string dates
 */
export function formatDateTime<TDate = unknown>(value: DateTimeObjectValue<TDate>|undefined|null,
                                                dateTimeFormat: DateTimeValueFormat,
                                                stringFormat: string|undefined|null): DateTimeInputOutputValue<TDate>|undefined|null
{
    if(isBlank(value))
    {
        return value;
    }

    //value is range
    if(Array.isArray(value))
    {
        //range is expected
        if(dateTimeFormat != DateTimeValueFormat.RangeOfDateInstances)
        {
            throw new Error('DateTime: value is array of values, but format is not range!');
        }

        return {
            from: value[0]?.value ?? null,
            to: value[1]?.value ?? null,
        };
    }

    //range is not expected
    if(dateTimeFormat == DateTimeValueFormat.RangeOfDateInstances)
    {
        throw new Error('DateTime: value is not array of values, but format is range!');
    }

    //string date time
    if(dateTimeFormat == DateTimeValueFormat.FormattedString)
    {
        //string format is missing for string date time
        if(isBlank(stringFormat))
        {
            throw new Error('DateTime: missing string format for string date time!');
        }

        return value.format(stringFormat);
    }

    if(dateTimeFormat == DateTimeValueFormat.UnixTimestamp)
    {
        value.unixTimestamp();
    }

    return value.value;
}

/**
 * Tests whether value is `DateTimeValue`
 * @param value - Value that is tested
 */
export function isDateTimeValue<TDate = unknown>(value: unknown): value is DateTimeValue<TDate>
{
    return isJsObject(value) &&
           nameof<DateTimeValue>('from') in value &&
           nameof<DateTimeValue>('to') in value;
}