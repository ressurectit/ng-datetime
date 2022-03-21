import {AfterContentInit, ContentChildren, Directive, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChanges} from '@angular/core';
import {BindThis, isBlank, DebounceCall, nameof} from '@jscrpt/common';

import {LoopScrollDataDirective} from '../loopScrollData/loopScrollData.directive';

/**
 * Renders loop scroll for array of elements
 */
@Directive(
{
    selector: '[loopScroll]'
})
export class LoopScrollDirective<TData = any> implements OnChanges, AfterContentInit, OnDestroy
{
    //######################### protected fields #########################

    /**
     * Item height that obtained
     */
    protected _itemHeight?: number;

    /**
     * Array of elements and data for scrolled stuff
     */
    protected _items?: LoopScrollDataDirective[];

    /**
     * Indication whether is loop scroll initialized
     */
    protected _initialized: boolean = false;

    /**
     * Indication whether is opening active
     */
    protected _opening: boolean = false;

    //######################### public properties - inputs #########################

    /**
     * Value that is being set in loop scroll
     */
    @Input('loopScroll')
    public value?: TData;

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

    //######################### public properties - children #########################

    /**
     * Array of items that are loop scrolled
     */
    @ContentChildren(LoopScrollDataDirective)
    public items?: QueryList<LoopScrollDataDirective>;

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
            let scrollOffset = this._scrollElement.nativeElement.scrollTop + (2 * itemHeight);

            if(nameof<LoopScrollDirective>('value') in changes)
            {
                const selectedItem = this._items?.find(itm => itm.data == this.value);

                if(!selectedItem)
                {
                    throw new Error('No item selected in loop scroll');
                }

                const selectedIndex = this._items!.indexOf(selectedItem);
                scrollOffset = selectedIndex * itemHeight;
            }

            if(this.open)
            {
                this._opening = true;

                this._scrollElement.nativeElement.scrollTo({top: this._scrollElement.nativeElement.scrollTop - (2 * itemHeight), behavior: 'auto'});
            }
            else
            {
                this._scrollElement.nativeElement.scrollTo({top: scrollOffset, behavior: 'auto'});
            }

            setTimeout(() => this._opening = false, 300);
        }
    }

    //######################### public methods - implementation of AfterContentInit #########################
    
    /**
     * Called when content was initialized
     */
    public ngAfterContentInit(): void
    {
        this._items = this.items?.toArray();

        if(!this._items?.length)
        {
            this.items?.changes.subscribe(() =>
            {
                this._items = this.items?.toArray();

                this._initialize();
            });

            return;
        }

        this._initialize();
    }

    //######################### public methods - implementation of OnDestroy #########################
    
    /**
     * Called when component is destroyed
     */
    public ngOnDestroy(): void
    {
        this._scrollElement.nativeElement.removeEventListener('scroll', this._handleScroll);
    }

    //######################### protected methods #########################

    /**
     * Intialize default value
     */
    protected _initialize(): void
    {
        if(!this._items?.length)
        {
            return;
        }

        this._items.forEach(itm =>
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

        this._centerActiveValue();
        this._scrollElement.nativeElement.addEventListener('scroll', this._handleScroll);
        this._initialized = true;
    }

    /**
     * Reorders items to make number of items around scroll view equally sized
     */
    protected _reorderItems(): void
    {
        const scrollOffset = this._scrollElement.nativeElement.scrollTop;
        const scrollHeight = this._scrollElement.nativeElement.scrollHeight;
        const scrollableHeight = scrollHeight - (5 * (this._itemHeight ?? 0));
        const scrollMid = scrollableHeight / 2;
        const threshold = scrollableHeight * .25;
        let reorderOffset: number|null = null;

        //reorder items
        if(scrollOffset <= scrollMid - threshold ||
           scrollOffset >= scrollMid + threshold)
        {
            reorderOffset = scrollMid - scrollOffset;
        }
        else
        {
            return;
        }

        //move end items to start
        if(reorderOffset >= 0)
        {
            const numberOfItems = Math.floor(reorderOffset / (this._itemHeight ?? 1));
            const movedItems = this._items?.splice(this._items.length - numberOfItems, numberOfItems);

            movedItems?.reverse().forEach(itm =>
            {
                this._scrollElement.nativeElement.prepend(itm.element.nativeElement);
                this._items?.unshift(itm);
            });
        }
        //move start items to end
        else
        {
            const numberOfItems = Math.floor((reorderOffset * -1) / (this._itemHeight ?? 1));
            const movedItems = this._items?.splice(0, numberOfItems);

            movedItems?.forEach(itm =>
            {
                this._scrollElement.nativeElement.append(itm.element.nativeElement);
                this._items?.push(itm);
            });
        }
    }

    /**
     * Handles scroll event
     */
    @BindThis
    @DebounceCall(40)
    protected _handleScroll(): void
    {
        this._reorderItems();

        const itemHeight = this._itemHeight ?? 1;
        const index = Math.round(this._scrollElement.nativeElement.scrollTop / itemHeight);

        this._scrollElement.nativeElement.scrollTo({top: index * itemHeight, behavior: 'auto'});

        if(!this._opening)
        {
            this.valueChange.emit(this._items?.[this.open ? (index + 2) : index].data);
        }
    }

    /**
     * Centers active value
     */
    protected _centerActiveValue(): void
    {
        const selectedItem = this._items?.find(itm => itm.data == this.value);

        if(!selectedItem)
        {
            throw new Error('No item selected in loop scroll');
        }

        selectedItem?.element.nativeElement.scrollIntoView({block: 'center'});
        this._reorderItems();
        selectedItem?.element.nativeElement.scrollIntoView({block: 'center'});
    }
}