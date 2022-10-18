import {Directive, Input, OnDestroy} from '@angular/core';
import {Action1, BindThis, isBlank} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {DateTimeInputOutputValue} from '../../../misc/types';
import {getSingleDateTimeValue} from '../../../misc/utils';
import {DateTimeBase} from './dateTimeBase';

/**
 * Base class for date time directives with value restrictions
 */
@Directive()
export class DateTimeRestrictedBase<TDate = unknown> extends DateTimeBase<TDate> implements OnDestroy
{
    //######################### private fields #########################

    /**
     * Subscription for max date instance value changes
     */
    private _maxDateInstanceChange: Subscription|undefined|null;

    /**
     * Subscription for min date instance value changes
     */
    private _minDateInstanceChange: Subscription|undefined|null;

    //######################### protected properties #########################

    /**
     * Max allowed value of date time
     */
    protected ɵMaxDateTime: TDate|undefined|null;

    /**
     * Min allowed value of date time
     */
    protected ɵMinDateTime: TDate|undefined|null;

    //######################### public properties - inputs #########################

    /**
     * Gets or sets max allowed date for date time
     */
    @Input()
    public get maxDateTime(): TDate|undefined|null
    {
        return this.ɵMaxDateTime;
    }
    public set maxDateTime(value: TDate|undefined|null)
    {
        this._maxDateInstanceChange?.unsubscribe();
        this._maxDateInstanceChange = null;

        if(isBlank(value))
        {
            this.maxDateSet(value);

            return;
        }

        let val: DateTimeInputOutputValue<TDate> = value;

        if(value instanceof DateTimeBase<TDate>)
        {
            this._maxDateInstanceChange = value.valueChange.subscribe(() =>
            {
                const val = getSingleDateTimeValue<TDate>(value.value);

                if(isBlank(val))
                {
                    this.maxDateSet(null);

                    return;
                }

                this.setMinMaxValue(val, this.maxDateSet);
            });

            const v = getSingleDateTimeValue<TDate>(value.value);

            if(isBlank(v))
            {
                this.maxDateSet(null);

                return;
            }

            val = v;
        }
        
        this.setMinMaxValue(val, this.maxDateSet);
    }

    /**
     * Gets or sets min allowed date for date time
     */
    @Input()
    public get minDateTime(): TDate|undefined|null
    {
        return this.ɵMinDateTime;
    }
    public set minDateTime(value: TDate|undefined|null)
    {
        this._minDateInstanceChange?.unsubscribe();
        this._minDateInstanceChange = null;

        if(isBlank(value))
        {
            this.minDateSet(value);

            return;
        }

        let val: DateTimeInputOutputValue<TDate> = value;

        if(value instanceof DateTimeBase<TDate>)
        {
            this._minDateInstanceChange = value.valueChange.subscribe(() =>
            {
                const val = getSingleDateTimeValue<TDate>(value.value);

                if(isBlank(val))
                {
                    this.minDateSet(null);

                    return;
                }

                this.setMinMaxValue(val, this.minDateSet);
            });

            const v = getSingleDateTimeValue<TDate>(value.value);

            if(isBlank(v))
            {
                this.minDateSet(null);

                return;
            }

            val = v;
        }

        this.setMinMaxValue(val, this.minDateSet);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this._maxDateInstanceChange?.unsubscribe();
        this._maxDateInstanceChange = null;

        this._minDateInstanceChange?.unsubscribe();
        this._minDateInstanceChange = null;
    }

    //######################### protected methods #########################

    /**
     * Called whenever max date time restriction changes
     */
    protected onMaxDateTimeChange(): void
    {
    }

    /**
     * Called whenever min date time restriction changes
     */
    protected onMinDateTimeChange(): void
    {
    }

    /**
     * Sets min date time and notifies about changes
     * @param value - Value to be set
     */
    @BindThis
    protected minDateSet(value: TDate|undefined|null): void
    {
        this.ɵMinDateTime = value;
        this.onMinDateTimeChange();
    }

    /**
     * Sets max date time and notifies about changes
     * @param value - Value to be set
     */
    @BindThis
    protected maxDateSet(value: TDate|undefined|null): void
    {
        this.ɵMaxDateTime = value;
        this.onMaxDateTimeChange();
    }

    /**
     * Sets min or max date time value
     * @param value - Value to be set
     * @param setter - Action used for setting value
     */
    protected setMinMaxValue(value: string|number|TDate|Date, setter: Action1<TDate|undefined|null>): void
    {
        const val = this.dateApi.getValue(value, this.customFormat);

        if(val.isValid())
        {
            setter(val.value);
        }
        else
        {
            setter(null);
        }
    }

    //######################### ng language server #########################
    
    /**
     * Custom input type for `maxDateTime` input
     */
    public static ngAcceptInputType_maxDateTime: string|number|DateTimeBase|Date;

    /**
     * Custom input type for `minDateTime` input
     */
    public static ngAcceptInputType_minDateTime: string|number|DateTimeBase|Date;
}
