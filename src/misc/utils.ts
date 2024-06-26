import {isBlank, isJsObject, isPresent, isString, nameof} from '@jscrpt/common';

import {DateTimeValue} from '../interfaces';
import type {DateTimeSADirective} from '../modules/dateTime/directives/dateTime/dateTime.directive';
import {DateApi, DateApiObject, DateValue, DateValueProvider} from '../services';
import {DateTimeValueFormat} from './enums';
import {DateTimeInputOutputValue, DateTimeObjectValue} from './types';

/**
 * Parses date time input output value
 * @param value - Value to be parsed
 * @param dateApi - Date api used for obtaining result
 * @param dateTimeFormat - Date time format type, optional, if not specified autodetection of format will be used
 * @param stringFormat - String format for parsing string dates, required only for string dates
 * @param dataFormat - String format for parsing string dates, required only for string dates, has higher priority than `stringFormat`
 */
export function parseDateTime<TDate = unknown>(value: DateTimeInputOutputValue<TDate>|undefined|null,
                                               dateApi: DateApi<TDate>,
                                               dateTimeFormat: DateTimeValueFormat|undefined|null,
                                               stringFormat: string|undefined|null,
                                               dataFormat: string|undefined|null,): DateTimeObjectValue<TDate>|undefined|null
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
                isBlank(value.from) ? null : parseDateTime(value.from, dateApi, DateTimeValueFormat.DateInstance, null, null) as DateApiObject<TDate>,
                isBlank(value.to) ? null : parseDateTime(value.to, dateApi, DateTimeValueFormat.DateInstance, null, null) as DateApiObject<TDate>,
            ];
        }

        //value should be date instance, or number, or string, but it is not
        if(dateTimeFormat != DateTimeValueFormat.DateInstance &&
           dateTimeFormat != DateTimeValueFormat.FormattedString &&
           dateTimeFormat != DateTimeValueFormat.UnixTimestamp &&
           dateTimeFormat != DateTimeValueFormat.DataString)
        {
            throw new Error('DateTime: unable to get date time value, should be date instance, or string, or number!');
        }

        if(dateTimeFormat == DateTimeValueFormat.DataString)
        {
            //value is string, instance of date or unix timestamp
            return dateApi.getValue(value, dataFormat ?? undefined);
        }

        //value is string, instance of date or unix timestamp
        return dateApi.getValue(value, stringFormat ?? undefined);
    }

    //value is range
    if(isDateTimeValue(value))
    {
        return [
            isBlank(value.from) ? null : parseDateTime(value.from, dateApi, DateTimeValueFormat.DateInstance, null, null) as DateApiObject<TDate>,
            isBlank(value.to) ? null : parseDateTime(value.to, dateApi, DateTimeValueFormat.DateInstance , null, null) as DateApiObject<TDate>,
        ];
    }

    //string format, but format string was not provided
    if(isString(value) && isBlank(stringFormat) && isBlank(dataFormat))
    {
        throw new Error('DateTime: unable to parse string date, because format is missing!');
    }

    //value is string, instance of date or unix timestamp
    return dateApi.getValue(value, dataFormat ?? stringFormat ?? undefined);
}

/**
 * Formats value into specified format of date time
 * @param value - Value that should be converted to input output date time value
 * @param dateTimeFormat - Date time format type
 * @param stringFormat - String format for formatting string dates, required only for string dates
 * @param dataFormat - String format for formatting string dates, required only for string dates, has higher priority than `stringFormat`
 */
export function formatDateTime<TDate = unknown>(value: DateTimeObjectValue<TDate>|undefined|null,
                                                dateTimeFormat: DateTimeValueFormat,
                                                stringFormat: string|undefined|null,
                                                dataFormat: string|undefined|null,): DateTimeInputOutputValue<TDate>|undefined|null
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

    //data string date time
    if(dateTimeFormat == DateTimeValueFormat.DataString)
    {
        //string format is missing for string date time
        if(isBlank(dataFormat))
        {
            throw new Error('DateTime: missing data string format for string date time!');
        }

        return value.format(dataFormat);
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

/**
 * Gets single date time value, use in places where ranged date time can not be used
 * @param value - Value to be examined
 */
export function getSingleDateTimeValue<TDate>(value: DateTimeInputOutputValue<TDate>|undefined|null): DateValue|TDate|null|undefined
{
    if(isDateTimeValue(value))
    {
        throw new Error('DateTime: Unable to apply ranged date time input as value restriction!');
    }

    return value;
}

/**
 * Parses raw value into internal value and value
 * @param rawValue - Raw value to be parsed
 * @param dateApi - Date api for manipulation with date
 * @param dateTimeData - Object storing information about format
 * @param valueProvider - Provider used for obtaining rounded value according format
 */
export function parseRawInput<TDate>(rawValue: string, 
                                     dateApi: DateApi<TDate>,
                                     dateTimeData: DateTimeSADirective<TDate>,
                                     valueProvider: DateValueProvider<TDate>,): [DateTimeObjectValue<TDate>|undefined|null, DateTimeInputOutputValue<TDate>|undefined|null]
{
    if(!rawValue)
    {
        return [null, null];
    }

    const internalValue = getInternalValue(rawValue, dateApi, dateTimeData, valueProvider);
    const value = formatDateTime(internalValue, dateTimeData.valueFormat, dateTimeData.customFormat, dateTimeData.dataFormat);

    return [internalValue, value];
}

/**
 * Gets internal value and fix lowest time difference
 * @param value - Value to be get as internal value
 * @param dateApi - Date api for manipulation with date
 * @param dateTimeData - Object storing information about format
 * @param valueProvider - Provider used for obtaining rounded value according format
 * @param dateTimeFormat - Date time format type, optional, if not specified autodetection of format will be used, used when obtaining value from users input
 */
export function getInternalValue<TDate>(value: DateTimeInputOutputValue<TDate>|undefined|null,
                                        dateApi: DateApi<TDate>,
                                        dateTimeData: DateTimeSADirective<TDate>,
                                        valueProvider: DateValueProvider<TDate>,
                                        dateTimeFormat: DateTimeValueFormat|undefined|null = null,): DateTimeObjectValue<TDate>|undefined|null
{
    let internalValue = parseDateTime(value, dateApi, dateTimeFormat, dateTimeData.customFormat, dateTimeData.dataFormat);

    if(isBlank(internalValue))
    {
        return;
    }

    //update for specified format, round value

    //ranged value
    if(Array.isArray(internalValue))
    {
        const [from, to] = internalValue;

        if(from)
        {
            const val = valueProvider.getValue(from.value, dateTimeData.dataFormat ?? dateTimeData.customFormat).from;

            if(val)
            {
                internalValue[0] = dateApi.getValue(val, dateTimeData.dataFormat ?? dateTimeData.customFormat);
            }
        }

        if(to)
        {
            const val = valueProvider.getValue(to.value, dateTimeData.dataFormat ?? dateTimeData.customFormat).to;

            if(val)
            {
                internalValue[1] = dateApi.getValue(val, dateTimeData.dataFormat ?? dateTimeData.customFormat);
            }
        }
    }
    else
    {
        const val = valueProvider.getValue(internalValue.value, dateTimeData.dataFormat ?? dateTimeData.customFormat).from;

        if(val)
        {
            internalValue = dateApi.getValue(val, dateTimeData.dataFormat ?? dateTimeData.customFormat);
        }
    }

    return internalValue;
}