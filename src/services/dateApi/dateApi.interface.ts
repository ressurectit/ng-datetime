/**
 * Date can be represented as formatted string, timestamp or javascript Date object
 */
export type DateValue = Date|string|number;

/**
 * Definition of type, that is used for creating instance of DateApiObject
 */
export interface DateApiObjectCtor<TObject extends DateApiObject<TDate> = any, TDate = any>
{
    new (value: TDate|DateValue, format?: string, ...additionalParams: any[]): TObject;
}

/**
 * Instance of object wrapping TDate, allowing manipulation with it
 */
export interface DateApiObject<TDate = any>
{
    /**
     * Original value that is not changed unless 'updateOriginal' is called
     */
    readonly originalValue: TDate;

    /**
     * Instance of date
     */
    readonly value: TDate;

    /**
     * Gets indication whether provided instance of date is valid
     */
    isValid(): boolean;

    /**
     * Gets indication whether provided instance of date is weekend day
     */
    isWeekend(): boolean;

    /**
     * Formats date value
     * @param format - Format token used for creating formatted string
     */
    format(format: string): string;

    /**
     * Gets value of date time as unix timestamp
     */
    unixTimestamp(): number;

    /**
     * Updates value to start date and time of current decade
     * @returns Itself for fluent API
     */
    startOfDecade(): DateApiObject<TDate>;

    /**
     * Updates value to end date and time of current decade
     * @returns Itself for fluent API
     */
    endOfDecade(): DateApiObject<TDate>;

    /**
     * Updates value to start date and time of current year
     * @returns Itself for fluent API
     */
    startOfYear(): DateApiObject<TDate>;

    /**
     * Updates value to end date and time of current year
     * @returns Itself for fluent API
     */
    endOfYear(): DateApiObject<TDate>;

    /**
     * Add years, if count not specified adds 1 year
     * @param count - Number of years count
     * @returns Itself for fluent API
     */
    addYears(count?: number): DateApiObject<TDate>;

    /**
     * Subtract years, if count not specified subtract 1 year
     * @param count - Number of years count
     * @returns Itself for fluent API
     */
    subtractYears(count?: number): DateApiObject<TDate>;

    /**
     * Updates value to start date and time of current month
     * @returns Itself for fluent API
     */
    startOfMonth(): DateApiObject<TDate>;

    /**
     * Updates value to end date and time of current month
     * @returns Itself for fluent API
     */
    endOfMonth(): DateApiObject<TDate>;

    /**
     * Add months, if count not specified adds 1 month
     * @param count - Number of months count
     * @returns Itself for fluent API
     */
    addMonths(count?: number): DateApiObject<TDate>;

    /**
     * Subtract months, if count not specified subtract 1 month
     * @param count - Number of months count
     * @returns Itself for fluent API
     */
    subtractMonths(count?: number): DateApiObject<TDate>;

    /**
     * Updates value to start date and time of current week
     * @returns Itself for fluent API
     */
    startOfWeek(): DateApiObject<TDate>;

    /**
     * Updates value to end date and time of current week
     * @returns Itself for fluent API
     */
    endOfWeek(): DateApiObject<TDate>;

    /**
     * Add weeks, if count not specified adds 1 week
     * @param count - Number of weeks count
     * @returns Itself for fluent API
     */
    addWeeks(count?: number): DateApiObject<TDate>;

    /**
     * Subtract weeks, if count not specified subtract 1 week
     * @param count - Number of weeks count
     * @returns Itself for fluent API
     */
    subtractWeeks(count?: number): DateApiObject<TDate>;

    /**
     * Updates value to start date and time of current day
     * @returns Itself for fluent API
     */
    startOfDay(): DateApiObject<TDate>;

    /**
     * Updates value to end date and time of current day
     * @returns Itself for fluent API
     */
    endOfDay(): DateApiObject<TDate>;

    /**
     * Add days, if count not specified adds 1 day
     * @param count - Number of days count
     * @returns Itself for fluent API
     */
    addDays(count?: number): DateApiObject<TDate>;

    /**
     * Subtract days, if count not specified subtract 1 day
     * @param count - Number of days count
     * @returns Itself for fluent API
     */
    subtractDays(count?: number): DateApiObject<TDate>;

    /**
     * Updates value to start date and time of current hour
     * @returns Itself for fluent API
     */
    startOfHour(): DateApiObject<TDate>;

    /**
     * Updates value to end date and time of current hour
     * @returns Itself for fluent API
     */
    endOfHour(): DateApiObject<TDate>;

    /**
     * Add hours, if count not specified adds 1 hour
     * @param count - Number of hours count
     * @returns Itself for fluent API
     */
    addHours(count?: number): DateApiObject<TDate>;

    /**
     * Subtract hours, if count not specified subtract 1 hour
     * @param count - Number of hours count
     * @returns Itself for fluent API
     */
    subtractHours(count?: number): DateApiObject<TDate>;

    /**
     * Updates value to start date and time of current minute
     * @returns Itself for fluent API
     */
    startOfMinute(): DateApiObject<TDate>;

    /**
     * Updates value to end date and time of current minute
     * @returns Itself for fluent API
     */
    endOfMinute(): DateApiObject<TDate>;

    /**
     * Add minutes, if count not specified adds 1 minute
     * @param count - Number of minutes count
     * @returns Itself for fluent API
     */
    addMinutes(count?: number): DateApiObject<TDate>;

