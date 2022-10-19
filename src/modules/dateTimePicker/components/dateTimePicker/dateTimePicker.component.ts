import {Component, ChangeDetectionStrategy, ViewChild, ViewContainerRef, Type, EventEmitter, Output, Input, OnChanges, SimpleChanges, Inject, Optional, OnDestroy, ComponentRef} from '@angular/core';
import {Position, POSITION} from '@anglr/common';
import {extend, isBlank, nameof} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {DateTimeInputValue, FormatProvider} from '../../../../interfaces';
import {DateTimeInputOutputValue} from '../../../../misc/types';
import {DATE_TIME_PICKER_OPTIONS} from '../../misc/tokens';
import {DayPickerSAComponent} from '../dayPicker/dayPicker.component';
import {DateTimePickerOptions} from './dateTimePicker.interface';
import {DateTimePicker} from '../../interfaces';
import {DateApi} from '../../../../services';
import {DATE_API, FORMAT_PROVIDER} from '../../../../misc/tokens';
import {formatDateTime, parseDateTime} from '../../../../misc/utils';
import {DateTimeValueFormat} from '../../../../misc/enums';
import {DateTimeRestrictedBase} from '../../../dateTime/directives/dateTimeRestrictedBase';

/**
 * Text to be displayed when configuration, options are corrupted
 */
const CORRUPTED_CONFIG_TEXT = 'DateTime: Corrupted configuration for DateTimePicker!';

/**
 * Default options for date time picker
 */
const defaultOptions: DateTimePickerOptions = 
{
    defaultPeriod: 'day',
    periodsDefinition:
    {
        'day': DayPickerSAComponent,
    },
};

/**
 * Component used for displaying date time picker
 */
