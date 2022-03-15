import {DateApi, DateTimeRelativeParser, FormatProvider} from '@anglr/datetime';
import {MomentDateApi, MOMENT_FORMAT_PROVIDER} from '@anglr/datetime/moment';
import moment from 'moment';

import {dateApiTests} from '../../src/services/dateApi.tests';

function initialize(): DateApi<moment.Moment>
{
    moment.locale('sk');

    const parser: DateTimeRelativeParser<moment.Moment> = new class extends DateTimeRelativeParser<moment.Moment>
    {
        constructor()
        {
            super(null!);
        }

        public override parse(value: moment.Moment): moment.Moment
        {
            return value;
        }
    };

    return new MomentDateApi(parser);
}

describe('MomentDateApi class', () =>
{
    let dateApi: DateApi<moment.Moment> = null!;
    let formatProvider: FormatProvider;

    beforeAll(() =>
    {
        dateApi = initialize();
        formatProvider = MOMENT_FORMAT_PROVIDER.useFactory();
    });

    test('weekStartsOnMonday method', () =>
    {
        expect(dateApi.weekStartsOnMonday()).toBe(true);
    });

    test('getFormat method => date', () =>
    {
        expect(dateApi.getFormat(formatProvider.date)).toBe('DD.MM.YYYY');
    });

    test('getFormat method => time', () =>
    {
        expect(dateApi.getFormat(formatProvider.time)).toBe('H:mm');
    });

    test('getFormat method => dateTime', () =>
    {
        expect(dateApi.getFormat(formatProvider.dateTime)).toBe('DD.MM.YYYY H:mm');
    });

    test('weekdaysShort method', () =>
    {
        expect(dateApi.weekdaysShort()).toEqual(['po', 'ut', 'st', 'št', 'pi', 'so', 'ne']);
    });
});

describe('MomentDateApiObject class', () =>
{
    let dateApi: DateApi<moment.Moment> = null!;

    beforeAll(() =>
    {
        dateApi = initialize();
    });

    dateApiTests(() => dateApi);
});
