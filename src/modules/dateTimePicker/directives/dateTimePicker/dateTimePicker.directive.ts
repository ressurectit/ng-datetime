import {ComponentRef, Directive, ElementRef, EmbeddedViewRef, Inject, Input, OnDestroy, OnInit, Optional, ViewContainerRef} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Position, POSITION, applyPositionResult, PositionPlacement} from '@anglr/common';
import {extend, nameof} from '@jscrpt/common';
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
    closeOnBlur: true,
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
        this.showPicker();

        this.initSubscriptions.add(this.input.valueChange.subscribe(() => this.setPickerValue()));
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
        if(!this.componentRef)
        {
            this.componentRef = this.viewContainer.createComponent(DateTimePickerComponent<TDate>);
            this.componentElement = (this.componentRef?.hostView as EmbeddedViewRef<DateTimePickerComponent<TDate>>).rootNodes[0] as HTMLElement;
            this.component = this.componentRef.instance;

            this.document.body.append(this.componentElement);
        }

        if(this.componentElement)
        {
            const result = await lastValueFrom(this.position.placeElement(this.componentElement, this.element.nativeElement,
            {
                placement: PositionPlacement.BottomStart,
            }));

            applyPositionResult(result);
        }

        this.setPickerValue();
    }

    /**
     * Shows date time picker
     */
    public hidePicker(): void
    {
        this.component = null;
        this.componentRef?.destroy();
        this.componentRef = null;
        this.componentElement?.remove();
        this.componentElement = null;
    }

    //######################### protected methods #########################

    /**
     * Sets all picker value
     */
    protected setPickerValue(): void
    {
        if(this.componentRef)
        {
            this.componentRef.setInput(nameof<DateTimePickerComponent>('value'), this.input.value);
        }
    }
}