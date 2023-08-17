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
    selector: '[dateTime]',
    standalone: true,
})
export class DateTimeSADirective<TDate = unknown> implements OnDestroy
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
     * Subject used for emitting changes in custom format value
     */
    protected customFormatChangesSubject: Subject<void> = new Subject<void>();

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
    protected ɵmaxDateTime: TDate|undefined|null;

    /**
     * Min allowed value of date time
     */
    protected ɵminDateTime: TDate|undefined|null;

    /**
     * Date time value format which is being worked with in this date time
     */
    protected ɵvalueFormat: DateTimeValueFormat = DateTimeValueFormat.DateInstance;

    /**
     * Format of string representation of date
     */
    protected ɵformat: keyof FormatProvider = 'date';

    /**
     * Date api instance, used for date time manipulation
     */
    protected dateApi: DateApi<TDate> = inject(DATE_API) as DateApi<TDate>;

    /**
     * Provider for available formats
     */
    protected formatProvider: FormatProvider = inject(FORMAT_PROVIDER);

    /**
     * Custom format string representation of date
     */
    protected ɵcustomFormat: string = this.dateApi.getFormat(this.formatProvider[this.ɵformat]);

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

    /**
     * Occurs when there are changes in custom format value
     */
    public get customFormatChanges(): Observable<void>
    {
        return this.customFormatChangesSubject.asObservable();
    }

    //######################### public properties - inputs #########################

    /**
     * Gets or sets date time value format which is being worked with in this date time
     */
    @Input()
    public get valueFormat(): DateTimeValueFormat
    {
        return this.ɵvalueFormat;
    }
    public set valueFormat(value: DateTimeValueFormat)
    {
        if(isString(value))
        {
            this.ɵvalueFormat = DateTimeValueFormat[value] as unknown as DateTimeValueFormat;

            return;
        }

        this.ɵvalueFormat = value;
    }

    /**
     * Gets or sets format of string representation of date
     */
    @Input()
    public get format(): keyof FormatProvider
    {
        return this.ɵformat;
    }
    public set format(value: keyof FormatProvider)
    {
        this.ɵformat = value;
        this.customFormat = this.dateApi.getFormat(this.formatProvider[value]);
    }

    /**
     * Gets or sets custom format string representation of date
     */
    @Input()
    public get customFormat(): string
    {
        return this.ɵcustomFormat;
    }
    public set customFormat(value: string)
    {
        this.ɵcustomFormat = value;
        this.customFormatChangesSubject.next();
    }

    /**
     * Gets or sets max allowed date for date time
     */
    @Input()
    public get maxDateTime(): TDate|undefined|null
    {
        return this.ɵmaxDateTime;
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

        if(value instanceof DateTimeBase)
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
        return this.ɵminDateTime;
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

        if(value instanceof DateTimeBase)
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
        this.ɵminDateTime = value;
        this.minDateTimeChangesSubject.next();
        this.onMinDateTimeChange();
    }

    /**
     * Sets max date time and notifies about changes
     * @param value - Value to be set
     */
    @BindThis
    protected maxDateSet(value: TDate|undefined|null): void
    {
        this.ɵmaxDateTime = value;
        this.maxDateTimeChangesSubject.next();
        this.onMaxDateTimeChange();
    }

    /**
     * Sets min or max date time value
     * @param value - Value to be set
     * @param setter - Action used for setting value
     */
    protected setMinMaxValue(value: DateValue|TDate, setter: Action1<TDate|undefined|null>): void
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