import {ChangeDetectorRef, inject} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {DATE_API} from '../../../misc/tokens';
import {DateTimeObjectValue} from '../../../misc/types';
import {DateApi, DateApiObject} from '../../../services';
import {DateTimePicker, PeriodData} from '../interfaces';

/**
 * Base abstract class for each date time period picker
 */
export abstract class DateTimePeriodPickerBase<TPeriod extends PeriodData<TDate>, TDate = unknown> implements DateTimePicker<TDate>
{
    //######################### protected properties #########################

    /**
     * Array of period data to be displayed
     */
    protected periodData: TPeriod[] = [];

    /**
     * Subject used for emitting of value changes
     */
    protected valueChangeSubject: Subject<void> = new Subject<void>();

    /**
     * Subject used for scaling up
     */
    protected scaleUpSubject: Subject<TDate> = new Subject<TDate>();

    /**
     * Subject used for scaling down
     */
    protected scaleDownSubject: Subject<TDate> = new Subject<TDate>();

    /**
     * Date api instance for displayed date
     */
    protected displayDate: DateApiObject<TDate>|undefined|null;

    /**
     * Currently displayed date
     */
    protected displayedDate: TDate|undefined|null;

    /**
     * Date api instance for max date
     */
    protected maxDateObj: DateApiObject<TDate>|undefined|null;

    /**
     * Date api instance for min date
     */
    protected minDateObj: DateApiObject<TDate>|undefined|null;

    /**
     * Gets or sets value as single value
     */
    protected get singleValue(): DateApiObject<TDate>|undefined|null
    {
        if(Array.isArray(this.value))
        {
            return null;
        }

        return this.value;
    }
    protected set singleValue(value: DateApiObject<TDate>|undefined|null)
    {
        this.value = value;
    }

    /**
     * Gets or sets value as single value
     */
    protected get rangeValue(): [DateApiObject<TDate>|null, DateApiObject<TDate>|null]|undefined|null
    {
        if(!Array.isArray(this.value))
        {
            return null;
        }

        return this.value;
    }
    protected set rangeValue(value: [DateApiObject<TDate>|null, DateApiObject<TDate>|null]|undefined|null)
    {
        this.value = value;
    }

    /**
     * Change detector instance
     */
    protected changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);

    /**
     * Instance of date api for manipulation with date time
     */
    protected dateApi: DateApi<TDate> = inject(DATE_API) as DateApi<TDate>;

    //######################### public properties - implementation of DateTimePicker #########################

    /**
     * @inheritdoc
     */
    public value: DateTimeObjectValue<TDate>|undefined|null;

    /**
     * @inheritdoc
     */
    public get display(): TDate|undefined|null
    {
        return this.displayDate?.value;
    }
    public set display(value: TDate|undefined|null)
    {
        if(!value)
        {
            this.displayDate = null;

            return;
        }

        this.displayDate = this.dateApi.getValue(value);
    }

    /**
     * @inheritdoc
     */
    public get maxDate(): TDate|undefined|null
    {
        return this.maxDateObj?.value;
    }
    public set maxDate(value: TDate|undefined|null)
    {
        if(!value)
        {
            this.maxDateObj = null;

            return;
        }

        this.maxDateObj = this.dateApi.getValue(value);
    }

    /**
     * @inheritdoc
     */
    public get minDate(): TDate|undefined|null
    {
        return this.minDateObj?.value;
    }
    public set minDate(value: TDate|undefined|null)
    {
        if(!value)
        {
            this.minDateObj = null;

            return;
        }

        this.minDateObj = this.dateApi.getValue(value);
    }

    /**
     * @inheritdoc
     */
    public canScaleUp: boolean = false;

    /**
     * @inheritdoc
     */
    public canScaleDown: boolean = false;

    /**
     * @inheritdoc
     */
    public ranged: boolean = false;

    /**
     * @inheritdoc
     */
    public get valueChange(): Observable<void>
    {
        return this.valueChangeSubject.asObservable();
    }

    /**
     * @inheritdoc
     */
    public get scaleUp(): Observable<TDate>
    {
        return this.scaleUpSubject.asObservable();
    }

    /**
     * @inheritdoc
     */
    public get scaleDown(): Observable<TDate>
    {
        return this.scaleDownSubject.asObservable();
    }

    //######################### public methods - implementation of invalidatable #########################

    /**
     * @inheritdoc
     */
    public invalidateVisuals(): void
    {
        this.onRender();

        this.changeDetector.detectChanges();
    }

    //######################### protected methods #########################

    /**
     * Method that is being called to render changes
     */
    protected abstract onRender(): void;

    /**
     * Tests whether provided value is in same period target value
     * @param val - Tested value
     * @param target - Target value to be tested against
     */
    protected abstract isSamePeriod(val: DateApiObject<TDate>, target: TDate): boolean;

    /**
     * Updates minimal and maximal value for picker
     */
    protected updateMinMax(): void
    {
        if(!this.periodData.length)
        {
            return;
        }

        //no min, no max
        if(!this.minDateObj && !this.maxDateObj)
        {
            this.periodData.forEach(itm => itm.disabled = false);

            return;
        }

        let restAfter = false;

        for(const period of this.periodData)
        {
            if(this.minDateObj?.isValid() && this.minDateObj.isAfter(period.dateObj.value) && !this.isSamePeriod(this.minDateObj, period.dateObj.value))
            {
                period.disabled = true;
            }

            if(restAfter || (this.maxDateObj?.isValid() && this.maxDateObj.isBefore(period.dateObj.value) && !this.isSamePeriod(this.maxDateObj, period.dateObj.value)))
            {
                restAfter = true;
                period.disabled = true;
            }
        }
    }

    /**
     * Sets active date
     */
    protected setActive(): void
    {
        this.periodData.forEach(itm => itm.active = false);

        if(!this.value)
        {
            return;
        }
        
        if(!this.ranged)
        {
            if(this.singleValue?.isValid())
            {
                const value = this.singleValue;
                const data = this.periodData.find(itm => this.isSamePeriod(itm.dateObj, value.value));

                if(data)
                {
                    data.active = true;
                }
            }
        }
        else
        {
            //TODO: support range
        }
    }
}