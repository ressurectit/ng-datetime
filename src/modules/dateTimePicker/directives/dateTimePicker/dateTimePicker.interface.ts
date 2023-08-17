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
     * Indication whether close picker when date time input loses focus
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
     * String that defines element in which should be picker rendered, if not specified, body is used, working only with `absolute` set to `true`
     * 
     * Allows also css class to be specified (div.body-box)
     */
    targetElement: string|undefined|null;

    /**
     * Position options that are used to position picker
     */
    positionOptions: Partial<PositionPlacement>;

    /**
     * Custom css class that is being added to picker component
     */
    pickerCssClass: string|undefined|null;
}