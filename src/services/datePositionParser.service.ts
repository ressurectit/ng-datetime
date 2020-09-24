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

    /**
     * Object storing indexes for strict date parts of parsed date format
     */
    protected _strictDatePartsIndexes: {[index: number]: {part: string, length: number}} = {};

    //######################### constructor #########################
    constructor(protected _format: string)
    {
        this._initialize();
    }

    //######################### public methods - implementation of DatePositionParser #########################

    /**
     * Parse date as string and returns information about position and selected part of date, while moving it to next part, if it was last part returns null
     * @param date - String date to be parsed
     * @param cursorPosition - Current cursor position
     */
    public next(date: string, cursorPosition: number): null|DatePositionParserResult
    {
        //non strict format
        if(this._hasSeparator)
        {
            let useNext = false;

            while(true)
            {
                if(cursorPosition == date.length)
                {
                    return null;
                }

                if(useNext && !isNaN(+date[cursorPosition]))
                {
                    return this.parse(date, cursorPosition);
                }

                if(isNaN(+date[cursorPosition]))
                {
                    useNext = true;
                }

                cursorPosition++;
            }
        }
        //strict format
        else
        {
            let indexes = Object.keys(this._strictDatePartsIndexes).map(itm => +itm);

            for(let index of indexes)
            {
                if(cursorPosition < index)
                {
                    return {
                        part: this._strictDatePartsIndexes[index].part,
                        positionFrom: index,
                        positionTo: index + this._strictDatePartsIndexes[index].length
                    };
                }
            }
        }

        return null;
    }

    /**
     * Parse date as string and returns information about position and selected part of date, while moving it to previous part, if it was first part returns null
     * @param date - String date to be parsed
     * @param cursorPosition - Current cursor position
     */
    public previous(date: string, cursorPosition: number): null|DatePositionParserResult
    {
        //non strict format
        if(this._hasSeparator)
        {
            let useNext = false;

            while(true)
            {
                if(cursorPosition < 0)
                {
                    return null;
                }

                if(useNext && !isNaN(+date[cursorPosition]))
                {
                    return this.parse(date, cursorPosition);
                }

                if(isNaN(+date[cursorPosition]))
                {
                    useNext = true;
                }

                cursorPosition--;
            }
        }
        //strict format
        else
        {
            let indexes = Object.keys(this._strictDatePartsIndexes).reverse().map(itm => +itm);

            for(let index of indexes)
            {
                if(cursorPosition > index)
                {
                    return {
                        part: this._strictDatePartsIndexes[index].part,
                        positionFrom: index,
                        positionTo: index + this._strictDatePartsIndexes[index].length
                    };
                }
            }
        }

        return null;
    }

    /**
     * Parse date as string and returns information about positions and selected part of date
     * @param date - String date to be parsed
     * @param cursorPosition - Current cursor position
     */
    public parse(date: string, cursorPosition: number): DatePositionParserResult
    {
        //non strict format
        if(this._hasSeparator)
        {
            //fix cursor position if is clicked on separator
            if(cursorPosition != date.length &&
               /[^0-9ɵ]/.test(date[cursorPosition]) &&
               /[^0-9ɵ]/.test(date[cursorPosition - 1]))
            {
                cursorPosition++;
    
                while(/[^0-9ɵ]/.test(date[cursorPosition]))
                {
                    cursorPosition++;
                }
            }
    
            let updateDate = [date.substr(0, cursorPosition), 'ɵ', date.substr(cursorPosition)].join('');
            let indexed = updateDate.replace(/[^0-9ɵ]/g, ' ').split(' ');
            let partIndex = 0;
            let startPosition = 0;
            let selectionLength = 0;
    
            for(let itm of indexed)
            {
                //this segment contains cursor
                if(itm.indexOf('ɵ') >= 0)
                {
                    selectionLength = itm.length - 1;
    
                    break;
                }
    
                startPosition++;
    
                //separator
                if(!itm.length)
                {
                    continue;
                }
    
                partIndex++;
                startPosition += itm.length;
            }

            return {
                part: this._datePartsIndexes[partIndex],
                positionFrom: startPosition,
                positionTo: startPosition + selectionLength
            };
        }
        //strict format
        else
        {
            let indexes = Object.keys(this._strictDatePartsIndexes).reverse().map(itm => +itm);

            for(let index of indexes)
            {
                if(cursorPosition >= index)
                {
                    return {
                        part: this._strictDatePartsIndexes[index].part,
                        positionFrom: index,
                        positionTo: index + this._strictDatePartsIndexes[index].length
                    };
                }
            }
        }

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
            let lastPart: string|null = null;
            let lastIndex: number = 0;

            for(let x = 0; x < this._format.length; x++)
            {
                //next part
                if(this._format[x] != lastPart)
                {
                    if(x > 0)
                    {
                        this._strictDatePartsIndexes[lastIndex].length = x - lastIndex;
                    }

                    lastIndex = x;
                    lastPart = this._format[x];

                    this._strictDatePartsIndexes[x] =
                    {
                        length: 0,
                        part: this._format[x]
                    };
                }
            }

            this._strictDatePartsIndexes[lastIndex].length = this._format.length - lastIndex;
        }
    }
}