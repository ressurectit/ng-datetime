import {DateApi} from '../../../src/services/dateApi.interface';
import {FULL_FORMAT_ISO} from '../../constants';

export function dateApiTests<TDate>(dateApi: () => DateApi<TDate>)
{
    it("isValid method => valid", () =>
    {
        let dateApiObj = dateApi().getValue('2020-01-01T06:30:00');

        expect(dateApiObj.isValid()).toBe(true);
    });

    it("isValid method => invalid", () =>
    {
        let dateApiObj = dateApi().getValue('2020-14-02T30:20:20');

        expect(dateApiObj.isValid()).toBe(false);
    });

    it("isWeekend method => saturday", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-27T00:20:20');

        expect(dateApiObj.isWeekend()).toBe(true);
    });

    it("isWeekend method => sunday", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-28T23:20:20');

        expect(dateApiObj.isWeekend()).toBe(true);
    });``

    it("isWeekend method => friday", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-26T23:20:20');

        expect(dateApiObj.isWeekend()).toBe(false);
    });

    it("isWeekend method => monday", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-29T00:20:20');

        expect(dateApiObj.isWeekend()).toBe(false);
    });

    it("format method => full ISO", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20');

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-31=00:20:20');
    });

    it("startOfDecade method => 2020", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').startOfDecade();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2020-01-01=00:00:00');
    });

    it("endOfDecade method => 2029", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').endOfDecade();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2029-12-31=23:59:59');
    });

    it("startOfYear method => 2021", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').startOfYear();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-01-01=00:00:00');
    });

    it("endOfYear method => 2021", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').endOfYear();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-12-31=23:59:59');
    });

    it("addYears method => 2032", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').addYears(11);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2032-03-31=00:20:20');
    });

    it("subtractYears method => 2015", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').subtractYears(6);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2015-03-31=00:20:20');
    });

    it("startOfMonth method => 2020 march", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-25T00:20:20').startOfMonth();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-01=00:00:00');
    });

    it("endOfMonth method => 2021 march", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-25T00:20:20').endOfMonth();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-31=23:59:59');
    });

    it("addMonths method => 2022 january", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-25T00:20:20').addMonths(10);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2022-01-25=00:20:20');
    });

    it("subtractMonths method => 2020 september", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-25T00:20:20').subtractMonths(6);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2020-09-25=00:20:20');
    });

    it("startOfWeek method => 2021 march/april", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').startOfWeek();
    
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-29=00:00:00');
    });
    
    it("endOfWeek method => 2021 march/april", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').endOfWeek();
    
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-04-04=23:59:59');
    });

    it("addWeeks method => 2021 april", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-25T00:20:20').addWeeks(1);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-04-01=00:20:20');
    });

    it("subtractWeeks method => 2021 march", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-25T00:20:20').subtractWeeks(1);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-18=00:20:20');
    });
}