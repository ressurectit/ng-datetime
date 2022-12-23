import {Directive, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {BindThis} from '@jscrpt/common';

import {DateTimeInput} from '../../interfaces';
import {DATE_TIME_INPUT, DATE_API} from '../../misc/tokens';
import {parseDateTime} from '../../misc/utils';
import {DateTimePickerSADirective, DateTimeSADirective} from '../../modules';
import {DateApi, DateApiObject} from '../../services';

/**
 * Directive that adds simple handler for date time input, which allows simple navigation using keyboard
 */
@Directive(
{
    selector: '[dateTime][withSimpleHandler]',
    standalone: true,
})
export class SimpleDateTimeInputHandlerSADirective<TDate = unknown> implements OnInit, OnDestroy
{
    //######################### constructor #########################
    constructor(@Inject(DATE_TIME_INPUT) protected input: DateTimeInput<TDate>,
                @Inject(DATE_API) protected dateApi: DateApi<TDate>,
                protected dateTimeData: DateTimeSADirective<TDate>,
                @Optional() protected picker?: DateTimePickerSADirective<TDate>,)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        this.input.element.addEventListener('keydown', this.handleKeyboard);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this.input.element.removeEventListener('keydown', this.handleKeyboard);
    }

    //######################### protected methods #########################

    /**
     * Handles keyboard events
     * @param event - Keyboard event that occured
     */
    @BindThis
    public handleKeyboard(event: KeyboardEvent): void
    {
        const parsedValue = parseDateTime(this.input.value, this.dateApi, null, this.dateTimeData.customFormat);
        
        //no value do nothing
        if(!parsedValue)
        {
            return;
        }

        //range value
        if(Array.isArray(parsedValue))
        {
            //TODO: finish range support
        }
        else
        {
            //do nothing for invalid date time
            if(!parsedValue.isValid())
            {
                return;
            }

            switch(event.key)
            {
                case 'ArrowRight':
                case 'ArrowLeft':
                {
                    event.preventDefault();
                    event.stopPropagation();

                    this.withMinMaxConstraint(parsedValue, () => event.key == 'ArrowLeft' ? parsedValue.subtractDays(1) : parsedValue.addDays(1));

                    break;
                }
                case 'ArrowUp':
                case 'ArrowDown':
                {
                    event.preventDefault();
                    event.stopPropagation();

                    this.withMinMaxConstraint(parsedValue, () => event.key == 'ArrowUp' ? parsedValue.subtractWeeks(1) : parsedValue.addWeeks(1));

                    break;
                }
                case 'Escape':
                {
                    this.picker?.hidePicker();

                    break;
                }
                case ' ':
                {
                    if(event.ctrlKey)
                    {
                        this.picker?.showPicker();
                    }

                    break;
                }
            }
        }
    }

    /**
     * Tests whether are min or max constraint broken, returns true if constraint is broken
     * @param value - Value to be tested
     */
    protected minMaxConstraintTest(value: DateApiObject<TDate>): boolean
    {
        return (!!this.dateTimeData.minDateTime && value.isBefore(this.dateTimeData.minDateTime)) ||
               (!!this.dateTimeData.maxDateTime && value.isAfter(this.dateTimeData.maxDateTime));
    }

    /**
     * Runs code with check whether min max constrains was broken
     * @param value - Value to be used checked for constrains
     * @param code - Code that should be executed which can change current value
     */
    protected withMinMaxConstraint(value: DateApiObject<TDate>, code: () => void): void
    {
        value.updateOriginal();

        code();

        //min value constraint failure
        if(this.minMaxConstraintTest(value))
        {
            value.resetOriginal();
        }

        //value has changed, change input value
        if(!value.isSame(value.originalValue))
        {
            this.input.value = value.value;
            this.input.valueChange.next();
        }
    }
}
