import {Directive, inject, Input, OnDestroy} from '@angular/core';
import {Action1, BindThis, isBlank, isString} from '@jscrpt/common';
import {Observable, Subject, Subscription} from 'rxjs';

import {FormatProvider} from '../../../../interfaces';
import {DateTimeValueFormat} from '../../../../misc/enums';
import {DATE_API, FORMAT_PROVIDER} from '../../../../misc/tokens';
import {DateTimeInputOutputValue} from '../../../../misc/types';
import {getSingleDateTimeValue} from '../../../../misc/utils';
import {DateApi, DateValue} from '../../../../services';
import {DateTimeBase} from '../dateTimeBase';

/**
 * Directive that holds shared data for date time, like formats, restrictions
 */
@Directive(
{
    selector: '[dateTime]'
})
export class DateTimeDirective<TDate = unknown> implements OnDestroy
{
    //######################### protected properties #########################

    /**
     * Subject used for emitting changes in max date time value
     */
    protected maxDateTimeChangesSubject: Subject<void> = new Subject<void>();

    /**
     * Subject used for emitting changes in min date time value
     */
    protected minDateTimeChangesSubject: Subject<void> = new Subject<void>();

    /**
     * Subscription for max date instance value changes
     */
    protected maxDateInstanceChange: Subscription|undefined|null;

    /**
     * Subscription for min date instance value changes
     */
    protected minDateInstanceChange: Subscription|undefined|null;

    /**
     * Max allowed value of date time
     */
    protected ɵMaxDateTime: TDate|undefined|null;

    /**
     * Min allowed value of date time
     */
    protected ɵMinDateTime: TDate|undefined|null;

    /**
     * Date time value format which is being worked with in this date time
     */
    protected ɵValueFormat: DateTimeValueFormat = DateTimeValueFormat.DateInstance;

    /**
     * Format of string representation of date
     */
    protected ɵFormat: keyof FormatProvider = 'date';

    /**
     * Date api instance, used for date time manipulation
     */
    protected dateApi: DateApi<TDate> = inject(DATE_API);

    /**
     * Provider for available formats
     */
    protected formatProvider: FormatProvider = inject(FORMAT_PROVIDER);

    //######################### public properties #########################

    /**
     * Occurs when there are changes in max date time value
     */
    public get maxDateTimeChanges(): Observable<void>
    {
        return this.maxDateTimeChangesSubject.asObservable();
    }

    /**
     * Occurs when there are changes in min date time value
     */
    public get minDateTimeChanges(): Observable<void>
    {
        return this.minDateTimeChangesSubject.asObservable();
    }

    //######################### public properties - inputs #########################

    /**
     * Gets or sets date time value format which is being worked with in this date time
     */
    @Input()
    public get valueFormat(): DateTimeValueFormat
    {
        return this.ɵValueFormat;
    }
    public set valueFormat(value: DateTimeValueFormat)
    {
        if(isString(value))
        {
            this.ɵValueFormat = DateTimeValueFormat[value] as unknown as DateTimeValueFormat;

            return;
        }

        this.ɵValueFormat = value;
    }

    /**
     * Gets or sets format of string representation of date
     */
    @Input()
    public get format(): keyof FormatProvider
    {
        return this.ɵFormat;
    }
    public set format(value: keyof FormatProvider)
    {
        this.ɵFormat = value;
        this.customFormat = this.dateApi.getFormat(this.formatProvider[value]);
    }

    /**
     * Custom format string representation of date
     */
    @Input()
    public customFormat: string = this.dateApi.getFormat(this.formatProvider[this.ɵFormat]);

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
        this.maxDateInstanceChange?.unsubscribe();
        this.maxDateInstanceChange = null;

        if(isBlank(value))
        {
            this.maxDateSet(value);

            return;
        }

        let val: DateTimeInputOutputValue<TDate> = value;

        if(value instanceof DateTimeBase<TDate>)
        {
            this.maxDateInstanceChange = value.valueChange.subscribe(() =>
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
        this.minDateInstanceChange?.unsubscribe();
        this.minDateInstanceChange = null;

        if(isBlank(value))
        {
            this.minDateSet(value);

            return;
        }

        let val: DateTimeInputOutputValue<TDate> = value;

        if(value instanceof DateTimeBase<TDate>)
        {
            this.minDateInstanceChange = value.valueChange.subscribe(() =>
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
        this.maxDateInstanceChange?.unsubscribe();
        this.maxDateInstanceChange = null;

        this.minDateInstanceChange?.unsubscribe();
        this.minDateInstanceChange = null;
    }

    //######################### protected methods #########################

    /**
     * Sets min date time and notifies about changes
     * @param value - Value to be set
     */
    @BindThis
    protected minDateSet(value: TDate|undefined|null): void
    {
        this.ɵMinDateTime = value;
        this.minDateTimeChangesSubject.next();
    }

    /**
     * Sets max date time and notifies about changes
     * @param value - Value to be set
     */
    @BindThis
    protected maxDateSet(value: TDate|undefined|null): void
    {
        this.ɵMaxDateTime = value;
        this.maxDateTimeChangesSubject.next();
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
     * Custom input type for `valueFormat` input
     */
    public static ngAcceptInputType_valueFormat: keyof typeof DateTimeValueFormat|DateTimeValueFormat;

    /**
     * Custom input type for `maxDateTime` input
     */
    public static ngAcceptInputType_maxDateTime: DateValue|DateTimeBase;

    /**
     * Custom input type for `minDateTime` input
     */
    public static ngAcceptInputType_minDateTime: DateValue|DateTimeBase;
}