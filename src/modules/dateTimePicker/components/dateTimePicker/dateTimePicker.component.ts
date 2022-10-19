import {Component, ChangeDetectionStrategy, ViewChild, ViewContainerRef, Type, EventEmitter, Output, Input, OnChanges, SimpleChanges} from '@angular/core';

import {DateTimeInputValue} from '../../../../interfaces';
import {DateTimeInputOutputValue} from '../../../../misc/types';

/**
 * Component used for displaying date time picker
 */
@Component(
{
    selector: 'date-time-picker',
    templateUrl: 'dateTimePicker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimePickerComponent<TDate = unknown> implements DateTimeInputValue<TDate>, OnChanges
{
    //######################### protected properties #########################

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
    public value: DateTimeInputOutputValue<TDate>|undefined|null;

    //######################### public properties - outputs #########################

    /**
     * @inheritdoc
     */
    @Output()
    public valueChange: EventEmitter<void> = new EventEmitter<void>();

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        console.log(changes);
    }

    //######################### protected methods #########################

    protected showPicker(type: Type<unknown>, displayDate: TDate): void
    {
        
    }
}