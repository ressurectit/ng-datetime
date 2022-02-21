import {Pipe, PipeTransform} from '@angular/core';
import {Dictionary} from '@jscrpt/common';

/**
 * Type that represents ngClass
 */
export type NgClassType = string|string[]|Set<string>|Dictionary<any>|undefined|null;

/**
 * Transforms type to required from nullable or undefined type
 */
@Pipe({name: 'asRequiredType'})
export class AsRequiredTypePipe implements PipeTransform
{
    /**
     * Transforms type to required from nullable or undefined type
     * @param value - Value to be transformed
     * @param defaultValue - Default value to be used if undefined or null
     */
    public transform(value: NgClassType, defaultValue: string = ''): Exclude<NgClassType, undefined|null>
    {
        return value ?? defaultValue;
    }
}