import {ExistingProvider, forwardRef, Directive} from '@angular/core';
import {NG_VALIDATORS, AbstractControl, Validator, ValidatorFn, ValidationErrors} from '@angular/forms';

import {Validators} from '../../../../misc/validators';
import {DateTimeSelectorComponent} from '../../components/selector/selector.component';

/**
 * Validator that is injected with directive DatetimeValidatorDirective
 */
const DATETIME_VALIDATOR = <ExistingProvider>
{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DatetimeValidatorDirective),
    multi: true
};

/**
 * Directive injecting datetime validator, validating datetime
 */
@Directive(
{
    selector: 'date-time-selector[validate][formControlName]:not([range]),date-time-selector[validate][formControl]:not([range]),date-time-selector[validate][ngModel]:not([range])',
    providers: [DATETIME_VALIDATOR]
})
export class DatetimeValidatorDirective<TDate = any> implements Validator
{
    //######################### private fields #########################

    /**
     * Function used for validations
     */
    private _validator: ValidatorFn = () => null;

    //######################### constructor #########################
    constructor(datetimeSelector: DateTimeSelectorComponent<TDate>)
    {
        this._validator = Validators.datetime(datetimeSelector);
    }

    //######################### public methods - implementation of Validator #########################

    /**
     * Validates input and returns validation result
     * @param control - Control that is being validated
     * @returns validation results
     */
    public validate(control: AbstractControl): ValidationErrors|null
    {
        return this._validator(control);
    }
}