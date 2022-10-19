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
     * Max allowed date
     */
    maxDate: TDate|undefined|null;

    /**
     * Min allowed date to be selected
     */
    minDate: TDate|undefined|null;

    /**
     * Indication whether picker can display scale date time period up
     */
    canScaleUp: boolean;

    /**
     * Indication whether picker can display scale date time period down
     */
    canScaleDown: boolean;

    /**
     * Occurs when date time picker value changes
     */
    readonly valueChange: Observable<void>;    

    /**
     * Occurs when period should be scaled up
     */
    readonly scaleUp: Observable<TDate>;

    /**
     * Occurs when period should be scaled down
     */
    readonly scaleDown: Observable<TDate>;
}