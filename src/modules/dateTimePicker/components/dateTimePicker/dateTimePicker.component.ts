import {Component, ChangeDetectionStrategy, ViewChild, ViewContainerRef, Type, EventEmitter, Output, Input, OnChanges, SimpleChanges, Inject, Optional, OnDestroy, ComponentRef, OnInit} from '@angular/core';
import {Position, POSITION} from '@anglr/common';
import {extend, isBlank, nameof} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {DateTimeInputValue} from '../../../../interfaces';
import {DateTimeInputOutputValue, DateTimeObjectValue} from '../../../../misc/types';
import {DATE_TIME_PICKER_OPTIONS} from '../../misc/tokens';
import {DayPickerComponent} from '../dayPicker/dayPicker.component';
import {MonthPickerComponent} from '../monthPicker/monthPicker.component';
import {DateTimePickerOptions} from './dateTimePicker.interface';
import {YearPickerComponent} from '../yearPicker/yearPicker.component';
import {DateTimePicker} from '../../interfaces';
import {formatDateTime, getInternalValue} from '../../../../misc/utils';
import {DateTimeDirective} from '../../../dateTime/directives';
import {DateValueProvider} from '../../../../services';
import {DateTimeValueFormat} from '../../../../misc/enums';

//TODO: use mixin for set internal

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
        'day': DayPickerComponent,
        'month': MonthPickerComponent,
        'year': YearPickerComponent,
    },
};

/**
 * Component used for displaying date time picker
 */
