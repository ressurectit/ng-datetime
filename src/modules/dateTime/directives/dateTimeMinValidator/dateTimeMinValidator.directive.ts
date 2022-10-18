import {Directive, ExistingProvider, forwardRef, Inject} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

import {FormatProvider} from '../../../../interfaces';
import {DATE_API, FORMAT_PROVIDER} from '../../../../misc/tokens';
import {datetimeValidator} from '../../../../misc/validators';
import {DateApi} from '../../../../services';
import {DateTimeBase} from '../dateTimeBase';

/**
 * Applies validator for date time min value
 */
@Directive(
{
    selector: '[dateTime][minDateTime][validate]',
    providers:
    [
        <ExistingProvider>
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DateTimeMinValidatorDirective),
            multi: true
        },
    ],
})
export class DateTimeMinValidatorDirective<TDate = unknown> extends DateTimeBase<TDate>  implements Validator
{
    //######################### private fields #########################

    /**
     * Function used for validations
     */
    private _validator: ValidatorFn = () => null;

    //######################### constructor #########################
    constructor(@Inject(DATE_API) dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) formatProvider: FormatProvider,)
    {
        super(dateApi, formatProvider);
        this._validator = datetimeValidator(dateApi, null, null);
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