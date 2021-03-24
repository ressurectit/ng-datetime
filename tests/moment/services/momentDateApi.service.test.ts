import {DateApi, DateTimeRelativeParser} from '@anglr/datetime';
import {MomentDateApi} from '@anglr/datetime/moment';
import moment from 'moment';

import {dateApiTests} from '../../src/services/dateApi.test';

function initialize(): DateApi<moment.Moment>
{
    moment.locale('sk');

    let parser: DateTimeRelativeParser<moment.Moment> = new class extends DateTimeRelativeParser<moment.Moment>
    {
        constructor()
        {
            super(null!);
        }

        public parse(value: moment.Moment): moment.Moment
        {
            return value;
        }
    };

    return new MomentDateApi(parser);
}

describe("MomentDateApi class", () =>
{
    let dateApi: DateApi<moment.Moment> = null!;

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
    let dateApi: DateApi<moment.Moment> = null!;

    beforeAll(() =>
    {
        dateApi = initialize();
    });

    dateApiTests(() => dateApi);
});
