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

    it("format method => full ISO", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').startOfDecade();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2020-01-01=00:00:00');
    });

    it("format method => full ISO", () =>
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

    it("startOfMonth method => 2021 march", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').startOfMonth();
    
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-01=00:00:00');
    });
    
    it("endOfMonth method => 2021 march", () =>
    {
        let dateApiObj = dateApi().getValue('2021-03-31T00:20:20').endOfMonth();
    
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-31=23:59:59');
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
}