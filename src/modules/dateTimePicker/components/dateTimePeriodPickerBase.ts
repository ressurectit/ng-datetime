import {ChangeDetectorRef, inject} from '@angular/core';
import {Observable, Subject} from 'rxjs';

import {DATE_API} from '../../../misc/tokens';
import {DateTimeObjectValue} from '../../../misc/types';
import {DateApi, DateApiObject} from '../../../services';
import {DateTimePicker} from '../interfaces';

/**
 * Base abstract class for each date time period picker
 */
export abstract class DateTimePeriodPickerBase<TDate = unknown, TOptions = unknown> implements DateTimePicker<TDate, TOptions>
{
    //######################### protected properties #########################

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
     * Change detector instance
     */
    protected changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);

    /**
     * Instance of date api for manipulation with date time
     */
    protected dateApi: DateApi<TDate> = inject(DATE_API);

    //######################### public properties - implementation of DateTimePicker #########################

    /**
     * @inheritdoc
     */
    public value: DateTimeObjectValue<TDate>|undefined|null;

    /**
     * @inheritdoc
     */
    public options: TOptions|undefined|null;

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
    public maxDate: TDate|undefined|null;

    /**
     * @inheritdoc
     */
    public minDate: TDate|undefined|null;

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
    protected onRender(): void
    {
    }
}