    /**
     * Subtract minutes, if count not specified subtract 1 minute
     * @param count - Number of minutes count
     * @returns Itself for fluent API
     */
    subtractMinutes(count?: number): DateApiObject<TDate>;

    /**
     * Gets number of days in month
     */
    daysInMonth(): number;

    /**
     * Gets year
     */
    year(): number;
    /**
     * Sets year
     * @param year - Year to be set
     */
    year(year: number): DateApiObject<TDate>;
    /**
     * Gets or sets year
     * @param year - If specified, sets year
     */
    year(year?: number): DateApiObject<TDate>|number;

    /**
     * Gets month
     */
    month(): number;
    /**
     * Sets month
     * @param month - Month to be set
     */
    month(month: number): DateApiObject<TDate>;
    /**
     * Gets or sets month
     * @param month - If specified, sets month
     */
    month(month?: number): DateApiObject<TDate>|number;

    /**
     * Gets day of month one based
     */
    dayOfMonth(): number;
    /**
     * Sets day of month one based
     * @param day - Day of month to be set
     */
    dayOfMonth(day: number): DateApiObject<TDate>;
    /**
     * Gets or sets day of month one based
     * @param day - If specified, sets day of month
     */
    dayOfMonth(day?: number): DateApiObject<TDate>|number;

    /**
     * Gets day of week zero based, first is monday
     */
    dayOfWeek(): number;
    /**
     * Sets day of week zero based, first is monday
     * @param day - Day of week to be set
     */
    dayOfWeek(day: number): DateApiObject<TDate>;
    /**
     * Gets or sets day of week zero based, first is monday
     * @param day - If specified, sets day of week
     */
    dayOfWeek(day?: number): number|DateApiObject<TDate>;

    /**
     * Gets hours zero based
     */
    hour(): number;
    /**
     * Sets hours zero
     * @param hour - hour to be set
     */
    hour(hour: number): DateApiObject<TDate>;
    /**
     * Gets or sets hours zero
     * @param hour - If specified, sets hour
     */
    hour(hour?: number): DateApiObject<TDate>|number;

    /**
     * Gets minutes zero based
     */
    minute(): number;
    /**
     * Sets minutes zero based
     * @param minute - minutes to be set
     */
    minute(minute: number): DateApiObject<TDate>;
    /**
     * Gets or sets minutes zero based
     * @param minute - If specified, sets minutes
     */
    minute(minute?: number): DateApiObject<TDate>|number;

    /**
     * Gets indication whether current value is before 'date'
     * @param date - Date which is this date compared to
     */
    isBefore(date: TDate): boolean;

    /**
     * Gets indication whether current value is after 'date'
     * @param date - Date which is this date compared to
     */
    isAfter(date: TDate): boolean;

    /**
     * Gets number of days between this and provided date
     * @param date - Date which is used for computation of diff against
     */
    diffDays(date: TDate): number;

    /**
     * Compares whether this date is same week as provided date
     * @param date - Date which is used for comparison of same week
     */
    isSameWeek(date: TDate): boolean;

    /**
     * Compares whether this date is same decade as provided date
     * @param date - Date which is used for comparison of same decade
     */
    isSameDecade(date: TDate): boolean;

    /**
     * Compares whether this date is same year as provided date
     * @param date - Date which is used for comparison of same year
     */
    isSameYear(date: TDate): boolean;

    /**
     * Compares whether this date is same month as provided date
     * @param date - Date which is used for comparison of same month
     */
    isSameMonth(date: TDate): boolean;

    /**
     * Compares whether this date is same day as provided date
     * @param date - Date which is used for comparison of same day
     */
    isSameDay(date: TDate): boolean;

    /**
     * Creates clone of this instance, value and originalValue have same value and are cloned from value
     */
    clone(): DateApiObject<TDate>;

    /**
     * Creates clone of this instance, value and originalValue have same value and are cloned from originalValue
     */
    cloneOriginal(): DateApiObject<TDate>;

    /**
     * Updates originalValue, if value is not provided originalValue is set to value
     * @param value - Value to be set as original, or null (value will be used as value)
     * @returns Itself for fluent API
     */
    updateOriginal(value?: TDate): DateApiObject<TDate>;

    /**
     * Changes value to same value as originalValue
     * @returns Itself for fluent API
     */
    resetOriginal(): DateApiObject<TDate>;
}

/**
 * Date api abstraction, used for obtaining DateApi wrapper object
 */
export interface DateApi<TDate = any, TDateApiObject extends DateApiObject<TDate> = DateApiObject<TDate>>
{
    /**
     * Gets wrapping object used for manipulation
     * @param value - Value to be converted (parsed) and used for manipulation
     * @param format - Format string used for parsing string value
     */
    getValue(value: DateValue|TDate, format?: string): TDateApiObject;

    /**
     * Gets wrapping object used for manipulation instantiated to current date and time
     */
    now(): TDateApiObject;

    /**
     * Gets format string using pseudo format
     * @param pseudoFormat - Pseudo format token, used for obtaining 'date' or 'time' format string
     */
    getFormat(pseudoFormat: string): string;

    /**
     * Gets information
     */
    weekStartsOnMonday(): boolean;

    /**
     * Gets array of weekday names in short format, order of days is dependent on locale
     */
    weekdaysShort(): string[];

    /**
     * Tests whether is value TDate
     * @param value - Value to be tested whether is TDate
     */
    isDate(value: unknown): value is TDate;
}