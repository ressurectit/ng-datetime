import {Directive, ExistingProvider, forwardRef, Inject, OnInit} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';

import {DATE_API} from '../../../../misc/tokens';
import {datetimeMinValidator} from '../../../../misc/validators';
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
    standalone: true,
})
export class DateTimeMinValidatorDirective<TDate = unknown> extends DateTimeBase<TDate>  implements Validator, OnInit
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
        this._validator = datetimeMinValidator(this.dateApi, this.dateTimeData.minDateTime, this.dateTimeData.valueFormat, this.dateTimeData.customFormat, this.dateTimeData.dataFormat);
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
    protected override onMinDateTimeChange(): void
    {
        this._validator = datetimeMinValidator(this.dateApi, this.dateTimeData.minDateTime, this.dateTimeData.valueFormat, this.dateTimeData.customFormat, this.dateTimeData.dataFormat);
    }
}