@Component(
{
    selector: 'date-time-picker',
    templateUrl: 'dateTimePicker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerComponent<TDate = unknown> extends DateTimeRestrictedBase<TDate> implements DateTimeInputValue<TDate>, OnChanges, OnDestroy
{
    //######################### protected properties #########################
    
    /**
     * Subscription for changes in date time period picker
     */
    protected periodChangesSubscription: Subscription|undefined|null;

    /**
     * Options for date time picker
     */
    protected ɵOptions: DateTimePickerOptions<TDate>;

    /**
     * Currently displayed period type
     */
    protected displayedPeriodType: Type<DateTimePicker<TDate>>;

    /**
     * Name of period which is currently displayed
     */
    protected displayedPeriodName: string;

    /**
     * Instance of created date time period picker
     */
    protected component: ComponentRef<DateTimePicker<TDate>>|undefined|null;
    
    //######################### protected properties - children #########################

    /**
     * Container used for displaying pickers for specific date time part
     */
    @ViewChild('container', {read: ViewContainerRef, static: true})
    protected pickerContainer: ViewContainerRef|undefined|null;

    //######################### public properties - inputs #########################

    /**
     * @inheritdoc
     */
    @Input()
    public override get value(): DateTimeInputOutputValue<TDate>|undefined|null
    {
        return this.ɵValue;
    }
    public override set value(value: DateTimeInputOutputValue<TDate>|undefined|null)
    {
        this.ɵValue = value;
    }

    /**
     * Options for date time picker
     */
    @Input()
    public get options(): Partial<DateTimePickerOptions<TDate>>
    {
        return this.ɵOptions;
    }
    public set options(value: Partial<DateTimePickerOptions<TDate>>)
    {
        this.ɵOptions = extend(true, {}, defaultOptions, value);

        if(value?.periodsDefinition)
        {
            this.ɵOptions.periodsDefinition = value.periodsDefinition;
        }
    }

    //######################### public properties - outputs #########################

    /**
     * @inheritdoc
     */
    @Output()
    public override valueChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### constructor #########################
    constructor(@Inject(POSITION) protected position: Position,
                @Inject(DATE_API) dateApi: DateApi<TDate>,
                @Inject(FORMAT_PROVIDER) formatProvider: FormatProvider,
                @Inject(DATE_TIME_PICKER_OPTIONS) @Optional() options?: DateTimePickerOptions<TDate>,)
    {
        super(dateApi, formatProvider);

        this.ɵOptions = extend(true, {}, defaultOptions, options);
        
        if(options?.periodsDefinition)
        {
            this.ɵOptions.periodsDefinition = options.periodsDefinition;
        }

        this.displayedPeriodName = this.ɵOptions.defaultPeriod;
        this.displayedPeriodType = this.ɵOptions.periodsDefinition[this.displayedPeriodName];

        if(!this.displayedPeriodType)
        {
            throw new Error(CORRUPTED_CONFIG_TEXT);
        }
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(nameof<DateTimePickerComponent>('value') in changes)
        {
            //empty value show now
            if(isBlank(this.value))
            {
                const now = this.dateApi.now();

                this.showPicker(this.displayedPeriodType, now.value);

                return;
            }

        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public override ngOnDestroy(): void
    {
        super.ngOnDestroy();

        this.component?.destroy();
        this.component = null;

        this.periodChangesSubscription?.unsubscribe();
        this.periodChangesSubscription = null;
    }

    //######################### protected methods #########################

    /**
     * Shows picker
     * @param type - Type of period that should be displayed
     * @param displayDate - Display date to be shown
     */
    protected showPicker(type: Type<DateTimePicker<TDate>>, displayDate: TDate): void
    {
        if(!this.pickerContainer)
        {
            return;
        }

        //create new component and destroy previous one
        if(!this.component || (this.component && type != this.displayedPeriodType))
        {
            this.periodChangesSubscription?.unsubscribe();
            this.periodChangesSubscription = new Subscription();
            this.component?.destroy();
            this.component = this.pickerContainer.createComponent(type);

            this.periodChangesSubscription.add(this.component.instance.valueChange.subscribe(() =>
            {
                const component = this.component?.instance;

                if(!component)
                {
                    return;
                }

                this.value = formatDateTime(component.value, DateTimeValueFormat.DateInstance, null);
                this.valueChange.emit();
            }));

            this.periodChangesSubscription.add(this.component.instance.scaleUp.subscribe(date => this.showPicker(this.getUpperType(), date)));
            this.periodChangesSubscription.add(this.component.instance.scaleDown.subscribe(date => this.showPicker(this.getLowerType(), date)));
        }

        const component = this.component.instance;

        component.canScaleDown = false,
        component.canScaleUp = false;
        component.display = displayDate;
        // component.options
        //TODO: maybe add support for format!
        component.value = parseDateTime(this.value, this.dateApi, null, null);
    }

    /**
     * Gets type that is above current period picker
     */
    protected getUpperType(): Type<DateTimePicker<TDate>>
    {
        const periods = Object.keys(this.ɵOptions.periodsDefinition);
        const index = periods.indexOf(this.displayedPeriodName);

        if(index < 0)
        {
            throw new Error(CORRUPTED_CONFIG_TEXT);
        }

        if(index >= periods.length)
        {
            return this.displayedPeriodType;
        }

        this.displayedPeriodName = periods[index + 1];
        this.displayedPeriodType = this.ɵOptions.periodsDefinition[this.displayedPeriodName];

        return this.displayedPeriodType;
    }

    /**
     * Gets type that is below current period picker
     */
    protected getLowerType(): Type<DateTimePicker<TDate>>
    {
        const periods = Object.keys(this.ɵOptions.periodsDefinition);
        const index = periods.indexOf(this.displayedPeriodName);

        if(index < 0)
        {
            throw new Error(CORRUPTED_CONFIG_TEXT);
        }

        if(index <= 0)
        {
            return this.displayedPeriodType;
        }

        this.displayedPeriodName = periods[index - 1];
        this.displayedPeriodType = this.ɵOptions.periodsDefinition[this.displayedPeriodName];

        return this.displayedPeriodType;
    }
}