import {Component, ChangeDetectionStrategy, Input, Inject, Optional} from '@angular/core';

import {DateTimeConfiguration} from '../../../misc/datetime.interface';
import {DateTimeSelector} from '../../misc/datetimeSelector.interface';
import {DATE_TIME_SELECTOR_CONFIGURATION} from '../../misc/tokens';
import {InputDateTimeSelectorComponent} from '../inputDateTime/inputDateTime.component';

/**
 * Default configuration for selector
 */
const defaultConfiguration: DateTimeConfiguration<DateTimeSelector> =
{
    defaultPeriod: 'day',
    periodsDefinition:
    {
        "day": InputDateTimeSelectorComponent
    }
};

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
    
    //######################### constructor #########################
    constructor(@Optional() @Inject(DATE_TIME_SELECTOR_CONFIGURATION) protected _options: DateTimeConfiguration<DateTimeSelector<TDate>>)
    {
    }
}