import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

import {DateTimeConfiguration} from '../../../datetime';
import {DateTimeSelector} from '../../misc/datetimeSelector.interface';

/**
 * Component used for displaying and selecting date time
 */
@Component(
{
    selector: 'date-time-selector',
    templateUrl: 'selector.component.html',
    // styleUrls: ['selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeSelectorComponent<TDate = any>
{
    //######################### public properties - inputs #########################

    /**
     * Format of displayed
     */
    @Input()
    public format: string;

    /**
     * Current configuration used by selector
     */
    @Input()
    public config: DateTimeConfiguration<DateTimeSelector<TDate>>;
}