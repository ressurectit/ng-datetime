import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {isBlank} from '@jscrpt/common';

import {DateApi} from '../services';
import {DateTimeValueObject} from '../interfaces/dateTime/datetime.interface';
import {parseDateTime} from './utils';
import {DateTimeValueFormat} from './enums';
import {DateTimeInputOutputValue} from './types';

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
                    'datetime': true
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
 * Validations functions for datetime
 */
export class Validators
{
    /**
     * Creates validator function that validates control if its value is valid datetime value
     * @param datetime - Object storing information about datetime value
     */
    public static datetime<TDate = any>(datetime: DateTimeValueObject<TDate>): ValidatorFn
    {
        return (): ValidationErrors|null =>
        {
            if(!datetime.valid)
            {
                return {
                    'datetime': true
                };
            }

            return null;
        };
    }

    /**
     * Creates validator function that validates control if its value is withing range of minimal datetime value
     * @param datetime - Object storing information about datetime value
     * @param dateApi - Date api object
     */
    public static minDatetime<TDate = any>(datetime: DateTimeValueObject<TDate>, dateApi: DateApi<TDate>): ValidatorFn
    {
        return (control: AbstractControl): ValidationErrors|null =>
        {
            if(!!control.value &&
               datetime.valid &&
               datetime.minValue &&
               dateApi.getValue(control.value).isBefore(datetime.minValue))
            {
                return {
                    'minDatetime': datetime.minValue,
                    'actualValue': control.value
                };
            }

            return null;
        };
    }

    /**
     * Creates validator function that validates control if its value is withing range of maximal datetime value
     * @param datetime - Object storing information about datetime value
     * @param dateApi - Date api object
     */
    public static maxDatetime<TDate = any>(datetime: DateTimeValueObject<TDate>, dateApi: DateApi<TDate>): ValidatorFn
    {
        return (control: AbstractControl): ValidationErrors|null =>
        {
            if(!!control.value &&
               datetime.valid &&
               datetime.maxValue &&
               dateApi.getValue(control.value).isAfter(datetime.maxValue))
            {
                return {
                    'maxDatetime': datetime.maxValue,
                    'actualValue': control.value
                };
            }

            return null;
        };
    }
}