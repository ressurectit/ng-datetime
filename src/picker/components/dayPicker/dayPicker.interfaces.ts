import {CommonPickerCssClasses} from '../../misc/datetimePicker.interface';

/**
 * Specific css classes for day picker
 */
export interface DayPickerCssClasses extends CommonPickerCssClasses
{
    /**
     * Element displaying weekday name
     */
    weekdayName?: string;
}