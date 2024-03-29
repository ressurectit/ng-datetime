import {DateApi, DateTimeRelativeParser, FormatProvider} from '@anglr/datetime';
import {DateFnsDateApi, dateFnsDateApiObjectType, DATE_FNS_FORMAT_PROVIDER} from '@anglr/datetime/date-fns';
import {sk} from 'date-fns/locale';

import {dateApiTests} from '../../src/services/dateApi.tests';

function initialize(): DateApi<Date>
{
    const parser: DateTimeRelativeParser<Date> = new class extends DateTimeRelativeParser<Date>
    {
        constructor()
        {
            super(null!);
        }

        public override parse(value: Date): Date
        {
            return value;
        }
    };

    return new DateFnsDateApi({
                                  locale: sk
                              },
                              parser,
                              dateFnsDateApiObjectType);
}

describe('DateFnsDateApi class', () =>
{
    let dateApi: DateApi<Date> = null!;
    let formatProvider: FormatProvider;

    beforeAll(() =>
    {
        dateApi = initialize();
        formatProvider = DATE_FNS_FORMAT_PROVIDER.useFactory();
    });

    test('weekStartsOnMonday method', () =>
    {
        expect(dateApi.weekStartsOnMonday()).toBe(true);
    });

    test('getFormat method => date', () =>
    {
        expect(dateApi.getFormat(formatProvider.date)).toBe('d. M. y');
    });

    test('getFormat method => time', () =>
    {
        expect(dateApi.getFormat(formatProvider.time)).toBe('H:mm');
    });

    test('getFormat method => dateTime', () =>
    {
        expect(dateApi.getFormat(formatProvider.dateTime)).toBe('d. M. y H:mm');
    });

    test('weekdaysShort method', () =>
    {
        expect(dateApi.weekdaysShort()).toEqual(['po', 'ut', 'st', 'št', 'pi', 'so', 'ne']);
    });

    test('isDate method => true', () =>
    {
        expect(dateApi.isDate(new Date())).toBe(true);
    });

    test('isDate method => false', () =>
    {
        expect(dateApi.isDate('not date')).toBe(false);
    });
});

describe('DateFnsDateApiObject class', () =>
{
    let dateApi: DateApi<Date> = null!;

    beforeAll(() =>
    {
        dateApi = initialize();
    });

    dateApiTests(() => dateApi);
});
