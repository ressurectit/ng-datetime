import {DateTimeValue} from '../interfaces';
import {DateApiObject, DateValue} from '../services';

/**
 * Type that represents parsed date value or values in case of range
 */
export type DateTimeObjectValue<TDate = unknown> = DateApiObject<TDate>|[DateApiObject<TDate>|null, DateApiObject<TDate>|null];

/**
 * Type that represents input output types that can be processed by date time
 */
export type DateTimeInputOutputValue<TDate = unknown> = DateValue|DateTimeValue<TDate>|TDate;
