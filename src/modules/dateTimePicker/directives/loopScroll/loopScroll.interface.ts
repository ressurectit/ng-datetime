/**
 * Represents data for LoopScrollDirective
 */
export interface LoopScrollData<TData = unknown>
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