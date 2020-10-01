import {ChangeDetectorRef, Directive, HostListener, Inject} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {DateTimeValue} from '../../misc/datetime.interface';
import {DATE_API} from '../../misc/tokens';
import {DateApi, DateApiObject} from '../../services/dateApi.interface';
import {DateTimePicker, PeriodData} from '../misc/datetimePicker.interface';

/**
 * Base class used as base for picker
 */
@Directive()
export abstract class PickerBaseComponent<TDate = any, TDateData extends PeriodData<TDate> = any> implements DateTimePicker<TDate>
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
     * Array of period data to be displayed
     * @internal
     */
    public periodData: TDateData[] = [];

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
    public goUp(event: Event)
    {
        event.preventDefault();

        if(!this.canGoUp)
        {
            return;
        }

        this._scaleUp.next(this.displayDate!.value);
    }

    /**
     * Selects period
     * @param event - Event that occured
     * @param period - Selected period
     * @internal
     */
    public select(event: Event, period: PeriodData<TDate>)
    {
        event.preventDefault();

        if(period.disabled)
        {
            return;
        }

        //handle selection of value
        if(!this.canGoDown)
        {
            this._setPeriod(period);

            this._value =
            {
                from: period.date,
                to: this._endOfPeriod(period)
            };

            this._valueChange.next();

            return;
        }

        this._scaleDown.next(period.date);
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Sets value of datetime picker
     * @param value - Value to be set to this picker
     */
    public setValue(value: DateTimeValue<TDate>|null): void
    {
        this._value = value;

        //value is present
        if(this._value && this.displayDate)
        {
            let val = this._dateApi.getValue(this._value.from);

            //change picker to value
            if(!this._isSamePeriod(val))
            {
                this.display(val);

                return;
            }

            let period = this._getPeriodData(val);

            //was initialized
            if(period)
            {
                this._setPeriod(period);
            }
        }
    }

    /**
     * Set displays date to be displayed
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
    public handleClick(event: Event)
    {
        event.preventDefault();
    }

    //######################### protected methods #########################

    /**
     * Sets period as active
     * @param period - Period to be set as active
     */
    protected _setPeriod(period: PeriodData<TDate>)
    {
        this.periodData.forEach(itm => itm.active = false);

        period.active = true;
    }

    /**
     * Obtains end of period
     * @param period - Period for which should be end obtained
     */
    protected abstract _endOfPeriod(period: PeriodData<TDate>): TDate;

    /**
     * Tests whether provided value is in same period
     * @param val - Tested value for same period as displayDate
     */
    protected abstract _isSamePeriod(val: DateApiObject<TDate>): boolean;

    /**
     * Gets period data for specified value
     * @param val - Value for which is period data obtained
     */
    protected abstract _getPeriodData(val: DateApiObject<TDate>): PeriodData<TDate>;
}