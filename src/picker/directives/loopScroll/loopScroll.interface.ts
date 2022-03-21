//FIXME: not used for now, maybe will be removed

/**
 * Represents data for LoopScrollDirective
 */
export interface LoopScrollData<TData = any>
{
    /**
     * Text to be displayed for item
     */
    displayText?: string;

    /**
     * Data that are stored per value
     */
    data?: TData;
}