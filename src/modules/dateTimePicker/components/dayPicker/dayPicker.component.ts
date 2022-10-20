import {Component, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DateTimePicker} from '../../interfaces';
import {DateTimePeriodPickerBase} from '../dateTimePeriodPickerBase';
import {DatePipesModule} from '../../../datePipes.module';
import {DayData} from '../../../../legacy/picker/interfaces';
import {DateApiObject} from '../../../../services';

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
    imports:
    [
        CommonModule,
        DatePipesModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayPickerSAComponent<TDate = unknown> extends DateTimePeriodPickerBase<DayData<TDate>, TDate> implements DateTimePicker<TDate>
{
    //######################### protected properties #########################

    /**
     * Stored this picker month data
     */
    protected thisMonthData: DayData<TDate>[] = [];

    /**
     * Currently displayed month
     */
    protected displayedMonth: TDate|undefined|null;

    //######################### protected properties - template bindings #########################

    /**
     * Names of days
     */
    protected weekdays: string[] = [];

    //######################### constructor #########################
    constructor()
    {
        super();

        this.weekdays = this.dateApi.weekdaysShort();
    }

    //######################### protected methods - template bindings #########################

    /**
     * 
     * @param dayData - Day data that were selected
     */
    protected selectDay(dayData: DayData): void
    {
        if(dayData.disabled)
        {
            return;
        }

        if(!this.value)
        {
            this.value = this.displayDate?.clone() ?? this.dateApi.getValue(this.display ?? new Date());
        }

        //single value
        if(!Array.isArray(this.value))
        {
            this.value.dayOfMonth(dayData.day);

            //other month was selected
            if(dayData.otherMonth)
            {
                this.value.month(dayData.dateObj.month());
                this.displayDate?.month(dayData.dateObj.month());
            }

            this.value.updateOriginal();

            this.valueChangeSubject.next();
        }
        else
        {
            //TODO: range
        }

        this.render();
        this.changeDetector.detectChanges();
    }

    /**
     * Changes displayed month to next month
     */
    protected nextMonth(): void
    {
        this.displayDate?.addMonths(1).updateOriginal();

        this.render();
    }

    /**
     * Changes displayed month to previous month
     */
    protected previousMonth(): void
    {
        this.displayDate?.subtractMonths(1).updateOriginal();

        this.render();
    }

    //######################### protected methods #########################

    /**
     * Renders current day picker data
     */
    protected render(): void
    {
        //same month only data change
        if(this.displayedMonth && this.displayDate?.isSameMonth(this.displayedMonth))
        {
            this.setActive();
            this.updateMinMax();

            return;
        }

        this.periodData = [];
        this.thisMonthData = [];

        if(!this.displayDate)
        {
            return;
        }

        const currentMonthDate = this.displayDate.value;
        const today = this.dateApi.now().value;

        this.displayDate
            .startOfMonth()
            .updateOriginal()
            .startOfWeek();

        do
        {
            for(let x = 0; x < 7; x++)
            {
                const day = this.displayDate.dayOfMonth();
                const otherMonth = !this.displayDate.isSameMonth(currentMonthDate);

                const data: DayData<TDate> = 
                {
                    active: false,
                    disabled: false,
                    date: this.displayDate.value,
                    otherMonth: otherMonth,
                    today: this.displayDate.isSameDay(today),
                    weekend: this.displayDate.isWeekend(),
                    day: day,
                    dateObj: this.displayDate.clone(),
                };

                this.periodData.push(data);

                if(!otherMonth)
                {
                    this.thisMonthData.push(data);
                }

                this.displayDate.addDays(1);
            }
        }
        while(this.displayDate.isSameMonth(currentMonthDate));

        this.displayDate.resetOriginal();

        this.setActive();
        this.updateMinMax();
    }

    /**
     * Sets active date
     */
    protected setActive(): void
    {
        this.periodData.forEach(itm => itm.active = false);

        if(!this.value)
        {
            return;
        }

        
        if(!Array.isArray(this.value))
        {
            if(this.value)
            {
                const value = this.value;
                const day = this.periodData.find(itm => itm.dateObj.isSameDay(value.value));

                if(day)
                {
                    day.active = true;
                }
            }
        }
        else
        {
            //TODO: support range
        }
    }

    //######################### protected methods - overrides #########################

    /**
     * @inheritdoc
     */
    protected onRender(): void
    {
        this.render();
    }

    /**
     * Tests whether provided value is in same period target value
     * @param val - Tested value
     * @param target - Target value to be tested against
     */
    protected isSamePeriod(val: DateApiObject<TDate>, target: TDate): boolean
    {
        return val.isSameDay(target);
    }
}