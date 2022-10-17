import {InjectionToken} from '@angular/core';

import {DateTimeInput, FormatProvider} from '../interfaces';
import {DateApi, DateApiObjectCtor} from '../services';

/**
 * Injection token used for injecting type that creates instance of DateApiObject
 */
export const DATE_API_OBJECT_TYPE: InjectionToken<DateApiObjectCtor> = new InjectionToken<DateApiObjectCtor>('DATE_API_OBJECT_TYPE');

/**
 * Injection token used for injecting type that represents date time input
 */
export const DATE_TIME_INPUT: InjectionToken<DateTimeInput> = new InjectionToken<DateTimeInput>('DATE_TIME_INPUT');

/**
 * Injection token used for obtaining DateApi implementation
 */
export const DATE_API: InjectionToken<DateApi> = new InjectionToken<DateApi>('DATE_API');

/**
 * Injection token used for obtaining FormatProvider implementation
 */
export const FORMAT_PROVIDER: InjectionToken<FormatProvider> = new InjectionToken<FormatProvider>('FORMAT_PROVIDER',
                                                                                                  {
                                                                                                      providedIn: 'root',
                                                                                                      factory: () =>
                                                                                                      {
                                                                                                          return {
                                                                                                              date: 'yyyy-MM-dd',
                                                                                                              dateTime: 'yyyy-MM-dd HH:mm',
                                                                                                              time: 'HH:mm',
                                                                                                              year: 'yyyy',
                                                                                                              month: 'MM',
                                                                                                              week: 'ww',
                                                                                                              day: 'dd',
                                                                                                              hour: 'HH',
                                                                                                              minute: 'mm',
                                                                                                              second: 'ss',
                                                                                                              dayName: 'cccc',
                                                                                                              dayNameShort: 'cccccc',
                                                                                                              monthName: 'LLLL',
                                                                                                              monthNameShort: 'LLL'
                                                                                                          };
                                                                                                      }
                                                                                                  });