@Component(
{
    selector: 'date-time-picker',
    templateUrl: 'dateTimePicker.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerComponent<TDate = unknown> extends DateTimeDirective<TDate> implements DateTimeInputValue<TDate>, OnInit, OnChanges, OnDestroy
{
    //######################### protected properties #########################

    /**
     * Current value of date time, could be string, timestamp, Date, TDate object, or ranged DateTimeValue
     */
    protected ɵValue: DateTimeInputOutputValue<TDate>|undefined|null;

    /**
     * Internal representation of current date time value
     */
    protected internalValue: DateTimeObjectValue<TDate>|undefined|null;
    
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
    protected displayedPeriodType!: Type<DateTimePicker<TDate>>;

    /**
     * Name of period which is currently displayed
     */
    protected displayedPeriodName!: string;

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
    public get value(): DateTimeInputOutputValue<TDate>|undefined|null
    {
        return this.ɵValue;
    }
    public set value(value: DateTimeInputOutputValue<TDate>|undefined|null)
    {
        //accepts all available formats
        this.setInternalValue(value);
        this.ɵValue = formatDateTime(this.internalValue, this.valueFormat, this.customFormat, this.dataFormat);
        this.valueSet.next();
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

        this.setOptions(value);
    }

    //######################### public properties - outputs #########################

    /**
     * @inheritdoc
     */
    @Output()
    public valueChange: EventEmitter<void> = new EventEmitter<void>();

    /**
     * @inheritdoc
     */
    @Output()
    public valueSet: EventEmitter<void> = new EventEmitter<void>();

    //######################### constructor #########################
    constructor(@Inject(POSITION) protected position: Position,
                protected valueProvider: DateValueProvider<TDate>,
                @Inject(DATE_TIME_PICKER_OPTIONS) @Optional() options?: Partial<DateTimePickerOptions<TDate>>,)
    {
        super();

        this.ɵOptions = extend(true, {}, defaultOptions, options);
        
        this.setOptions(options);

        if(!this.displayedPeriodType)
        {
            throw new Error(CORRUPTED_CONFIG_TEXT);
        }
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        //empty value show now
        if(isBlank(this.value))
        {
            const now = this.dateApi.now();

            this.showPicker(this.displayedPeriodType, now.value);
        }
        else
        {
            const val = (Array.isArray(this.internalValue) ? this.internalValue[0] : this.internalValue) ?? this.dateApi.now();

            this.showPicker(this.displayedPeriodType, val.isValid() ? val.value : this.dateApi.now().value);
        }
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(!this.component)
        {
            return;
        }

        const component = this.component.instance;
        let invalidate: boolean = false;

        if(nameof<DateTimePickerComponent>('maxDateTime') in changes)
        {
            component.maxDate = this.maxDateTime;
            invalidate = true;
        }

        if(nameof<DateTimePickerComponent>('minDateTime') in changes)
        {
            component.minDate = this.minDateTime;
            invalidate = true;
        }

        if(nameof<DateTimePickerComponent>('value') in changes)
        {
            const val = (Array.isArray(this.internalValue) ? this.internalValue[0] : this.internalValue) ?? this.dateApi.now();

            component.display = val.isValid() ? val.value : this.dateApi.now().value;
            component.value = this.internalValue;
            invalidate = true;
        }

        if(this.component && invalidate)
        {
            this.component.instance.invalidateVisuals();
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
     * Sets internal value and fix lowest time difference
     * @param value - Value to be set
     */
    protected setInternalValue(value: DateTimeInputOutputValue<TDate>|undefined|null): void
    {
        this.internalValue = getInternalValue(value, this.dateApi, this, this.valueProvider);
    }

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
            this.displayedPeriodType = type;
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

                if(!Array.isArray(component.value))
                {
                    this.setInternalValue(component.value?.value);
                }
                else
                {
                    //TODO: handle ranges
                }

                this.value = formatDateTime(this.internalValue, this.valueFormat, this.customFormat, this.dataFormat);
                this.valueChange.emit();
            }));

            this.periodChangesSubscription.add(this.component.instance.scaleUp.subscribe(date => this.showPicker(this.getUpperType(), date)));
            this.periodChangesSubscription.add(this.component.instance.scaleDown.subscribe(date => this.showPicker(this.getLowerType(), date)));
        }

        const component = this.component.instance;

        component.ranged = this.valueFormat === DateTimeValueFormat.RangeOfDateInstances;
        component.canScaleDown = this.canScaleDown(),
        component.canScaleUp = this.canScaleUp();
        component.display = displayDate;
        component.maxDate = this.maxDateTime;
        component.minDate = this.minDateTime;
        component.value = this.internalValue;
        component.invalidateVisuals();
    }

    /**
     * Gets indication whether current period can be scaled down
     * @param periods - Array of defined period names
     * @param index - Index of displayed period
     */
    protected canScaleDown(periods?: string[], index?: number): boolean
    {
        periods ??= Object.keys(this.ɵOptions.periodsDefinition);
        index ??= periods.indexOf(this.displayedPeriodName);

        if(index < 0)
        {
            throw new Error(CORRUPTED_CONFIG_TEXT);
        }

        if(index <= 0)
        {
            return false;
        }

        return true;
    }

    /**
     * Gets indication whether current period can be scaled up
     * @param periods - Array of defined period names
     * @param index - Index of displayed period
     */
    protected canScaleUp(periods?: string[], index?: number): boolean
    {
        periods ??= Object.keys(this.ɵOptions.periodsDefinition);
        index ??= periods.indexOf(this.displayedPeriodName);

        if(index < 0)
        {
            throw new Error(CORRUPTED_CONFIG_TEXT);
        }

        if(index + 1 >= periods.length)
        {
            return false;
        }

        return true;
    }

    /**
     * Gets type that is above current period picker
     */
    protected getUpperType(): Type<DateTimePicker<TDate>>
    {
        const periods = Object.keys(this.ɵOptions.periodsDefinition);
        const index = periods.indexOf(this.displayedPeriodName);

        if(!this.canScaleUp(periods, index))
        {
            return this.displayedPeriodType;
        }

        this.displayedPeriodName = periods[index + 1];

        return this.ɵOptions.periodsDefinition[this.displayedPeriodName];
    }

    /**
     * Gets type that is below current period picker
     */
    protected getLowerType(): Type<DateTimePicker<TDate>>
    {
        const periods = Object.keys(this.ɵOptions.periodsDefinition);
        const index = periods.indexOf(this.displayedPeriodName);

        if(!this.canScaleDown(periods, index))
        {
            return this.displayedPeriodType;
        }

        this.displayedPeriodName = periods[index - 1];

        return this.ɵOptions.periodsDefinition[this.displayedPeriodName];
    }

    /**
     * Sets options and use them to set parameters of component
     * @param options - Options to be set
     */
    protected setOptions(options: Partial<DateTimePickerOptions<TDate>> | undefined): void
    {
        if(options?.periodsDefinition)
        {
            this.ɵOptions.periodsDefinition = options.periodsDefinition;
        }

        this.displayedPeriodName = this.ɵOptions.defaultPeriod;
        this.displayedPeriodType = this.ɵOptions.periodsDefinition[this.displayedPeriodName];
    }
}