import {Component, ChangeDetectionStrategy} from '@angular/core';

/**
 * Component used for displaying time picker
 */
@Component(
{
    selector: 'date-time-time-picker',
    templateUrl: 'timePicker.component.html',
    styleUrls: ['timePicker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerComponent
{
}