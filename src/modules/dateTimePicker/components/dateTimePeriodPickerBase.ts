import {Observable, Subject} from 'rxjs';

import {DateTimeObjectValue} from '../../../misc/types';
import {DateApiObject} from '../../../services';
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
    public display: TDate|undefined|null;

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
}