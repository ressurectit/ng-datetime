import {ChangeDetectorRef, Directive, HostListener, Inject} from '@angular/core';
import {extend} from '@jscrpt/common';
import {Observable, Subject} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API} from '../../../misc/tokens';
import {DateApi, DateApiObject} from '../../../services/dateApi.interface';
import {DateTimePicker} from '../misc/datetimePicker.interface';

/**
 * Base class used as base for picker as base implementation of DateTimePicker interface
 */
@Directive()
export abstract class PickerImplBaseComponent<TDate = any, TCssClasses = any> implements DateTimePicker<TDate, TCssClasses>
{
    //######################### protected fields #########################

    /**
     * Current value of datetime
     */
    protected _value: DateTimeValue<TDate>|null = null;

    /**
     * Occurs when value changes
     */
    protected _valueChange: Subject<void> = new Subject<void>();
    
    /**
     * Occurs when user scales up
     */
    protected _scaleUp: Subject<TDate> = new Subject<TDate>();

    /**
     * Occurs when user scales down
     */
    protected _scaleDown: Subject<TDate> = new Subject<TDate>();

    /**
     * Minimal possible value that can be picked
     */
    protected _minValue: TDate|null = null;

    /**
     * Maximal possible value that can be picked
     */
    protected _maxValue: TDate|null = null;

    //######################### public properties - implementation of DateTimePicker #########################

    /**
     * Gets current value of datetime
     */
    public get value(): DateTimeValue<TDate>|null
    {
        return this._value;
    }

    /**
     * Occurs when value changes
     */
    public get valueChange(): Observable<void>
    {
        return this._valueChange.asObservable();
    }

    /**
     * Occurs when user scales up
     */
    public get scaleUp(): Observable<TDate>
    {
        return this._scaleUp.asObservable();
    }

    /**
     * Occurs when user scales down
     */
    public get scaleDown(): Observable<TDate>
    {
        return this._scaleDown.asObservable();
    }

    //######################### public properties - template bindings #########################

    /**
     * Date api instance for displayed date
     * @internal
     */
    public displayDate: DateApiObject<TDate>|null = null;

    /**
     * Indication whether can go up in period
     * @internal
     */
    public canGoUp: boolean = false;

    /**
     * Indication whether can go down in period
     * @internal
     */
    public canGoDown: boolean = false;

    /**
     * Css classes that are used within picker
     * @internal
     */
    public cssClasses!: TCssClasses;

    //######################### constructor #########################
    constructor(@Inject(DATE_API) protected _dateApi: DateApi<TDate>,
                protected _changeDetector: ChangeDetectorRef)
    {
    }

    //######################### public methods - template bindings #########################

    /**
     * Changes displayed period to "higher" period
     * @param event - Event that occured
     * @internal
     */
    public goUp(event: Event): void
    {
        event.preventDefault();

        if(!this.canGoUp)
        {
            return;
        }

        if(this.displayDate)
        {
            this._scaleUp.next(this.displayDate.value);
        }
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Sets css classes for picker, allowing to override defaults
     * @param cssClasses - Css classes to be set for picker
     */
    public setCssClasses(cssClasses: TCssClasses): void
    {
        this.cssClasses = extend(true, {}, this.cssClasses, cssClasses);
    }

    /**
     * Sets minimal possible value for picker, that can be picked
     * @param value - Minimal possible value that can be picked
     */
    public abstract setMinValue(value: TDate|null): void;

    /**
     * Sets maximal possible value for picker, that can be picked
     * @param value - Maximal possible value that can be picked
     */
    public abstract setMaxValue(value: TDate|null): void;

    /**
     * Sets value of datetime picker
     * @param value - Value to be set to this picker
     */
    public abstract setValue(value: DateTimeValue<TDate>|null): void;

    /**
     * Sets display date to be displayed
     * @param value - Value that identifies period that is going to be displayed
     */
    public abstract display(value: DateApiObject<TDate>): void;

    /**
     * Sets indication whether can go down
     * @param value - Indication whether can go down in period
     */
    public setCanGoDown(value: boolean): void
    {
        this.canGoDown = value;
    }

    /**
     * Sets indication whether can go up
     * @param value - Indication whether can go up in period
     */
    public setCanGoUp(value: boolean): void
    {
        this.canGoUp = value;
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
        this._changeDetector.detectChanges();
    }

    //######################### public methods - host #########################

    /**
     * Handles click anyway in picker, that blocks blur
     * @param event - Event that occured
     * @internal
     */
    @HostListener('mousedown', ['$event'])
    public handleClick(event: Event): void
    {
        event.preventDefault();
    }
}