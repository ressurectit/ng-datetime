import {AfterContentInit, ContentChildren, Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, QueryList, SimpleChanges} from '@angular/core';
import {DebounceCall, isBlank, nameof} from '@jscrpt/common';

import {LoopScrollDataDirective} from '../loopScrollData/loopScrollData.directive';

/**
 * Renders loop scroll for array of elements
 */
@Directive(
{
    selector: '[loopScroll]'
})
export class LoopScrollDirective<TData = any> implements OnChanges, AfterContentInit
{
    //######################### protected fields #########################

    /**
     * Item height that obtained
     */
    protected _itemHeight?: number;

    /**
     * Array of elements for scrolled stuff
     */
    protected _items?: LoopScrollDataDirective[];

    /**
     * Array of elements and data for scrolled stuff
     */ 
    protected _dataItems?: LoopScrollDataDirective[];

    /**
     * Indication whether is loop scroll initialized
     */
    protected _initialized: boolean = false;

    /**
     * Count of cloned elements before or after
     */
    protected _clonedCount: number = 0;

    /**
     * Indication whether ignore scroll handle
     */
    protected _ignoreScrollHandle: boolean = false;

    /**
     * Indication whether skip value change
     */
    protected _skipValueChange: boolean = false;

    /**
     * Value that is being set in loop scroll
     */
    protected _value?: TData;

    //######################### public properties - inputs #########################

    /**
     * Gets or sets value that is being set in loop scroll
     */
    @Input('loopScroll')
    public get value(): TData
    {
        return this._value!;
    }
    public set value(value: TData)
    {
        this._skipValueChange = this._value == value;
        this._value = value;
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
    public valueChange: EventEmitter<TData> = new EventEmitter<TData>();

    //######################### protected properties - children #########################

    /**
     * Array of items that are loop scrolled
     */
    @ContentChildren(LoopScrollDataDirective)
    protected items?: QueryList<LoopScrollDataDirective>;

    //######################### constructor #########################
    constructor(protected _scrollElement: ElementRef<HTMLElement>)
    {
    }

    //######################### public methods - implementation of OnChanges #########################
    
    /**
     * Called when input value changes
     */
    public ngOnChanges(changes: SimpleChanges): void
    {
        if(!this._initialized)
        {
            return;
        }

        const itemHeight = this._itemHeight ?? 1;

        if(nameof<LoopScrollDirective>('open') in changes)
        {
            if(this.open)
            {
                this._scrollElement.nativeElement.scrollTo({top: this._scrollElement.nativeElement.scrollTop - (2 * itemHeight), behavior: 'auto'});

                return;
            }

            if(nameof<LoopScrollDirective>('value') in changes)
            {
                const selectedItem = this._dataItems?.find(itm => itm.data == this.value);

                if(!selectedItem)
                {
                    throw new Error('No item selected in loop scroll');
                }

                const selectedIndex = this._dataItems!.indexOf(selectedItem);

                this._scrollElement.nativeElement.scrollTo({top: (selectedIndex + this._clonedCount) * itemHeight, behavior: 'auto'});
            }
            else
            {
                this._scrollElement.nativeElement.scrollTo({top: this._scrollElement.nativeElement.scrollTop + (2 * itemHeight), behavior: 'auto'});
            }
        }
        else if(nameof<LoopScrollDirective>('value') in changes)
        {
            if(!this._skipValueChange)
            {
                this._ignoreScrollHandle = true;
                this._scrollElement.nativeElement.scrollTo({top: this._itemHeight! * (this._clonedCount + this._dataItems!.findIndex(itm => itm.data == this.value) + (this.open ? -2 : 0)), behavior: 'auto'});
                this._ignoreScrollHandle = false;
            }
        }

        this._skipValueChange = false;
    }

    //######################### public methods - implementation of AfterContentInit #########################
    
    /**
     * Called when content was initialized
     */
    public ngAfterContentInit(): void
    {
        this._items = this.items?.toArray();
        this._dataItems = this._items?.filter(itm => !itm.clone);

        if(!this._dataItems?.length)
        {
            this.items?.changes.subscribe(() =>
            {
                this._items = this.items?.toArray();
                this._dataItems = this._items?.filter(itm => !itm.clone);

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
        const cloned = this._items?.filter(itm => itm.clone) ?? [];
        this._clonedCount = cloned.length / 2;

        if(!this._dataItems?.length)
        {
            return;
        }

        this._dataItems.forEach(itm =>
        {
            if(isBlank(this._itemHeight))
            {
                this._itemHeight = itm.element.nativeElement.offsetHeight;

                return;
            }

            if(this._itemHeight != itm.element.nativeElement.offsetHeight)
            {
                throw new Error('All items inside of loop scroll should have same height');
            }
        });

        this._scrollElement.nativeElement.scrollTo({top: this._itemHeight! * (this._clonedCount + this._dataItems!.findIndex(itm => itm.data == this.value)), behavior: 'auto'});
        this._initialized = true;
    }

    /**
     * Handles scroll event
     */
    @HostListener('scroll')
    protected _handleScroll(): void
    {
        if(this._ignoreScrollHandle)
        {
            return;
        }

        requestAnimationFrame(() =>
        {
            if(!this._dataItems)
            {
                return;
            }

            const index = this._scrollElement.nativeElement.scrollTop / (this._itemHeight ?? 1);
            const dataIndex = index + (this.open ? 2 : 0) - this._clonedCount;
            const dataLength = (this._itemHeight ?? 1) * this._dataItems.length;

            if(index % 1 <= .2 || index % 1 >= .8)
            {
                this._scrollElement.nativeElement.querySelector('.selected')?.classList?.remove('selected');

                const roundIndex = Math.round(index);
                this._items![roundIndex + (this.open ? 2 : 0)].element.nativeElement.classList.add('selected');
                this._emitValue(dataIndex);
            }

            if(dataIndex <= -1)
            {
                this._updateScroll(dataLength, true, index, dataIndex);
            }
            else if(dataIndex >= (this._dataItems.length ?? 0))
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
        this._scrollElement.nativeElement.scrollTo({top: (Math.round(index) * (this._itemHeight ?? 1)) + (add ? dataLength : (dataLength * -1)), behavior: 'auto'});

        this._emitValue(dataIndex);
    }

    /**
     * Emits value after scroll
     * @param index - Index of currently selected data item
     */
    protected _emitValue(index: number): void
    {
        index = Math.round(index) % this._dataItems!.length;
        
        if(index < 0)
        {
            index = this._dataItems!.length + index;
        }

        const item = this._dataItems![index];

        if(this.value != item.data)
        {
            this.value = item.data;
            this.valueChange.next(this.value);
        }
    }
}