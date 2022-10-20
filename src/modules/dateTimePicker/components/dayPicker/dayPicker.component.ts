import {Component, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DateTimePicker} from '../../interfaces';
import {DateTimePeriodPickerBase} from '../dateTimePeriodPickerBase';
import {DatePipesModule} from '../../../datePipes.module';
import {DayData} from '../../../../legacy/picker/interfaces';

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
export class DayPickerSAComponent<TDate = unknown> extends DateTimePeriodPickerBase<TDate> implements DateTimePicker<TDate>
{
    //######################### protected fields #########################

    /**
     * Stored this picker month data
     */
    protected thisMonthData: DayData<TDate>[] = [];

    //######################### protected properties - template bindings #########################

    /**
     * Names of days
     */
    protected weekdays: string[] = [];

    /**
     * Array of period data to be displayed
     * @internal
     */
    public periodData: DayData<TDate>[] = [];

    //######################### constructor #########################
    constructor()
    {
        super();
    }

    //######################### protected methods - template bindings #########################

    protected selectDay(dayData: DayData): void
    {
        if(!this.value)
        {
            this.value = this.displayDate?.clone() ?? this.dateApi.getValue(this.display ?? new Date());
        }

        //single value
        if(!Array.isArray(this.value))
        {
            this.value.dayOfMonth(dayData.day);
            this.value.updateOriginal();

            this.valueChangeSubject.next();
        }
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

                const data = 
                {
                    active: false,
                    disabled: false,
                    date: this.displayDate.value,
                    otherMonth: otherMonth,
                    today: this.displayDate.isSameDay(today),
                    weekend: this.displayDate.isWeekend(),
                    day: day
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

        console.log(this.periodData, this.thisMonthData);

        this.displayDate.resetOriginal();

        // //can go down set minutes and hours
        // if(this.canGoDown)
        // {
        //     this.displayDate
        //         .minute(this._originalMinute)
        //         .hour(this._originalHour);
        // }

        // this._updateMinMax();

        // //set value if exists
        // if(this._value && (this.displayDate.isSameMonth(this._value.from!) || this.displayDate.isSameMonth(this._value.to!)))
        // {
        //     this.setValue(this._value);
        // }
    }

    //######################### protected methods - overrides #########################

    /**
     * @inheritdoc
     */
    protected override onRender(): void
    {
        this.render();
    }
}