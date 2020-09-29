import {Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef} from '@angular/core';

import {DateTimeValue} from '../../../misc/datetime.interface';
import {DATE_API} from '../../../misc/tokens';
import {DateApi, DateApiObject} from '../../../services/dateApi.interface';
import {DateTimePicker, DayData} from '../../misc/datetimePicker.interface';
import {PickerBaseComponent} from '../pickerBase.component';

/**
 * Component used for displaying day picker
 */
@Component(
{
    selector: 'date-time-day-picker',
    templateUrl: 'dayPicker.component.html',
    styleUrls: ['dayPicker.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeDayPickerComponent<TDate = any> extends PickerBaseComponent<TDate, DayData<TDate>> implements DateTimePicker<TDate>
{
    //######################### protected fields #########################

    /**
     * Stored this picker month data
     */
    protected _thisMonthData: DayData<TDate>[] = [];

    //######################### public properties - template bindings #########################

    /**
     * Names of days
     * @internal
     */
    public weekdays: string[] = [];

    //######################### constructor #########################
    constructor(@Inject(DATE_API) dateApi: DateApi<TDate>,
                changeDetector: ChangeDetectorRef)
    {
        super(dateApi, changeDetector);

        this.weekdays = this._dateApi.weekdaysShort();
    }

    //######################### public methods - template bindings #########################

    /**
     * Changes displayed month to next month
     * @param event - Event that occured
     * @internal
     */
    public nextMonth(event: Event)
    {
        event.preventDefault();
        this.displayDateApi!.addMonths(1);

        this.display(this.displayDateApi!);
    }

    /**
     * Changes displayed month to previous month
     * @param event - Event that occured
     * @internal
     */
    public previousMonth(event: Event)
    {
        event.preventDefault();
        this.displayDateApi!.subtractMonths(1);

        this.display(this.displayDateApi!);
    }

    /**
     * Selects day
     * @param event - Event that occured
     * @param day - Selects day 
     * @internal
     */
    public select(event: Event, day: DayData<TDate>)
    {
        event.preventDefault();

        this._setDay(day);

        this._value =
        {
            from: day.date,
            to: day.date
        };
        
        this._valueChange.next();

        if(day.otherMonth)
        {
            this.display(this._dateApi.getValue(day.date));
        }
    }

    //######################### public methods - implementation of DateTimePicker #########################

    /**
     * Sets value of datetime picker
     * @param value - Value to be set to this picker
     */
    public setValue(value: DateTimeValue<TDate>|null): void
    {
        this._value = value;

        //value is present
        if(this._value && this.displayDateApi)
        {
            let val = this._dateApi.getValue(this._value.from);

            if(!val.isSameMonth(this.displayDateApi.value))
            {
                this.display(val);

                return;
            }

            let day = this._thisMonthData[val.dayOfMonth() - 1];

            //was initialized
            if(day)
            {
                this._setDay(day);
            }
        }
    }

    /**
     * Set displays date to be displayed
     * @param value - Value that identifies period that is going to be displayed
     */
    public display(value: DateApiObject<TDate>): void
    {
        this._display = value;
        this.displayDateApi = value;
        this.periodData = [];
        this._thisMonthData = [];
        let currentMonthDate = this.displayDateApi.value;
        let today = this._dateApi.now().value;

        this.displayDateApi
            .startOfMonth()
            .updateOriginal()
            .startOfWeek();

        do
        {
            for(let x = 0; x < 7; x++)
            {
                let day = this.displayDateApi.dayOfMonth();
                let otherMonth = !this.displayDateApi.isSameMonth(currentMonthDate);
                let data = 
                {
                    active: false,
                    betweenActive: false,
                    date: this.displayDateApi.value,
                    otherMonth: otherMonth,
                    today: this.displayDateApi.isSameDay(today),
                    weekend: this.displayDateApi.isWeekend(),
                    day: day
                };

                this.periodData.push(data);

                if(!otherMonth)
                {
                    this._thisMonthData.push(data);
                }

                this.displayDateApi.addDays(1);
            }
        }
        while(this.displayDateApi.isSameMonth(currentMonthDate))

        this.displayDateApi.resetOriginal();

        //set value if exists
        if(this._value && (this.displayDateApi.isSameMonth(this._value.from) || this.displayDateApi.isSameMonth(this._value.to)))
        {
            this.setValue(this._value);
        }
    }

    //######################### protected methods #########################

    /**
     * Sets day as active
     * @param day - Day to be set as active
     */
    protected _setDay(day: DayData<TDate>)
    {
        this._thisMonthData.forEach(itm => itm.active = false);

        day.active = true;
    }
}