import {Locale} from 'date-fns';

/**
 * Date FNS locale service, used for obtaining locale
 */
export interface DateFnsLocale
{
    /**
     * Gets current active locale for date fns
     */
    readonly locale: Locale;
}