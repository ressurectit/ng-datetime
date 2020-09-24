import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Observable} from 'rxjs';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DateTimePicker} from '../../misc/datetimePicker.interface';

/**
 * Component used for displaying day picker
 */
@Component(
{
    selector: 'date-time-day-picker',
    templateUrl: 'dayPicker.component.html',
    // styleUrls: ['dayPicker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeDayPickerComponent<TDate = any> implements DateTimePicker
{
    //######################### public properties - implementation of DateTimePicker #########################
    /**
     * Gets current value of datetime
     */
    public get value(): DateTimeValue<TDate>|null
    {
        return null;
    }

    /**
     * Occurs when value changes
     */
    public get valueChange(): Observable<void>
    {
        return null;
    }

    /**
     * Occurs when user scales up
     */
    public get scaleUp(): Observable<TDate>
    {
        return null;
    }

    /**
     * Occurs when user scales down
     */
    public get scaleDown(): Observable<TDate>
    {
        return null;
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Sets value of datetime picker
     * @param value - Value to be set to this picker
     */
    public setValue(value: DateTimeValue<TDate>|null): void
    {
    }

    /**
     * Set displays date to be displayed
     * @param value - Value that identifies period that is going to be displayed
     */
    public display(value: TDate): void
    {
    }

    /**
     * Explicitly runs invalidation of content (change detection)
     */
    public invalidateVisuals(): void
    {
    }
}