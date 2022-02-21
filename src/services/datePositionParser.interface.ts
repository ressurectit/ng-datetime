/**
 * Parser used for parsing date using provided format and returning positions and selected date part
 */
export interface DatePositionParser
{
    /**
     * Parse date as string and returns information about positions and selected part of date
     * @param date - String date to be parsed
     * @param cursorPosition - Current cursor position
     */
    parse(date: string, cursorPosition: number): DatePositionParserResult;

    /**
     * Parse date as string and returns information about position and selected part of date, while moving it to next part, if it was last part returns null
     * @param date - String date to be parsed
     * @param cursorPosition - Current cursor position
     */
    next(date: string, cursorPosition: number): null|DatePositionParserResult;

    /**
     * Parse date as string and returns information about position and selected part of date, while moving it to previous part, if it was first part returns null
     * @param date - String date to be parsed
     * @param cursorPosition - Current cursor position
     */
    previous(date: string, cursorPosition: number): null|DatePositionParserResult;
}

/**
 * Result of date position parsing
 */
export interface DatePositionParserResult
{
    /**
     * Index of charater where returned part of date starts
     */
    positionFrom: number;

    /**
     * Index of charater where returned part of date ends
     */
    positionTo: number;

    /**
     * Type of part that is selected
     */
    part: string;
}