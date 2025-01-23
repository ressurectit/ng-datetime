import {Directive, ExistingProvider, forwardRef, Inject, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

import {DATE_API} from '../../../../misc/tokens';
import {datetimeValidator} from '../../../../misc/validators';
import {DateApi} from '../../../../services';
import {DateTimeBase} from '../dateTimeBase';

/**
 * Applies validator for date time
 */
@Directive(
{
    selector: '[dateTime][validate]',
    providers:
    [
        <ExistingProvider>
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DateTimeValidatorDirective),
            multi: true,
        },
    ],
})
export class DateTimeValidatorDirective<TDate = unknown> extends DateTimeBase<TDate> implements Validator, OnInit
{
    //######################### private fields #########################

    /**
     * Function used for validations
     */
    private _validator: ValidatorFn = () => null;

    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected dateApi: DateApi<TDate>,)
    {
        super();
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        this._validator = datetimeValidator(this.dateApi, this.dateTimeData.valueFormat, this.dateTimeData.customFormat, this.dateTimeData.dataFormat);
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
