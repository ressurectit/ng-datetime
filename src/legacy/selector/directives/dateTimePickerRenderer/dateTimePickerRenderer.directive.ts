import {ComponentRef, Directive, ElementRef, EmbeddedViewRef, EventEmitter, Inject, Injector, Input, OnChanges, OnDestroy, OnInit, Optional, Output, ViewContainerRef} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {POSITION, Position, applyPositionResult} from '@anglr/common';
import {Subscription} from 'rxjs';

import {DateTimeValue} from '../../../../interfaces/dateTime/datetime.interface';
import {DateTimeSelector, DateTimeSelectorOptions} from '../../interfaces';
import {DateTimePickerLegacyComponent} from '../../../picker/types';

/**
 * Directive for rendering datetime picker in selector
 */
@Directive(
{
    selector: '[dateTimePicker]'
})
export class DateTimePickerRendererDirective<TDate = any> implements OnInit, OnChanges, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Instance of component used for rendering picker
     */
    protected _pickerComponent?: ComponentRef<DateTimePickerLegacyComponent>;

    /**
     * Instance of HTML element for picker
     */
    protected _pickerElement?: HTMLElement;

    /**
     * Subscriptions created during initialization
     */
    protected _initSubscriptions: Subscription = new Subscription();

    //######################### protected properties #########################

    /**
     * Current options used by selector
     */
    protected get _options(): DateTimeSelectorOptions<DateTimeSelector<TDate>>
    {
        return this.options as DateTimeSelectorOptions<DateTimeSelector<TDate>>;
    }

    //######################### public properties - inputs #########################

    /**
     * Current options used by selector
     */
    @Input()
    public options!: Partial<DateTimeSelectorOptions<DateTimeSelector<TDate>>>;

    /**
     * Current selected value
     */
    @Input('dateTimePicker')
    public value!: DateTimeValue<TDate>|null;

    /**
     * Gets or sets minimal possible value for picker, that can be picked
     */
    @Input()
    public minValue!: TDate|null;

    /**
     * Gets or sets maximal possible value for picker, that can be picked
     */
    @Input()
    public maxValue!: TDate|null;

    /**
     * Selector element which is used during absolute positioning of picker
     */
    @Input()
    public selectorElement!: ElementRef<HTMLElement>;

    //######################### public properties - outputs #########################

    /**
     * Occurs when value changes
     */
    @Output()
    public valueChange: EventEmitter<DateTimeValue<TDate>> = new EventEmitter<DateTimeValue<TDate>>();

    //######################### constructor #########################
    constructor(protected _viewContainer: ViewContainerRef,
                protected _injector: Injector,
                @Inject(POSITION) @Optional() protected _position: Position,
                @Inject(DOCUMENT) protected _document: Document)
    {
    }

    //######################### public methods - implementation of OnInit #########################
    
    /**
     * Initialize component
     */
    public ngOnInit(): void
    {
        this._createPicker();
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(): void
    {
        this._createPicker();

        if(this._pickerComponent)
        {
            const picker = this._pickerComponent.instance;

            picker.value = this.value;
            picker.minValue = this.minValue;
            picker.maxValue = this.maxValue;
            picker.options = this.options;
        }
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this._destroyPicker();
        this._initSubscriptions.unsubscribe();
    }

    //######################### protected methods #########################

    /**
     * Destroys picker component
     */
    protected _destroyPicker(): void
    {
        if(this._pickerComponent)
        {
            this._pickerComponent.destroy();
            this._pickerComponent = undefined;
            this._pickerElement = undefined;
        }
    }

    /**
     * Creates picker component
     */
    protected _createPicker(): void
    {
        if(this._pickerComponent)
        {
            return;
        }

        // 1. Create a component reference from the component
        this._pickerComponent = this._viewContainer
            .createComponent(DateTimePickerLegacyComponent,
                             {
                                 injector: this._injector
                             });

        if(this._pickerComponent)
        {
            this._initSubscriptions.add(this._pickerComponent.instance.valueChange.subscribe(itm => this.valueChange.next(itm)));

            //absolutely position
            if(this._options.pickerAbsolute && this._position)
            {
                // 3. Get DOM element from component
                this._pickerElement = (this._pickerComponent.hostView as EmbeddedViewRef<any>)
                    .rootNodes[0] as HTMLElement;

                // 4. Append DOM element to the body
                this._document.querySelector(this._options.pickerAbsoluteContainer)?.appendChild(this._pickerElement);
                this._pickerElement.style.position = 'absolute';
                this._initSubscriptions.add(this._position.placeElement(this._pickerElement, this.selectorElement.nativeElement, this._options.positionOptions).subscribe(applyPositionResult));
            }
            else
            {
                return;
            }
        }
    }
}