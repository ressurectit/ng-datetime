import {ComponentRef, Directive, ElementRef, EmbeddedViewRef, Inject, Input, OnDestroy, OnInit, Optional, ViewContainerRef} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Position, POSITION, applyPositionResult, PositionPlacement, PositionResult} from '@anglr/common';
import {extend, nameof, isDescendant, BindThis, renderToBody} from '@jscrpt/common';
import {Observable, Subscription} from 'rxjs';

import {DateTimeInput} from '../../../../interfaces';
import {DATE_TIME_INPUT} from '../../../../misc/tokens';
import {DateTimePickerComponent} from '../../components';
import {DateTimePickerOptions} from '../../components/dateTimePicker/dateTimePicker.interface';
import {DateTimePickerDirectiveOptions} from './dateTimePicker.interface';
import {DATE_TIME_PICKER_DIRECTIVE_OPTIONS} from '../../misc/tokens';
import {DateTimeBase} from '../../../dateTime/directives';

/**
 * Default options for date time picker directive
 */
const defaultOptions: DateTimePickerDirectiveOptions =
{
    absolute: true,
    alwaysVisible: false,
    closeOnValueSelect: false,
    closeOnBlur: true,
    disabled: false,
    positionOptions: PositionPlacement.BottomStart,
    showOnFocus: true,
    targetElement: null,
    pickerCssClass: null,
};

/**
 * Directive that is used for displaying and attaching date time picker
 */
@Directive(
{
    selector: '[dateTime][withPicker]',
    standalone: true,
    exportAs: 'dateTimePicker',
})
export class DateTimePickerSADirective<TDate = unknown> extends DateTimeBase<TDate> implements OnInit, OnDestroy
{
    //######################### protected properties #########################

    /**
     * Indication whether is value changes disabled
     */
    protected valueChangeDisabled: boolean = false;

    /**
     * Options for date time picker directive
     */
    protected ɵWithPickerOptions: DateTimePickerDirectiveOptions;

    /**
     * Date time picker component reference
     */
    protected componentRef: ComponentRef<DateTimePickerComponent<TDate>>|undefined|null;

    /**
     * Instance of date time picker component
     */
    protected component: DateTimePickerComponent<TDate>|undefined|null;

    /**
     * Instance of date time picker element
     */
    protected componentElement: HTMLElement|undefined|null;

    /**
     * Subscription for changes in picker
     */
    protected pickerChangesSubscription: Subscription|undefined|null;

    //######################### public properties - inputs #########################

    /**
     * Gets or sets options for date time picker directive
     */
    @Input()
    public get withPickerOptions(): Partial<DateTimePickerDirectiveOptions>
    {
        return this.ɵWithPickerOptions;
    }
    public set withPickerOptions(value: Partial<DateTimePickerDirectiveOptions>)
    {
        this.ɵWithPickerOptions = extend(true, {}, this.ɵWithPickerOptions, value);
    }

    /**
     * Options for date time picker component
     */
    @Input()
    public pickerOptions: Partial<DateTimePickerOptions<TDate>>|undefined|null;

    //######################### constructor #########################
    constructor(protected viewContainer: ViewContainerRef,
                protected element: ElementRef<HTMLElement>,
                @Inject(DATE_TIME_INPUT) protected input: DateTimeInput<TDate>,
                @Inject(DOCUMENT) protected document: Document,
                @Inject(POSITION) protected position: Position,

                @Inject(DATE_TIME_PICKER_DIRECTIVE_OPTIONS) @Optional() options?: DateTimePickerDirectiveOptions,)
    {
        super();

        this.ɵWithPickerOptions = extend(true, {}, defaultOptions, options);
    }

    //######################### public methods - implementation of OnInit #########################

