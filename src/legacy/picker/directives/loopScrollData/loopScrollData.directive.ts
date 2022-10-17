import {Directive, ElementRef, Input} from '@angular/core';

/**
 * Loop scroll data that are used inside LoopScrollDirective
 */
@Directive(
{
    selector: '[loopScrollData]'
})
export class LoopScrollDataDirective<TData = any>
{
    //######################### public properties - inputs #########################

    /**
     * Data for loop
     */
    @Input('loopScrollData')
    public data!: TData;

    /**
     * Indication that this node is clone
     */
    @Input()
    public clone: boolean = false;

    //######################### constructor #########################
    constructor(public element: ElementRef<HTMLElement>)
    {
    }
}