import {Component, ChangeDetectionStrategy} from '@angular/core';

/**
 * Component used for displaying clock time picker
 */
@Component(
{
    selector: 'date-time-clock-time-picker',
    templateUrl: 'clockTimePicker.component.html',
    styleUrls: ['clockTimePicker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockTimePickerComponent
{
}