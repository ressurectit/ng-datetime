import {AfterContentInit, ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, QueryList, SimpleChanges} from '@angular/core';
import {DebounceCall, isBlank, nameof} from '@jscrpt/common';

import {LoopScrollDataDirective} from '../loopScrollData/loopScrollData.directive';

/**
 * Renders loop scroll for array of elements
 */
@Directive(
{
    selector: '[loopScroll]',
    standalone: true,
})
export class LoopScrollDirective<TData = unknown> implements OnChanges, AfterContentInit
{
    //######################### protected fields #########################

    /**
     * Item height that obtained
     */
    protected itemHeight: number|undefined|null;

    /**
     * Array of elements for scrolled stuff
     */
    protected ɵitems: LoopScrollDataDirective<TData>[] = [];

    /**
     * Array of elements and data for scrolled stuff
     */ 
    protected dataItems: LoopScrollDataDirective<TData>[] = [];

    /**
     * Indication whether is loop scroll initialized
     */
    protected initialized: boolean = false;

    /**
     * Count of cloned elements before or after
     */
    protected clonedCount: number = 0;

    /**
     * Indication whether ignore scroll handle
     */
    protected ignoreScrollHandle: boolean = false;

    /**
     * Indication whether skip value change
     */
    protected skipValueChange: boolean = false;

    /**
     * Value that is being set in loop scroll
     */
    protected ɵvalue: TData|undefined|null;

    //######################### public properties - inputs #########################

    /**
     * Gets or sets value that is being set in loop scroll
     */
    @Input('loopScroll')
    public get value(): TData|undefined|null
    {
        return this.ɵvalue;
    }
    public set value(value: TData|undefined|null)
    {
        this.skipValueChange = this.ɵvalue == value;
        this.ɵvalue = value;
    }

    /**
     * Indication whether is currently selection scroll open
     */
    @Input()
    public open: boolean = false;

    //######################### public properties - outputs #########################

    /**
     * Occurs when current value of loop scroll changes
     */
    @Output('loopScrollChange')
    public valueChange: EventEmitter<TData|undefined|null> = new EventEmitter<TData|undefined|null>();

    //######################### protected properties - children #########################

    /**
     * Array of items that are loop scrolled
     */
    @ContentChildren(LoopScrollDataDirective)
    protected items: QueryList<LoopScrollDataDirective<TData>>|undefined|null;

    //######################### constructor #########################
    constructor(protected scrollElement: ElementRef<HTMLElement>)
    {
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(!this.initialized)
        {
            return;
        }

        const itemHeight = this.itemHeight ?? 1;

        if(nameof<LoopScrollDirective>('open') in changes)
        {
            if(this.open)
            {
                this.scrollElement.nativeElement.scrollTo({top: this.scrollElement.nativeElement.scrollTop - (2 * itemHeight), behavior: 'auto'});

                return;
            }

            if(nameof<LoopScrollDirective>('value') in changes)
            {
                const selectedItem = this.dataItems?.find(itm => itm.data == this.value);

                if(!selectedItem)
                {
                    throw new Error('No item selected in loop scroll');
                }

                const selectedIndex = this.dataItems.indexOf(selectedItem);

                this.scrollElement.nativeElement.scrollTo({top: (selectedIndex + this.clonedCount) * itemHeight, behavior: 'auto'});
            }
            else
            {
                this.scrollElement.nativeElement.scrollTo({top: this.scrollElement.nativeElement.scrollTop + (2 * itemHeight), behavior: 'auto'});
            }
        }
        else if(nameof<LoopScrollDirective>('value') in changes)
        {
            if(!this.skipValueChange)
            {
                this.ignoreScrollHandle = true;
                this.scrollElement.nativeElement.scrollTo({top: (this.itemHeight ?? 0) * (this.clonedCount + this.dataItems.findIndex(itm => itm.data == this.value) + (this.open ? -2 : 0)), behavior: 'auto'});
                this.ignoreScrollHandle = false;
            }
        }

        this.skipValueChange = false;
    }

    //######################### public methods - implementation of AfterContentInit #########################
    
    /**
     * Called when content was initialized
     */
    public ngAfterContentInit(): void
    {
        this.ɵitems = this.items?.toArray() ?? [];
        this.dataItems = this.ɵitems?.filter(itm => !itm.clone);

        if(!this.dataItems?.length)
        {
            this.items?.changes.subscribe(() =>
            {
                this.ɵitems = this.items?.toArray() ?? [];
                this.dataItems = this.ɵitems?.filter(itm => !itm.clone);

                this._initialize();
            });

            return;
        }

        this._initialize();
    }

    //######################### protected methods #########################

    /**
     * Intialize default value
     */
    protected _initialize(): void
    {
        const cloned = this.ɵitems?.filter(itm => itm.clone) ?? [];
        this.clonedCount = cloned.length / 2;

        if(!this.dataItems?.length)
        {
            return;
        }

        this.dataItems.forEach(itm =>
        {
            if(isBlank(this.itemHeight))
            {
                this.itemHeight = itm.element.nativeElement.offsetHeight;

                return;
            }

            if(this.itemHeight != itm.element.nativeElement.offsetHeight)
            {
                throw new Error('All items inside of loop scroll should have same height');
            }
        });

        this.scrollElement.nativeElement.scrollTo({top: (this.itemHeight ?? 0) * (this.clonedCount + this.dataItems.findIndex(itm => itm.data == this.value)), behavior: 'auto'});
        this.initialized = true;
    }

    /**
     * Handles scroll event
     */
    @HostListener('scroll')
    protected _handleScroll(): void
    {
        if(this.ignoreScrollHandle)
        {
            return;
        }

        requestAnimationFrame(() =>
        {
            if(!this.dataItems)
            {
                return;
            }

            const index = this.scrollElement.nativeElement.scrollTop / (this.itemHeight ?? 1);
            const dataIndex = index + (this.open ? 2 : 0) - this.clonedCount;
            const dataLength = (this.itemHeight ?? 1) * this.dataItems.length;

            if(index % 1 <= .2 || index % 1 >= .8)
            {
                this.scrollElement.nativeElement.querySelector('.selected')?.classList?.remove('selected');

                const roundIndex = Math.round(index);
                this.ɵitems[roundIndex + (this.open ? 2 : 0)].element.nativeElement.classList.add('selected');
                this._emitValue(dataIndex);
            }

            if(dataIndex <= -1)
            {
                this._updateScroll(dataLength, true, index, dataIndex);
            }
            else if(dataIndex >= (this.dataItems.length ?? 0))
            {
                this._updateScroll(dataLength, false, index, dataIndex);
            }
        });
    }

    /**
     * Updates scroll to be at full value of item
     * @param dataLength - Length of all data
     * @param add - Indication whether add or subtract length
     * @param index - Current index
     * @param dataIndex - Current index of data 
     */
    @DebounceCall(18)
    protected _updateScroll(dataLength: number, add: boolean, index: number, dataIndex: number): void
    {
        this.scrollElement.nativeElement.scrollTo({top: (Math.round(index) * (this.itemHeight ?? 1)) + (add ? dataLength : (dataLength * -1)), behavior: 'auto'});

        this._emitValue(dataIndex);
    }

    /**
     * Emits value after scroll
     * @param index - Index of currently selected data item
     */
    protected _emitValue(index: number): void
    {
        index = Math.round(index) % this.dataItems.length;
        
        if(index < 0)
        {
            index = this.dataItems.length + index;
        }

        const item = this.dataItems[index];

        if(this.value != item.data)
        {
            this.value = item.data;
            this.valueChange.next(this.value);
        }
    }
}