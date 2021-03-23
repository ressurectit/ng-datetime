import {DateApi, DateTimeRelativeParser} from '@anglr/datetime';
import {MomentDateApi} from '@anglr/datetime/moment';
import moment from 'moment';

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

    it("isValid method => valid", () =>
    {
        let dateApiObj = dateApi.getValue('2020-01-01T06:30:00');

        expect(dateApiObj.isValid()).toBe(true);
    });

    it("isValid method => invalid", () =>
    {
        let dateApiObj = dateApi.getValue('2020-14-02T30:20:20');

        expect(dateApiObj.isValid()).toBe(false);
    });

    it("isWeekend method => saturday", () =>
    {
        let dateApiObj = dateApi.getValue('2021-03-27T00:20:20');

        expect(dateApiObj.isWeekend()).toBe(true);
    });

    it("isWeekend method => sunday", () =>
    {
        let dateApiObj = dateApi.getValue('2021-03-28T23:20:20');

        expect(dateApiObj.isWeekend()).toBe(true);
    });``

    it("isWeekend method => friday", () =>
    {
        let dateApiObj = dateApi.getValue('2021-03-26T23:20:20');

        expect(dateApiObj.isWeekend()).toBe(false);
    });

    it("isWeekend method => monday", () =>
    {
        let dateApiObj = dateApi.getValue('2021-03-29T00:20:20');

        expect(dateApiObj.isWeekend()).toBe(false);
    });
});
