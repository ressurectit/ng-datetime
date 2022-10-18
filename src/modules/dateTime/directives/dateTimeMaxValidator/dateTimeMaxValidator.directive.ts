import {Directive, ExistingProvider, forwardRef, Inject, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

import {FormatProvider} from '../../../../interfaces';
import {DATE_API, FORMAT_PROVIDER} from '../../../../misc/tokens';
import {datetimeMaxValidator, datetimeValidator} from '../../../../misc/validators';
import {DateApi} from '../../../../services';
import {DateTimeRestrictedBase} from '../dateTimeRestrictedBase';

/**
 * Applies validator for date time max value
 */
@Directive(
{
    selector: '[dateTime][maxDateTime][validate]',
    providers:
    [
        <ExistingProvider>
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DateTimeMaxValidatorDirective),
            multi: true
        },
    ],
})
export class DateTimeMaxValidatorDirective<TDate = unknown> extends DateTimeRestrictedBase<TDate>  implements Validator, OnInit
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

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        this._validator = datetimeMaxValidator(this.dateApi, this.maxDateTime, this.valueFormat, this.customFormat);
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

    //######################### protected methods - overrides #########################

    /**
     * @inheritdoc
     */
    protected override onMaxDateTimeChange(): void
    {
        this._validator = datetimeMaxValidator(this.dateApi, this.maxDateTime, this.valueFormat, this.customFormat);
    }
}