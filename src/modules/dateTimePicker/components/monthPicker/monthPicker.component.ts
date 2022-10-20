import {Component, ChangeDetectionStrategy, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DateTimePicker} from '../../interfaces';
import {DateTimePeriodPickerBase} from '../dateTimePeriodPickerBase';
import {DatePipesModule} from '../../../datePipes.module';
import {MonthData} from '../../../../legacy/picker/interfaces';
import {DateApiObject} from '../../../../services';
import {FORMAT_PROVIDER} from '../../../../misc/tokens';
import {FormatProvider} from '../../../../interfaces';

/**
 * Component used for displaying month picker
 */
@Component(
{
    selector: 'month-picker',
    templateUrl: 'monthPicker.component.html',
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
export class MonthPickerSAComponent<TDate = unknown> extends DateTimePeriodPickerBase<MonthData<TDate>, TDate> implements DateTimePicker<TDate>
{
    //######################### constructor #########################
    constructor(@Inject(FORMAT_PROVIDER) protected formatProvider: FormatProvider,)
    {
        super();
    }

    //######################### protected methods - template bindings #########################

    /**
     * Selects month as value of day time picker
     * @param monthData - Month data that were selected
     */
    protected selectMonth(monthData: MonthData<TDate>): void
    {
        if(monthData.disabled)
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
            this.value.year(monthData.dateObj.year());
            this.value.month(monthData.dateObj.month());
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
     * Changes displayed year to next year
     */
    protected nextYear(): void
    {
        this.displayDate?.addYears(1).updateOriginal();

        this.render();
    }

    /**
     * Changes displayed year to previous year
     */
    protected previousYear(): void
    {
        this.displayDate?.subtractYears(1).updateOriginal();

        this.render();
    }

    //######################### protected methods #########################

    /**
     * Renders current day picker data
     */
    protected render(): void
    {
        //same year only data change
        if(this.displayedDate && this.displayDate?.isSameYear(this.displayedDate))
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

        const monthOfYear = this.displayDate.startOfYear().updateOriginal();

        for(let x = 0; x < 12; x++)
        {
            this.periodData.push(
            {
                active: false,
                disabled: false,
                date: monthOfYear.value,
                name: monthOfYear.format(this.dateApi.getFormat(this.formatProvider.monthNameShort)),
                dateObj: monthOfYear.clone(),
            });

            monthOfYear.addMonths(1);
        }

        this.displayDate.resetOriginal();
        
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
        return val.isSameMonth(target);
    }
}