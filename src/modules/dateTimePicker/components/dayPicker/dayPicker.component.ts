import {Component, ChangeDetectionStrategy} from '@angular/core';
import {HostDisplayBlockStyle} from '@anglr/common';

// /**
//  * Default styles for picker
//  */
// const defaultStyles: DayPickerCssClasses =
// {
//     periodSelection: 'period',
//     previousPeriod: 'fas fa-angle-left clickable',
//     nextPeriod: 'fas fa-angle-right clickable',
//     periodValue: 'period-value',
//     periodData: 'period-data',
//     periodDatum: 'period-datum clickable',
//     weekdayName: 'weekday',
//     clickable: 'clickable'
// };

/**
 * Component used for displaying day picker
 */
@Component(
{
    selector: 'day-picker',
    templateUrl: 'dayPicker.component.html',
    styleUrls: ['dayPicker.component.css'],
    styles: [HostDisplayBlockStyle],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPickerComponent<TDate = any>
{
}