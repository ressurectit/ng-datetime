import {Observable, Subject} from 'rxjs';

import {DateTimeObjectValue} from '../../../misc/types';
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
     * Subject used for emitting of go up
     */
    protected goUpSubject: Subject<TDate> = new Subject<TDate>();

    /**
     * Subject used for emitting of go down
     */
    protected goDownSubject: Subject<TDate> = new Subject<TDate>();

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
    public canGoUp: boolean = false;

    /**
     * @inheritdoc
     */
    public canGoDown: boolean = false;

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
    public get goUp(): Observable<TDate>
    {
        return this.goUpSubject.asObservable();
    }

    /**
     * @inheritdoc
     */
    public get goDown(): Observable<TDate>
    {
        return this.goDownSubject.asObservable();
    }
}