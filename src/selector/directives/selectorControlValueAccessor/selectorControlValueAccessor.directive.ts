import {Directive, ExistingProvider, forwardRef, Renderer2, ElementRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

/**
 * Value accessor provider for date time selector
 */
const DATE_TIME_SELECTOR_VALUE_ACCESSOR = <ExistingProvider>
{
    provide: NG_VALUE_ACCESSOR, 
    useExisting: forwardRef(() => DateTimeSelectorControlValueAccessor), 
    multi: true
};

/**
 * Value accessor for getting and setting values for date time selector
 */
@Directive(
{
    selector: 'date-time-selector[formControlName],date-time-selector[formControl],date-time-selector[ngModel]',
    providers: [DATE_TIME_SELECTOR_VALUE_ACCESSOR],
    host: 
    {
        '(change)': 'onChange($event.target.value)',
        '(input)': 'onChange($event.target.value)',
        '(blur)': 'onTouched()'
    }
})
export class DateTimeSelectorControlValueAccessor implements ControlValueAccessor
{
    //######################### public properties #########################
    
    public onChange = (_: any) => {};
    
    /**
     * Method that is called when picker was touched
     */
    public onTouched = () => {};
    
    //######################### constructor #########################
    constructor(private _renderer: Renderer2, private _elementRef: ElementRef)
    {
    }

    //######################### public methods - implementation of ControlValueAccessor #########################

    /**
     * Sets value to select
     */
    public writeValue(value: any): void
    {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', value);
    }

    /**
     * Registers callback that is called when value of select changes
     */
    public registerOnChange(fn: (data: any) => any): void
    {
    }

    /**
     * Registers callback that is called when select is closed
     */
    public registerOnTouched(fn: () => any): void
    {
    }
}
