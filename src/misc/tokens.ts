import {InjectionToken} from '@angular/core';

import {DateApi, FormatProvider} from '../services';

/**
 * Injection token used for obtaining DateApi implementation
 */
export const DATE_API: InjectionToken<DateApi> = new InjectionToken<DateApi>("DATE_API");

/**
 * Injection token used for obtaining FormatProvider implementation
 */
export const FORMAT_PROVIDER: InjectionToken<FormatProvider> = new InjectionToken<FormatProvider>("FORMAT_PROVIDER",
                                                                                                  {
                                                                                                      providedIn: 'root',
                                                                                                      factory: () =>
                                                                                                      {
                                                                                                          return {
                                                                                                              date: 'YYYY-MM-DD',
                                                                                                              dateTime: 'YYYY-MM-DD HH:mm',
                                                                                                              time: 'HH:mm'
                                                                                                          };
                                                                                                      }
                                                                                                  });