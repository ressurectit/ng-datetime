import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ModelPropertyMetadata, ValidatorFnFactory} from '@anglr/common/forms';
import {isBlank, isNumber, isString} from '@jscrpt/common';

import {DateApi, DateValue} from '../services';
import {getSingleDateTimeValue, parseDateTime} from './utils';
import {DateTimeValueFormat} from './enums';
import {DateTimeInputOutputValue} from './types';
import {DateTimeBase} from '../modules/dateTime/directives/dateTimeBase';
import {DATE_API} from './tokens';

//TODO: add decorators for min and max date time

/**
 * Validations arguments for date time validators for model based forms
 */
export interface DateTimeValidationArgs<TDate = unknown>
{
    /**
     * Format of validated value
     */
    valueFormat?: DateTimeValueFormat|null;

    /**
     * Format of string value
     */
    stringFormat?: string|null;

    /**
     * Max allowed value
     */
    maxValue?: DateValue|TDate|DateTimeBase<TDate>;

    /**
     * Min allowed value
     */
    minValue?: DateValue|TDate|DateTimeBase<TDate>;
}

/**
 * Date time validator factory function, creates validator for checking validity of datetime
 * @param dateApi - Date api used for parsing date time
 * @param valueFormat - Optional required format
 * @param stringFormat - Optional string format of value
 */
export function datetimeValidator<TDate = unknown>(dateApi: DateApi<TDate>,
                                                   valueFormat: DateTimeValueFormat|undefined|null,
                                                   stringFormat: string|undefined|null,): ValidatorFn
{
    return (control: AbstractControl<DateTimeInputOutputValue<TDate>>): ValidationErrors|null =>
    {
        if(isBlank(control.value))
        {
            return null;
        }

        const parsedValue = parseDateTime(control.value, dateApi, valueFormat, stringFormat);

        if(!parsedValue)
        {
            return null;
        }

        if(!Array.isArray(parsedValue))
        {
            if(!parsedValue.isValid())
            {
                return {
                    'datetime': stringFormat
                };
            }
        }
        else
        {
            //TODO: support for ranges
        }

        return null;
    };
}

/**
 * Factory function that creates validator function factory
 * @param args - Static arguments for date time validator
 */
export function dateTimeModelValidatorFactory<TDate = unknown>(args: DateTimeValidationArgs<TDate>): ValidatorFnFactory<DateTimeValidationArgs<TDate>>
{
    return new ValidatorFnFactory<DateTimeValidationArgs<TDate>>(args =>
    {
        const dateApi = args.injector?.get(DATE_API, null);

        if(!dateApi)
        {
            throw new Error('DateTime: missing DateApi! Please provide one.');
        }

        return datetimeValidator(dateApi, args.valueFormat, args.stringFormat);
    }, args);
}

/**
 * Sets date time validator, with default formats
 */
export function DateTime(): PropertyDecorator
/**
 * Sets date time validator, with default string format
 * @param valueFormat - Format of validated value
 */
export function DateTime(valueFormat: DateTimeValueFormat): PropertyDecorator
/**
 * Sets date time validator, with default value format
 * @param stringFormat - Format of string value
 */
export function DateTime(stringFormat: string|null): PropertyDecorator
/**
 * Sets date time validator
 * @param valueFormat - Format of validated value
 * @param stringFormat - Format of string value
 */
export function DateTime(valueFormat: DateTimeValueFormat, stringFormat: string): PropertyDecorator
/**
 * Sets date time validator to property on which is used
 */
export function DateTime(valueFormatOrStringFormat?: DateTimeValueFormat|string|null, stringFormat?: string|undefined|null): PropertyDecorator
{
    let valueFormat: DateTimeValueFormat|undefined|null;

    if(isNumber(valueFormatOrStringFormat))
    {
        valueFormat = valueFormatOrStringFormat;
    }

    if(isString(valueFormatOrStringFormat))
    {
        stringFormat = valueFormatOrStringFormat;
    }

    return ModelPropertyMetadata(
    {
        validators: [dateTimeModelValidatorFactory(
        {
            stringFormat,
            valueFormat,
        })]
    });
}

/**
 * Date time validator factory function, creates validator for checking validity of datetime max value
 * @param dateApi - Date api used for parsing date time
 * @param maxValue - Maximal date time value that should be used for validation against
 * @param valueFormat - Optional required format
 * @param stringFormat - Optional string format of value
 */
export function datetimeMaxValidator<TDate = unknown>(dateApi: DateApi<TDate>,
                                                      maxValue: DateValue|TDate|DateTimeBase<TDate>|undefined|null,
                                                      valueFormat: DateTimeValueFormat|undefined|null,
                                                      stringFormat: string|undefined|null,): ValidatorFn
{
    return (control: AbstractControl<DateTimeInputOutputValue<TDate>>): ValidationErrors|null =>
    {
        if(isBlank(control.value) || isBlank(maxValue))
        {
            return null;
        }

        if(maxValue instanceof DateTimeBase<TDate>)
        {
            const value = getSingleDateTimeValue(maxValue.value);

            //no validation
            if(isBlank(value))
            {
                return null;
            }

            maxValue = value;
        }

        const parsedValue = parseDateTime(control.value, dateApi, valueFormat, stringFormat);

        if(!parsedValue)
        {
            return null;
        }

        const maxDateTime = dateApi.getValue(maxValue, stringFormat ?? undefined);

        if(!Array.isArray(parsedValue))
        {
            if(parsedValue.isValid() && !parsedValue.isBefore(maxDateTime.value))
            {
                return {
                    'datetimemax': maxDateTime.value
                };
            }
        }
        else
        {
            //TODO: support for ranges
        }

        return null;
    };
}

/**
 * Date time validator factory function, creates validator for checking validity of datetime min value
 * @param dateApi - Date api used for parsing date time
 * @param minValue - Minimal date time value that should be used for validation against
 * @param valueFormat - Optional required format
 * @param stringFormat - Optional string format of value
 */
export function datetimeMinValidator<TDate = unknown>(dateApi: DateApi<TDate>,
                                                      minValue: DateValue|TDate|DateTimeBase<TDate>|undefined|null,
                                                      valueFormat: DateTimeValueFormat|undefined|null,
                                                      stringFormat: string|undefined|null,): ValidatorFn
{
    return (control: AbstractControl<DateTimeInputOutputValue<TDate>>): ValidationErrors|null =>
    {
        if(isBlank(control.value) || isBlank(minValue))
        {
            return null;
        }

        if(minValue instanceof DateTimeBase<TDate>)
        {
            const value = getSingleDateTimeValue(minValue.value);

            //no validation
            if(isBlank(value))
            {
                return null;
            }

            minValue = value;
        }

        const parsedValue = parseDateTime(control.value, dateApi, valueFormat, stringFormat);

        if(!parsedValue)
        {
            return null;
        }

        const minDateTime = dateApi.getValue(minValue, stringFormat ?? undefined);

        if(!Array.isArray(parsedValue))
        {
            if(parsedValue.isValid() && !parsedValue.isAfter(minDateTime.value))
            {
                return {
                    'datetimemin': minDateTime.value
                };
            }
        }
        else
        {
            //TODO: support for ranges
        }

        return null;
    };
}
