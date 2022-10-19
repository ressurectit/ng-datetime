import {Component, ChangeDetectionStrategy} from '@angular/core';

import {DateTimePicker} from '../../interfaces';
import {DateTimePeriodPickerBase} from '../dateTimePeriodPickerBase';

/**
 * Component used for displaying day picker
 */
@Component(
{
    selector: 'day-picker',
    templateUrl: 'dayPicker.component.html',
    host:
    {
        '[class.date-time-period]': 'true',
    },
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPickerSAComponent<TDate = unknown> extends DateTimePeriodPickerBase<TDate> implements DateTimePicker<TDate>
{
}