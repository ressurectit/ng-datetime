import {Component, ChangeDetectionStrategy} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DateTimePicker} from '../../interfaces';
import {DateTimePeriodPickerBase} from '../dateTimePeriodPickerBase';
import {DatePipesModule} from '../../../datePipes.module';
import {YearData} from '../../../../legacy/picker/interfaces';
import {DateApiObject} from '../../../../services';

/**
 * Component used for displaying year picker
 */
@Component(
{
    selector: 'year-picker',
    templateUrl: 'yearPicker.component.html',
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
export class YearPickerSAComponent<TDate = unknown> extends DateTimePeriodPickerBase<YearData<TDate>, TDate> implements DateTimePicker<TDate>
{
    //######################### protected properties - template bindings #########################

    /**
     * Displayed decade period
     */
    protected period: string = '';

    //######################### protected methods - template bindings #########################

    /**
     * Selects year as value of day time picker
     * @param yearData - Year data that were selected
     */
    protected selectYear(yearData: YearData<TDate>): void
    {
        if(yearData.disabled)
        {
            return;
        }

        //no value selected yet
        if(!this.value)
        {
            this.value = this.displayDate?.clone() ?? this.dateApi.getValue(this.display ?? new Date());
        }

        //single value
        if(!Array.isArray(this.value))
        {
            this.value.year(yearData.dateObj.year());
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
     * Changes displayed decade to next decade
     */
    public nextDecade(): void
    {
        this.displayDate?.addYears(10).updateOriginal();

        this.render();
    }

    /**
     * Changes displayed decade to previous decade
     */
    public previousDecade(): void
    {
        this.displayDate?.subtractYears(10).updateOriginal();

        this.render();
    }

    //######################### protected methods #########################

    /**
     * Renders current day picker data
     */
    protected render(): void
    {
        //same decade only data change
        if(this.displayedDate && this.displayDate?.isSameDecade(this.displayedDate))
        {
            this.setActive();
            this.updateMinMax();

            return;
        }

        this.displayedDate = this.displayDate?.value;
        this.periodData = [];

        if(!this.displayDate)
        {
            return;
        }

        let year = this.displayDate.startOfYear().year();

        while(year % 10 !== 0)
        {
            year--;
        }

        this.displayDate.year(year).updateOriginal();

        for(let x = 0; x < 10; x++)
        {
            this.periodData.push(
            {
                active: false,
                disabled: false,
                date: this.displayDate.value,
                value: year,
                dateObj: this.displayDate.clone(),
            });

            year++;
            this.displayDate.addYears(1);
        }

        this.displayDate.resetOriginal();
        this.period = `${this.displayDate.year()} - ${this.displayDate.year() + 10}`;
        
        this.setActive();
        this.updateMinMax();
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
        return val.isSameYear(target);
    }
}