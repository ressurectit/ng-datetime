import {PositionPlacement} from '@anglr/common';

/**
 * Defintion of date time picker directive options
 */
export interface DateTimePickerDirectiveOptions
{
    /**
     * Indication whether close picker on value selection
     */
    closeOnValueSelect: boolean;

    /**
     * Indication whether close picker on date time input blur
     */
    closeOnBlur: boolean;

    /**
     * Indication whether display picker when date time input gets focus
     */
    showOnFocus: boolean;

    /**
     * Indication whether is picker always visible, mostly used for debugging
     */
    alwaysVisible: boolean;

    /**
     * Indication whether picker is disabled, if true, you cant display picker
     */
    disabled: boolean;

    /**
     * Indication whether use absolute global positioning of picker
     */
    absolute: boolean;

    /**
     * Position options that are used to position picker
     */
    positionOptions: Partial<PositionPlacement>;
}