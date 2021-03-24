import {DateApi, DateTimeRelativeParser} from '@anglr/datetime';
import {DateFnsDateApi} from '@anglr/datetime/date-fns';
import {sk} from 'date-fns/locale';

import {dateApiTests} from '../../src/services/dateApi.test';

function initialize(): DateApi<Date>
{
    let parser: DateTimeRelativeParser<Date> = new class extends DateTimeRelativeParser<Date>
    {
        constructor()
        {
            super(null!);
        }

        public parse(value: Date): Date
        {
            return value;
        }
    };

    return new DateFnsDateApi({
                                  locale: sk
                              },
                              parser);
}

describe("DateFnsDateApi class", () =>
{
    let dateApi: DateApi<Date> = null!;

    beforeAll(() =>
    {
        dateApi = initialize();
    });

    it("weekStartsOnMonday method", () =>
    {
        expect(dateApi.weekStartsOnMonday()).toBe(true);
    });

    it('weekdaysShort method', () =>
    {
        expect(dateApi.weekdaysShort()).toEqual(['po', 'ut', 'st', 'št', 'pi', 'so', 'ne']);
    });
});

describe("MomentDateApiObject class", () =>
{
    let dateApi: DateApi<Date> = null!;

    beforeAll(() =>
    {
        dateApi = initialize();
    });

    
    dateApiTests(() => dateApi);
});
