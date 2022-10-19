import {ComponentRef, Directive, ElementRef, EmbeddedViewRef, Inject, Input, OnDestroy, OnInit, Optional, ViewContainerRef} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Position, POSITION, applyPositionResult, PositionPlacement} from '@anglr/common';
import {extend, nameof, isDescendant, BindThis} from '@jscrpt/common';
import {lastValueFrom, Subscription} from 'rxjs';

import {DateTimeInput} from '../../../../interfaces';
import {DATE_TIME_INPUT} from '../../../../misc/tokens';
import {DateTimePickerComponent} from '../../components';
import {DateTimePickerDirectiveOptions} from './dateTimePicker.interface';
import {DATE_TIME_PICKER_DIRECTIVE_OPTIONS} from '../../misc/tokens';

/**
 * Default options for date time picker directive
 */
const defaultOptions: DateTimePickerDirectiveOptions =
{
    absolute: true,
    alwaysVisible: false,
    closeOnValueSelect: true,
    disabled: false,
    positionOptions: PositionPlacement.BottomStart,
    showOnFocus: true,
};

/**
 * Directive that is used for displaying and attaching date time picker
 */
@Directive(
{
    selector: '[dateTime][withPicker]',
    exportAs: 'dateTimePicker'
})
export class DateTimePickerDirective<TDate = unknown> implements OnInit, OnDestroy
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
     * Subscriptions created during initialization
     */
    protected initSubscriptions: Subscription = new Subscription();

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
     * Subscription for value changes in picker
     */
    protected valueChangeSubscription: Subscription|undefined|null;

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

    //######################### constructor #########################
    constructor(protected viewContainer: ViewContainerRef,
                protected element: ElementRef<HTMLElement>,
                @Inject(DATE_TIME_INPUT) protected input: DateTimeInput<TDate>,
                @Inject(DOCUMENT) protected document: Document,
                @Inject(POSITION) protected position: Position,
                @Inject(DATE_TIME_PICKER_DIRECTIVE_OPTIONS) @Optional() options?: DateTimePickerDirectiveOptions,)
    {
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

        this.initSubscriptions.add(this.input.valueChange.subscribe(() => this.setPickerValue()));

        this.initSubscriptions.add(this.input.focus.subscribe(() =>
        {
            if(this.withPickerOptions.showOnFocus)
            {
                this.showPicker();
            }
        }));
    }

    //######################### public methods - implementation of OnDestroy #########################

    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
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
            this.document.body.append(this.componentElement);
        }

        this.valueChangeSubscription = this.component.valueChange.subscribe(() =>
        {
            if(this.component)
            {
                this.valueChangeDisabled = true;
                this.input.value = this.component.value;
                this.input.valueChange.emit();
                this.valueChangeDisabled = false;
            }
        });

        this.document.addEventListener('click', this.handleClickOutside);

        const result = await lastValueFrom(this.position.placeElement(this.componentElement, this.element.nativeElement,
        {
            placement: this.withPickerOptions.positionOptions,
        }));

        applyPositionResult(result);
        this.setPickerValue();
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

        this.valueChangeSubscription?.unsubscribe();
        this.valueChangeSubscription = null;

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
            // this.componentRef.changeDetectorRef.markForCheck();
            this.componentRef.changeDetectorRef.detectChanges();
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
}