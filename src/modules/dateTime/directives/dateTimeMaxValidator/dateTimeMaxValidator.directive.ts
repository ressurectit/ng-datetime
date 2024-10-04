import {Directive, ExistingProvider, forwardRef, Inject, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

import {DATE_API} from '../../../../misc/tokens';
import {datetimeMaxValidator} from '../../../../misc/validators';
import {DateApi} from '../../../../services';
import {DateTimeBase} from '../dateTimeBase';

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
    standalone: true,
})
export class DateTimeMaxValidatorDirective<TDate = unknown> extends DateTimeBase<TDate>  implements Validator, OnInit
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
        this._validator = datetimeMaxValidator(this.dateApi, this.dateTimeData.maxDateTime, this.dateTimeData.valueFormat, this.dateTimeData.customFormat, this.dateTimeData.dataFormat);
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
        this._validator = datetimeMaxValidator(this.dateApi, this.dateTimeData.maxDateTime, this.dateTimeData.valueFormat, this.dateTimeData.customFormat, this.dateTimeData.dataFormat);
    }
}