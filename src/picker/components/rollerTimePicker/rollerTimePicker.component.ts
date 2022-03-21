import {Component, ChangeDetectionStrategy} from '@angular/core';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DateApiObject} from '../../../services';
import {LoopScrollData} from '../../directives';
import {DateTimePicker} from '../../interfaces';
import {PickerImplBaseComponent} from '../pickerImplBase.component';
import {hours, minutes} from './rollerTimePicker.data';
import {RollerTimePickerCssClasses} from './rollerTimePicker.interface';

/**
 * Component used for rendering roller time picker
 */
@Component(
{
    selector: 'date-time-roller-time-picker',
    templateUrl: 'rollerTimePicker.component.html',
    styleUrls: ['rollerTimePicker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeRollerTimePickerComponent<TDate = any> extends PickerImplBaseComponent<TDate, RollerTimePickerCssClasses> implements DateTimePicker<TDate, RollerTimePickerCssClasses>
{
    //######################### public properties - template bindings #########################

    /**
     * Array of available hours
     */
    public hours: LoopScrollData[] = hours;

    /**
     * Array of available minutes
     */
    public minutes: LoopScrollData[] = minutes;

    /**
     * Indication whether are minutes open
     */
    public minutesOpen: boolean = false;

    /**
     * Indication whether are hours open
     */
    public hoursOpen: boolean = false;

    /**
     * Current value of hour
     */
    public get hour(): number
    {
        return this.displayDate?.hour() ?? 0;
    }
    public set hour(value: number)
    {
        this.displayDate?.hour(value);
    }

    /**
     * Current value of minute
     */
    public get minute(): number
    {
        return this.displayDate?.minute() ?? 0;
    }
    public set minute(value: number)
    {
        this.displayDate?.minute(value);
    }

    //######################### public methods - implementation of PickerBaseComponent #########################
    
    /**
     * @inheritdoc
     */
    public display(value: DateApiObject<TDate>): void
    {
        this.displayDate = value;
    }

    /**
     * @inheritdoc
     */
    public setMinValue(_value: TDate | null): void
    {
    }

    /**
     * @inheritdoc
     */
    public setMaxValue(_value: TDate | null): void
    {
    }

    /**
     * @inheritdoc
     */
    public setValue(_value: DateTimeValue<TDate> | null): void
    {
    }

    //######################### public methods - template bindings #########################

    /**
     * Sets hour
     * @param event - Mouse event that was triggered
     * @param value - Value to be set as hour
     * @returns 
     */
    public setHour<TData = any>(event: MouseEvent|null, value: TData): void
    {
        if(!this.hoursOpen && event)
        {
            return;
        }

        event?.stopPropagation();
        event?.preventDefault();

        if(this.hour == value as unknown as number)
        {
            return;
        }

        this.hour = value as unknown as number;
        
        if(event)
        {
            this.hoursOpen = false;
        }

        if(this.displayDate)
        {
            this._value =
            {
                from: this.displayDate?.value,
                to: this.displayDate?.value
            };

            this._valueChange.next();
        }
    }

    /**
     * Sets minute
     * @param event - Mouse event that was triggered
     * @param value - Value to be set as minute
     * @returns 
     */
    public setMinute<TData = any>(event: MouseEvent|null, value: TData): void
    {
        if(!this.minutesOpen && event)
        {
            return;
        }

        event?.stopPropagation();
        event?.preventDefault();

        if(this.minute == value as unknown as number)
        {
            return;
        }

        this.minute = value as unknown as number;
        
        if(event)
        {
            this.minutesOpen = false;
        }

        if(this.displayDate)
        {
            this._value =
            {
                from: this.displayDate?.value,
                to: this.displayDate?.value
            };

            this._valueChange.next();
        }
    }
}