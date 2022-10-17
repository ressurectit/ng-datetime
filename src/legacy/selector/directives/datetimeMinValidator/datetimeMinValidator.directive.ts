import {ExistingProvider, forwardRef, Directive, Inject} from '@angular/core';
import {NG_VALIDATORS, AbstractControl, Validator, ValidatorFn, ValidationErrors} from '@angular/forms';

import {Validators} from '../../../../misc/validators';
import {DateTimeSelectorComponent} from '../../components/selector/selector.component';
import {DateApi} from '../../../../services/dateApi.interface';
import {DATE_API} from '../../../../misc/tokens';

/**
 * Validator that is injected with directive DatetimeMinValidatorDirective
 */
const DATETIME_MIN_VALIDATOR = <ExistingProvider>
{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DatetimeMinValidatorDirective),
    multi: true
};

/**
 * Directive injecting datetime min validator, validating min datetime value 
 */
@Directive(
{
    selector: 'date-time-selector[validate][minValue][formControlName]:not([range]),date-time-selector[validate][minValue][formControl]:not([range]),date-time-selector[validate][minValue][ngModel]:not([range])',
    providers: [DATETIME_MIN_VALIDATOR]
})
export class DatetimeMinValidatorDirective<TDate = any> implements Validator
{
    //######################### private fields #########################

    /**
     * Function used for validations
     */
    private _validator: ValidatorFn = () => null;

    //######################### constructor #########################
    constructor(datetimeSelector: DateTimeSelectorComponent<TDate>,
                @Inject(DATE_API) dateApi: DateApi<TDate>)
    {
        this._validator = Validators.minDatetime(datetimeSelector, dateApi);
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