import {Injectable} from '@angular/core';

import {DatePositionParser, DatePositionParserResult} from './datePositionParser.interface';

/**
 * Service used for parsing date 
 */
@Injectable({providedIn: 'root'})
export class DatePositionParserService
{
    //######################### public methods #########################

    /**
     * Creates parser instance for specified format
     * @param format - Format to be used for parsing date string
     */
    public createParser(format: string): DatePositionParser
    {
        return new DefaultDatePositionParser(format);
    }
}

/**
 * Default implementation of DatePositionParser
 */
export class DefaultDatePositionParser implements DatePositionParser
{
    //######################### protected fields #########################

    /**
     * Indication whether format contains separators
     */
    protected _hasSeparator: boolean = false;

    /**
     * Array of date parts of parsed date format
     */
    protected _datePartsIndexes: string[] = [];

    //######################### constructor #########################
    constructor(protected _format: string)
    {
        this._initialize();
    }

    //######################### public methods - implementation of DatePositionParser #########################

    /**
     * Parse date as string and returns information about positions and selected part of date
     * @param date - String date to be parsed
     * @param cursorPosition - Current cursor position
     */
    public parse(date: string, cursorPosition: number): DatePositionParserResult
    {
        var a = "I want apple";
        var b = " an";
        var position = 6;
        var output = [a.substr(0, position), b, a.slice(position)].join('');
        console.log(output);

        console.log(date, cursorPosition);

        return {
            part: '',
            positionFrom: 0,
            positionTo: 0
        };
    }

    /**
     * Initialize parser, process format
     */
    protected _initialize()
    {
        this._hasSeparator = /[^yqmwdhs]/i.test(this._format);

        //non strict format
        if(this._hasSeparator)
        {
            this._datePartsIndexes = this._format.replace(/[^yqmwdhs]+/gi, ' ')
                .split(' ')
                .filter(itm => !!itm)
                .map(itm => itm[0]);
        }
        //strict format
        else
        {

        }
    }
}