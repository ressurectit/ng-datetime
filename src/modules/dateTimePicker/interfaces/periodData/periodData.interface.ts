import {DateApiObject} from '../../../../services';

/**
 * Data that represents data for any picker type
 */
export interface PeriodData<TDate = unknown>
{
    /**
     * Indication that this period item is active and selected
     */
    active: boolean;

    /**
     * Indication that this period item is disabled
     */
    disabled: boolean;

    /**
     * Date for this period item
     */
    date: TDate;

    /**
     * Date for this period item as date api object
     */
    dateObj: DateApiObject<TDate>;
}

/**
 * Data that represents day in date picker
 */
export interface DayData<TDate = unknown> extends PeriodData<TDate>
{

    /**
     * Indication that this day is out of currently selected month
     */
    otherMonth: boolean;

    /**
     * Indication that this day is today
     */
    today: boolean;

    /**
     * Indication that this day is weekend day
     */
    weekend: boolean;

    /**
     * Day number of month
     */
    day: number;
}

/**
 * Data that represents month in date picker
 */
export interface MonthData<TDate = unknown> extends PeriodData<TDate>
{
    /**
     * Name of month
     */
    name: string;
}

/**
 * Data that represents year in date picker
 */
export interface YearData<TDate = unknown> extends PeriodData<TDate>
{
    /**
     * Value of year
     */
    value: number;
}