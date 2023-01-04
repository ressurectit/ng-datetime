import {Directive, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {Action1, BindThis} from '@jscrpt/common';
import {Subscription} from 'rxjs';

import {DateTimeInput} from '../../interfaces';
import {DATE_API, DATE_TIME_INPUT} from '../../misc/tokens';
import {DateTimeObjectValue} from '../../misc/types';
import {parseDateTime, parseRawInput} from '../../misc/utils';
import {DateTimePickerSADirective, DateTimeSADirective} from '../../modules';
import {DateApi, DateApiObject, DatePositionParser, DatePositionParserService, DateValueProvider} from '../../services';

/**
 * Directive that adds handler for date time input, which allows navigation using keyboard and checking restriction of value
 */
@Directive(
{
    selector: '[dateTime][withHandler]',
    standalone: true,
})
export class DateTimeInputHandlerSADirective<TDate = unknown> implements OnInit, OnDestroy
{
    //######################### protected properties #########################

    /**
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

    /**
     * Instance of parser created for specific format
     */
    protected parser: DatePositionParser;

    /**
     * Gets input element as html input
     */
    protected get inputElement(): HTMLInputElement
    {
        if(this.input.element.nodeName == 'INPUT')
        {
            return this.input.element as HTMLInputElement;
        }

        throw new Error('You cant use DateTimeInputHandlerSADirective without input element!');
    }

    //######################### constructor #########################
    constructor(@Inject(DATE_TIME_INPUT) protected input: DateTimeInput<TDate>,
                @Inject(DATE_API) protected dateApi: DateApi<TDate>,
                protected dateTimeData: DateTimeSADirective<TDate>,
                protected parserSvc: DatePositionParserService,
                protected valueProvider: DateValueProvider<TDate>,
                @Optional() protected picker?: DateTimePickerSADirective<TDate>,)
    {
        this.parser = parserSvc.createParser(this.dateTimeData.customFormat);
        this.initSubscriptions.add(this.dateTimeData.customFormatChanges.subscribe(() => this.parser = parserSvc.createParser(this.dateTimeData.customFormat)));
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        this.input.element.addEventListener('keydown', this.handleKeyboard);
        this.input.element.addEventListener('keypress', this.handleKeypress);
        this.input.element.addEventListener('select', this.handleSelect);
        this.input.element.addEventListener('click', this.handleClick);
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this.initSubscriptions.unsubscribe();
        this.input.element.removeEventListener('keydown', this.handleKeyboard);
        this.input.element.removeEventListener('keypress', this.handleKeypress);
        this.input.element.removeEventListener('select', this.handleSelect);
        this.input.element.removeEventListener('click', this.handleClick);
    }

    //######################### protected methods #########################

    /**
     * Handles selection of text inside of input
     */
    @BindThis
    protected handleSelect(): void
    {
        this.runWithValue(() =>
                          {
                              //handles when all text is selected
                              if(this.inputElement.selectionStart == 0 && this.inputElement.selectionEnd == this.inputElement.value.length)
                              {
                                  const result = this.parser.parse(this.inputElement.value, this.inputElement.selectionStart);
  
                                  this.inputElement.selectionStart = result.positionFrom;
                                  this.inputElement.selectionEnd = result.positionTo;
                              }
                          },
                          () =>
                          {
                              //TODO: add support for ranges
                          });
    }

    /**
     * Handles click event inside of input
     */
    @BindThis
    protected handleClick(): void
    {
        this.runWithValue(() =>
                          {
                              const result = this.parser.parse(this.inputElement.value, this.inputElement.selectionStart ?? 0);
  
                              this.inputElement.selectionStart = result.positionFrom;
                              this.inputElement.selectionEnd = result.positionTo;
                          },
                          () =>
                          {
                              //TODO: add support for ranges
                          });
    }

    /**
     * Handles keyboard events
     * @param event - Keyboard event that occured
     */
    @BindThis
    protected handleKeypress(event: KeyboardEvent): void
    {
        const selectionStart = this.inputElement.selectionStart ?? 0;
        const selectionEnd = this.inputElement.selectionEnd ?? 0;
        const newRawValueArray = this.inputElement.value.split('');
        newRawValueArray.splice(selectionStart , selectionEnd - selectionStart);
        newRawValueArray.splice(selectionStart, 0, ...event.key);
        const newRawValue = newRawValueArray.join('');

        const [parsedValue] = parseRawInput(newRawValue, this.dateApi, this.dateTimeData, this.valueProvider);

        this.runWithValue(parsedValue =>
                          {
                              if(this.minMaxConstraintTest(parsedValue))
                              {
                                  event.preventDefault();
                                  event.stopPropagation();
                              }
                          },
                          () =>
                          {
                              //TODO: add support for ranges
                          },
                          parsedValue);
    }

    /**
     * Handles keyboard events
     * @param event - Keyboard event that occured
     */
    @BindThis
    protected handleKeyboard(event: KeyboardEvent): void
    {
        this.runWithValue(parsedValue =>
                          {
                              const selectionStart = this.inputElement.selectionStart ?? 0;

                              switch(event.key)
                              {
                                  case 'ArrowRight':
                                  case 'ArrowLeft':
                                  {
                                      event.preventDefault();
                                      event.stopPropagation();
                      
                                      const result = event.key == 'ArrowLeft' ? this.parser.previous(this.inputElement.value, selectionStart) : this.parser.next(this.inputElement.value, selectionStart);
                      
                                      if(result)
                                      {
                                          this.inputElement.selectionStart = result.positionFrom;
                                          this.inputElement.selectionEnd = result.positionTo;
                                      }
                      
                                      break;
                                  }
                                  case 'ArrowUp':
                                  case 'ArrowDown':
                                  {
                                      event.preventDefault();
                                      event.stopPropagation();
                      
                                      let result = this.parser.parse(this.inputElement.value, selectionStart);
                                      const selectionStartNew = result.positionFrom;
                      
                                      this.stepChangeValue(parsedValue, result.part, event.key == 'ArrowUp');
                      
                                      result = this.parser.parse(this.inputElement.value, selectionStartNew);
                      
                                      this.inputElement.selectionStart = result.positionFrom;
                                      this.inputElement.selectionEnd = result.positionTo;
                      
                                      break;
                                  }
                                  case 'Tab':
                                  {
                                      const result = event.shiftKey ? this.parser.previous(this.inputElement.value, selectionStart) : this.parser.next(this.inputElement.value, selectionStart);
                      
                                      if(result)
                                      {
                                          event.preventDefault();
                                          event.stopPropagation();
                      
                                          this.inputElement.selectionStart = result.positionFrom;
                                          this.inputElement.selectionEnd = result.positionTo;
                                      }
                      
                                      break;
                                  }
                                  case 'a':
                                  {
                                      if(event.ctrlKey)
                                      {
                                          event.preventDefault();
                                          event.stopPropagation();
                                      }
                      
                                      break;
                                  }
                                  case 'Backspace':
                                  {
                                      this.input.value = null;
                                      this.input.valueChange.next();
                      
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
                          },
                          () =>
                          {
                              //TODO: add support for ranges
                          });
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

    /**
     * Runs code for existing and valid value of date time
     * @param singleValueCode - Code to be run when only single value can be inside of date time
     * @param rangeValueCode - Code to be run when range value can be inside of date time
     * @param parsedValueDefault - Default parsed value to be used
     */
    protected runWithValue(singleValueCode: Action1<DateApiObject<TDate>>, rangeValueCode: Action1<[DateApiObject<TDate> | null, DateApiObject<TDate> | null]>, parsedValueDefault?: DateTimeObjectValue<TDate>|undefined|null): void
    {
        const parsedValue = parsedValueDefault ?? parseDateTime(this.input.value, this.dateApi, null, this.dateTimeData.customFormat);

        if(!parsedValue)
        {
            return;
        }

        if(Array.isArray(parsedValue))
        {
            rangeValueCode(parsedValue);
        }
        else
        {
            //do nothing for invalid value
            if(!parsedValue.isValid())
            {
                return;
            }

            singleValueCode(parsedValue);
        }
    }

    /**
     * Changes current value of date for for specified part by single step
     * @param value - Value to be used checked for constrains
     * @param part - Part of date that should be changed
     * @param increment - Indication whether value should be incremented or decremented
     */
    protected stepChangeValue(value: DateApiObject<TDate>, part: string, increment: boolean): void
    {
        switch(part)
        {
            case 'y':
            case 'Y':
            {
                this.withMinMaxConstraint(value, () => increment ? value.addYears(1) : value.subtractYears(1));

                break;
            }
            case 'Q':
            {
                break;
            }
            case 'M':
            {
                this.withMinMaxConstraint(value, () => increment ? value.addMonths(1) : value.subtractMonths(1));

                break;
            }
            case 'w':
            {
                this.withMinMaxConstraint(value, () => increment ? value.addWeeks(1) : value.subtractWeeks(1));

                break;
            }
            case 'd':
            case 'D':
            {
                this.withMinMaxConstraint(value, () => increment ? value.addDays(1) : value.subtractDays(1));

                break;
            }
            case 'H':
            {
                this.withMinMaxConstraint(value, () => increment ? value.addHours(1) : value.subtractHours(1));

                break;
            }
            case 'm':
            {
                this.withMinMaxConstraint(value, () => increment ? value.addMinutes(1) : value.subtractMinutes(1));

                break;
            }
        }
    }
}
