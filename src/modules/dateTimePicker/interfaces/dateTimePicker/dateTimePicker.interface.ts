import {Observable} from 'rxjs';

import {DateTimeObjectValue} from '../../../../misc/types';

/**
 * Describes date time picker API for each date time period
 */
export interface DateTimePicker<TDate = unknown, TOptions = unknown>
{
    /**
     * Value of date time picker
     */
    value: DateTimeObjectValue<TDate>|undefined|null;

    /**
     * Options for date time picker period
     */
    options: TOptions|undefined|null;

    /**
     * Date that describes which date should be displayed
     */
    display: TDate|undefined|null;

    /**
     * Indication whether picker can display lower granularity picker
     */
    canGoUp: boolean;

    /**
     * Indication whether picker can display higher granularity picker
     */
    canGoDown: boolean;

    /**
     * Occurs when date time picker value changes
     */
    readonly valueChange: Observable<void>;    

    /**
     * Occurs when period with lower granularity should be displayed
     */
    readonly goUp: Observable<TDate>;

    /**
     * Occurs when period with higher granularity should be displayed
     */
    readonly goDown: Observable<TDate>;
}