    /**
     * Initialize component
     */
    public async ngOnInit(): Promise<void>
    {
        if(this.withPickerOptions.alwaysVisible)
        {
            this.showPicker();
        }

        this.initSubscriptions.add(this.input.valueChange.subscribe(() =>
        {
            this.setPickerValue();
            this.componentRef?.changeDetectorRef.detectChanges();
        }));

        this.initSubscriptions.add(this.input.focus.subscribe(() =>
        {
            if(this.withPickerOptions.showOnFocus)
            {
                this.showPicker();
            }
        }));

        this.initSubscriptions.add(this.input.blur.subscribe(() =>
        {
            if(this.withPickerOptions.closeOnBlur)
            {
                this.hidePicker();
            }
        }));
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public override ngOnDestroy(): void
    {
        super.ngOnDestroy();

        this.hidePicker();
        this.initSubscriptions.unsubscribe();
    }

    //######################### public methods #########################

    /**
     * Hides date time picker
     */
    public async showPicker(): Promise<void>
    {
        if(this.withPickerOptions.disabled || this.componentRef)
        {
            return;
        }

        this.componentRef = this.viewContainer.createComponent(DateTimePickerComponent<TDate>);
        this.componentElement = (this.componentRef?.hostView as EmbeddedViewRef<DateTimePickerComponent<TDate>>).rootNodes[0] as HTMLElement;
        this.component = this.componentRef.instance;

        if(this.withPickerOptions.absolute)
        {
            renderToBody(this.document, this.componentElement, this.withPickerOptions.targetElement);
        }

        this.pickerChangesSubscription = new Subscription();
        this.pickerChangesSubscription.add(this.component.valueChange.subscribe(() =>
        {
            if(this.component)
            {
                this.valueChangeDisabled = true;
                this.input.value = this.component.value;
                this.input.valueChange.emit();
                this.valueChangeDisabled = false;

                if(this.ɵWithPickerOptions.closeOnValueSelect)
                {
                    this.hidePicker();
                }
            }
        }));

        this.document.addEventListener('click', this.handleClickOutside);
        this.componentElement.addEventListener('mousedown', this.handleClickInside);
        this.componentElement.style.position = 'absolute';

        if(this.ɵWithPickerOptions.pickerCssClass)
        {
            this.componentElement.classList.add(this.ɵWithPickerOptions.pickerCssClass);
        }

        this.pickerChangesSubscription.add(this.positionPicker(this.componentElement, true).subscribe(result => applyPositionResult(result)));

        this.componentRef.setInput(nameof<DateTimePickerComponent>('options'), this.pickerOptions);
        this.componentRef.setInput(nameof<DateTimePickerComponent>('valueFormat'), this.dateTimeData.valueFormat);
        this.componentRef.setInput(nameof<DateTimePickerComponent>('format'), this.dateTimeData.format);
        this.componentRef.setInput(nameof<DateTimePickerComponent>('customFormat'), this.dateTimeData.customFormat);
        this.componentRef.setInput(nameof<DateTimePickerComponent>('minDateTime'), this.dateTimeData.minDateTime);
        this.componentRef.setInput(nameof<DateTimePickerComponent>('maxDateTime'), this.dateTimeData.maxDateTime);
        this.setPickerValue();
        this.componentRef.changeDetectorRef.detectChanges();
    }

    /**
     * Shows date time picker
     */
    public hidePicker(): void
    {
        if(this.withPickerOptions.alwaysVisible)
        {
            return;
        }

        this.componentElement?.removeEventListener('mousedown', this.handleClickInside);
        
        this.pickerChangesSubscription?.unsubscribe();
        this.pickerChangesSubscription = null;
        
        this.component = null;

        this.componentRef?.destroy();
        this.componentRef = null;

        this.componentElement?.remove();
        this.componentElement = null;

        this.document.removeEventListener('click', this.handleClickOutside);
    }

    //######################### protected methods #########################

    /**
     * Sets all picker value
     */
    protected setPickerValue(): void
    {
        if(this.valueChangeDisabled)
        {
            return;
        }

        if(this.componentRef)
        {
            this.componentRef.setInput(nameof<DateTimePickerComponent>('value'), this.input.value);
        }
    }

    /**
     * Handles clicking outside of picker
     * @param event - Event that occured
     */
    @BindThis
    protected handleClickOutside(event: MouseEvent): void
    {
        if(!this.componentElement)
        {
            return;
        }

        if(this.componentElement != event.target &&
           !isDescendant(this.componentElement, event.target as HTMLElement) &&
           (!this.input.element || (this.input.element != event.target &&
                                    !isDescendant(this.input.element, event.target as HTMLElement))))
        {
            this.hidePicker();
        }
    }

    /**
     * Handles clicking inside of picker element
     * @param event - Event that occured
     */
    @BindThis
    protected handleClickInside(event: MouseEvent): void
    {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * Runs placement of picker component
     * @param componentElement - Element to be positioned
     * @param watch - Indication whether watch for changes and update position
     */
    protected positionPicker(componentElement: HTMLElement, watch: boolean): Observable<PositionResult<HTMLElement>>
    {
        return this.position.placeElement(componentElement, this.element.nativeElement,
        {
            flip: true,
            placement: this.withPickerOptions.positionOptions,
            autoUpdate: watch,
        });
    }

    //######################### protected methods - overrides #########################

    /**
     * @inheritdoc
     */
    protected override onMaxDateTimeChange(): void
    {
        if(!this.componentRef)
        {
            return;
        }

        this.componentRef.setInput(nameof<DateTimePickerComponent>('maxDateTime'), this.dateTimeData.maxDateTime);
        this.componentRef.changeDetectorRef.detectChanges();
    }

    /**
     * @inheritdoc
     */
    protected override onMinDateTimeChange(): void
    {
        if(!this.componentRef)
        {
            return;
        }

        this.componentRef.setInput(nameof<DateTimePickerComponent>('minDateTime'), this.dateTimeData.minDateTime);
        this.componentRef.changeDetectorRef.detectChanges();
    }
}