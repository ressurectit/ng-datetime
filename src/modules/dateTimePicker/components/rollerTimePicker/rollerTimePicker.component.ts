import {Component, ChangeDetectionStrategy} from '@angular/core';
import {SlicePipe} from '@angular/common';
import {ClickOutsideSADirective} from '@anglr/common';

import {DatePipesModule} from '../../../datePipes.module';
import {hours, minutes} from './rollerTimePicker.data';
import {DateTimePicker, PeriodData} from '../../interfaces';
import {DateTimePeriodPickerBase} from '../dateTimePeriodPickerBase';
import {LoopScrollData, LoopScrollDataDirective, LoopScrollDirective} from '../../directives';

/**
 * Component used for rendering roller time picker
 */
@Component(
{
    selector: 'roller-time-picker',
    templateUrl: 'rollerTimePicker.component.html',
    host:
    {
        '[class.date-time-period]': 'true',
    },
    standalone: true,
    imports:
    [
        SlicePipe,
        DatePipesModule,
        ClickOutsideSADirective,
        LoopScrollDataDirective,
        LoopScrollDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RollerTimePickerComponent<TDate = unknown> extends DateTimePeriodPickerBase<PeriodData<TDate>, TDate>  implements DateTimePicker<TDate>
{
    //######################### protected properties - template bindings #########################

    /**
     * Array of available hours
     */
    protected hours: LoopScrollData[] = hours;

    /**
     * Array of available minutes
     */
    protected minutes: LoopScrollData[] = minutes;

    /**
     * Indication whether are minutes open
     */
    protected minutesOpen: boolean = false;

    /**
     * Indication whether are hours open
     */
    protected hoursOpen: boolean = false;

    /**
     * Current value of hour
     */
    protected get hour(): number
    {
        return this.singleValue?.hour() ?? 0;
    }
    protected set hour(value: number)
    {
        //no value selected yet
        if(!this.singleValue?.isValid())
        {
            this.singleValue = this.displayDate?.clone() ?? this.dateApi.getValue(new Date());
        }

        this.singleValue?.hour(value);
    }

    /**
     * Current value of minute
     */
    protected get minute(): number
    {
        return this.singleValue?.minute() ?? 0;
    }
    protected set minute(value: number)
    {
        //no value selected yet
        if(!this.singleValue?.isValid())
        {
            this.singleValue = this.displayDate?.clone() ?? this.dateApi.getValue(new Date());
        }

        this.singleValue?.minute(value);
    }

    //######################### protected methods - template bindings #########################

    /**
     * Sets hour
     * @param event - Mouse event that was triggered
     * @param value - Value to be set as hour
     * @returns 
     */
    protected setHour<TData = unknown>(event: MouseEvent|null, value: TData): void
    {
        if(!this.hoursOpen && event)
        {
            return;
        }

        if(this.hour == value as unknown as number)
        {
            this.hoursOpen = false;

            return;
        }

        this.hour = value as unknown as number;
        
        if(event)
        {
            this.hoursOpen = false;
        }

        this.singleValue?.updateOriginal();
        this.valueChangeSubject.next();
    }

    /**
     * Sets minute
     * @param event - Mouse event that was triggered
     * @param value - Value to be set as minute
     * @returns 
     */
    protected setMinute<TData = unknown>(event: MouseEvent|null, value: TData): void
    {
        if(!this.minutesOpen && event)
        {
            return;
        }

        if(this.minute == value as unknown as number)
        {
            return;
        }

        this.minute = value as unknown as number;
        
        if(event)
        {
            this.minutesOpen = false;
        }

        this.singleValue?.updateOriginal();
        this.valueChangeSubject.next();
    }

    //######################### protected methods - overrides #########################

    /**
     * @inheritdoc
     */
    protected onRender(): void
    {
    }

    /**
     * Tests whether provided value is in same period target value
     */
    protected isSamePeriod(): boolean
    {
        return false;
    }
}