import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

import {DateApi} from '../services';
import {DateTimeValueObject} from './datetime.interface';

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
            if(!!datetime.value && !datetime.valid)
            {
                return {
                    "datetime": true
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
            if(!!datetime.value &&
               !datetime.valid &&
               datetime.minValue &&
               dateApi.getValue(datetime.value.from).isBefore(datetime.minValue))
            {
                return {
                    "minDatetime": datetime.minValue,
                    "actualValue": control.value
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
            if(!!datetime.value &&
               !datetime.valid &&
               datetime.maxValue &&
               dateApi.getValue(datetime.value.from).isAfter(datetime.maxValue))
            {
                return {
                    "maxDatetime": datetime.maxValue,
                    "actualValue": control.value
                };
            }

            return null;
        };
    }
}