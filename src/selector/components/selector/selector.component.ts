import {Component, ChangeDetectionStrategy, Input, Inject, Optional, Type} from '@angular/core';
import {extend} from '@jscrpt/common';

import {DateTimeConfiguration} from '../../../misc/datetime.interface';
import {DateTimeSelector} from '../../misc/datetimeSelector.interface';
import {DATE_TIME_SELECTOR_CONFIGURATION} from '../../misc/tokens';
import {InputDateTimeSelectorComponent} from '../inputDateTime/inputDateTime.component';

/**
 * Default configuration for selector
 */
const defaultConfiguration: DateTimeConfiguration<DateTimeSelector> =
{
    defaultPeriod: 'day',
    periodsDefinition:
    {
        "day": InputDateTimeSelectorComponent
    }
};

/**
 * Component used for displaying and selecting date time
 */
@Component(
{
    selector: 'date-time-selector',
    templateUrl: 'selector.component.html',
    // styleUrls: ['selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeSelectorComponent<TDate = any>
{
    //######################### protected fields #########################

    /**
     * Instance of active date time selector
     */
    protected _activeSelector: DateTimeSelector<TDate>;

    //######################### public properties - template bindings #########################

    /**
     * Currently active date time selector component type
     * @internal
     */
    public activeSelectorComponent: Type<DateTimeSelector<TDate>>;

    //######################### public properties - inputs #########################

    /**
     * Format of displayed
     */
    @Input()
    public format: string;

    /**
     * Current configuration used by selector
     */
    @Input()
    public config: DateTimeConfiguration<DateTimeSelector<TDate>>;
    
    //######################### constructor #########################
    constructor(@Optional() @Inject(DATE_TIME_SELECTOR_CONFIGURATION) configuration: DateTimeConfiguration<DateTimeSelector<TDate>>)
    {
        this.config = extend(true, {}, defaultConfiguration, configuration);
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit()
    {
        if(!this.config.periodsDefinition[this.config.defaultPeriod])
        {
            throw new Error(`There is no period '${this.config.defaultPeriod}'`);
        }

        this.activeSelectorComponent = this.config.periodsDefinition[this.config.defaultPeriod];
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy()
    {
    }

    //######################### public methods - template bindings #########################

    /**
     * Handles created or destroyed date time selector instance
     * @param selector - Instance of selector or null
     * @internal
     */
    public selectorCreated(selector: DateTimeSelector<TDate>)
    {
        this._activeSelector = selector;
    }

    //######################### public methods #########################
}