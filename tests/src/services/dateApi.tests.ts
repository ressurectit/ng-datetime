import {DateApi} from '../../../src/services/dateApi.interface';
import {FULL_FORMAT_ISO} from '../../constants';

export function dateApiTests<TDate>(dateApi: () => DateApi<TDate>)
{
    it('isValid method => valid', () =>
    {
        const dateApiObj = dateApi().getValue('2020-01-01T06:30:00');

        expect(dateApiObj.isValid()).toBe(true);
    });

    it('isValid method => invalid', () =>
    {
        const dateApiObj = dateApi().getValue('2020-14-02T30:20:20');

        expect(dateApiObj.isValid()).toBe(false);
    });

    it('isWeekend method => saturday', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-27T00:20:20');

        expect(dateApiObj.isWeekend()).toBe(true);
    });

    it('isWeekend method => sunday', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-28T23:20:20');

        expect(dateApiObj.isWeekend()).toBe(true);
    });

    it('isWeekend method => friday', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-26T23:20:20');

        expect(dateApiObj.isWeekend()).toBe(false);
    });

    it('isWeekend method => monday', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-29T00:20:20');

        expect(dateApiObj.isWeekend()).toBe(false);
    });

    it('format method => full ISO', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-31T00:20:20');

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-31=00:20:20');
    });

    it('startOfDecade method => 2020', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-31T00:20:20').startOfDecade();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2020-01-01=00:00:00');
    });

    it('endOfDecade method => 2029', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-31T00:20:20').endOfDecade();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2029-12-31=23:59:59');
    });

    it('startOfYear method => 2021', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-31T00:20:20').startOfYear();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-01-01=00:00:00');
    });

    it('endOfYear method => 2021', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-31T00:20:20').endOfYear();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-12-31=23:59:59');
    });

    it('addYears method => 2032', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-31T00:20:20').addYears(11);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2032-03-31=00:20:20');
    });

    it('subtractYears method => 2015', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-31T00:20:20').subtractYears(6);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2015-03-31=00:20:20');
    });

    it('startOfMonth method => 2020 march', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').startOfMonth();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-01=00:00:00');
    });

    it('endOfMonth method => 2021 march', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').endOfMonth();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-31=23:59:59');
    });

    it('addMonths method => 2022 january', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').addMonths(10);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2022-01-25=00:20:20');
    });

    it('subtractMonths method => 2020 september', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').subtractMonths(6);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2020-09-25=00:20:20');
    });

    it('startOfWeek method => 2021 march/april', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-31T00:20:20').startOfWeek();
    
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-29=00:00:00');
    });
    
    it('endOfWeek method => 2021 march/april', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-31T00:20:20').endOfWeek();
    
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-04-04=23:59:59');
    });

    it('addWeeks method => 2021 april', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').addWeeks(1);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-04-01=00:20:20');
    });

    it('subtractWeeks method => 2021 march', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').subtractWeeks(1);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-18=00:20:20');
    });

    it('startOfDay method => 2021 march 25th', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').startOfDay();
    
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-25=00:00:00');
    });
    
    it('endOfDay method => 2021 march 25th', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').endOfDay();
    
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-25=23:59:59');
    });

    it('addDays method => 2021 april 10', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').addDays(16);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-04-10=00:20:20');
    });

    it('subtractDays method => 2021 february 25', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20').subtractDays(28);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-02-25=00:20:20');
    });

    it('daysInMonth method => 2021 march', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-25T00:20:20');

        expect(dateApiObj.daysInMonth()).toBe(31);
    });

    it('daysInMonth method => 2021 february', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-25T00:20:20');

        expect(dateApiObj.daysInMonth()).toBe(28);
    });

    it('year method => get/set', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-25T00:20:20');

        expect(dateApiObj.year()).toBe(2021);

        dateApiObj.year(2030);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2030-02-25=00:20:20');
    });

    it('month method => get/set', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-25T00:20:20');

        expect(dateApiObj.month()).toBe(1);

        dateApiObj.month(9);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-10-25=00:20:20');
    });

    it('dayOfMonth method => get/set', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-25T00:20:20');

        expect(dateApiObj.dayOfMonth()).toBe(25);

        dateApiObj.dayOfMonth(10);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-02-10=00:20:20');
    });

    it('dayOfWeek method => get/set', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-25T00:20:20');

        expect(dateApiObj.dayOfWeek()).toBe(3);

        dateApiObj.dayOfWeek(0);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-02-22=00:20:20');
    });

    it('isBefore method => valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-25T00:20:20');

        expect(dateApi().getValue('2021-02-25T00:19:20').isBefore(dateApiObj.value)).toBe(true);
    });

    it('isBefore method => invalid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-25T00:20:20');

        expect(dateApi().getValue('2021-02-25T00:20:21').isBefore(dateApiObj.value)).toBe(false);
    });

    it('isAfter method => valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-25T00:19:20');

        expect(dateApi().getValue('2021-02-25T00:20:20').isAfter(dateApiObj.value)).toBe(true);
    });

    it('isAfter method => invalid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-25T00:20:21');

        expect(dateApi().getValue('2021-02-25T00:20:20').isAfter(dateApiObj.value)).toBe(false);
    });

    it('diffDays method => more than whole day', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-20T12:00:00');

        expect(dateApi().getValue('2021-02-25T18:00:00').diffDays(dateApiObj.value)).toBe(5);
    });

    it('diffDays method => less than whole day', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-20T12:00:00');

        expect(dateApi().getValue('2021-02-25T06:00:00').diffDays(dateApiObj.value)).toBe(5);
    });

    it('diffDays method => almost next day', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-20T02:00:00');

        expect(dateApi().getValue('2021-02-25T22:00:00').diffDays(dateApiObj.value)).toBe(5);
    });

    it('diffDays method => overflowing next day', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-20T12:00:00');

        expect(dateApi().getValue('2021-02-26T11:00:00').diffDays(dateApiObj.value)).toBe(6);
    });

    it('diffDays method => half way', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-20T12:00:00');

        expect(dateApi().getValue('2021-02-26T00:00:00').diffDays(dateApiObj.value)).toBe(6);
    });

    it('isSameWeek method => start valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-22T12:00:00');

        expect(dateApi().getValue('2021-03-25T00:00:00').isSameWeek(dateApiObj.value)).toBe(true);
    });

    it('isSameWeek method => end valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-28T12:00:00');

        expect(dateApi().getValue('2021-03-25T00:00:00').isSameWeek(dateApiObj.value)).toBe(true);
    });

    it('isSameWeek method => middle valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-26T12:00:00');

        expect(dateApi().getValue('2021-03-25T00:00:00').isSameWeek(dateApiObj.value)).toBe(true);
    });

    it('isSameWeek method => invalid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-21T12:00:00');

        expect(dateApi().getValue('2021-03-25T00:00:00').isSameWeek(dateApiObj.value)).toBe(false);
    });

    it('isSameDecade method => valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-21T12:00:00');

        expect(dateApi().getValue('2029-12-25T00:00:00').isSameDecade(dateApiObj.value)).toBe(true);
    });

    it('isSameDecade method => invalid', () =>
    {
        const dateApiObj = dateApi().getValue('2019-12-21T12:00:00');

        expect(dateApi().getValue('2029-12-25T00:00:00').isSameDecade(dateApiObj.value)).toBe(false);
    });

    it('isSameYear method => valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-22T12:00:00');

        expect(dateApi().getValue('2021-12-25T00:00:00').isSameYear(dateApiObj.value)).toBe(true);
    });

    it('isSameYear method => invalid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-22T12:00:00');

        expect(dateApi().getValue('2020-12-25T00:00:00').isSameYear(dateApiObj.value)).toBe(false);
    });

    it('isSameMonth method => valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-22T12:00:00');

        expect(dateApi().getValue('2021-02-02T00:00:00').isSameMonth(dateApiObj.value)).toBe(true);
    });

    it('isSameMonth method => invalid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-22T12:00:00');

        expect(dateApi().getValue('2021-02-02T00:00:00').isSameMonth(dateApiObj.value)).toBe(false);
    });

    it('isSameDay method => valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-22T23:59:59');

        expect(dateApi().getValue('2021-03-22T00:00:00').isSameDay(dateApiObj.value)).toBe(true);
    });

    it('isSameDay method => invalid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-03-22T23:59:59');

        expect(dateApi().getValue('2021-03-23T00:00:00').isSameDay(dateApiObj.value)).toBe(false);
    });

    it('clone method => valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-22T23:59:59');
        dateApiObj.addMonths(1);
        const dateApiCloneObj = dateApiObj.clone();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe(dateApiCloneObj.format(FULL_FORMAT_ISO));
        
        dateApiCloneObj.addMonths(1);
        
        expect(dateApiObj.format(FULL_FORMAT_ISO)).not.toBe(dateApiCloneObj.format(FULL_FORMAT_ISO));
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-22=23:59:59');
        expect(dateApiCloneObj.format(FULL_FORMAT_ISO)).toBe('2021-04-22=23:59:59');
    });

    it('cloneOriginal method => valid', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-22T23:59:59');
        dateApiObj.addMonths(1);
        const dateApiCloneObj = dateApiObj.cloneOriginal();

        expect(dateApiObj.format(FULL_FORMAT_ISO)).not.toBe(dateApiCloneObj.format(FULL_FORMAT_ISO));
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-22=23:59:59');
        expect(dateApiCloneObj.format(FULL_FORMAT_ISO)).toBe('2021-02-22=23:59:59');
    });

    it('updateOriginal method => value to original', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-22T23:59:59');
        dateApiObj.addMonths(1);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-22=23:59:59');
        expect(dateApi().getValue(dateApiObj.originalValue).format(FULL_FORMAT_ISO)).toBe('2021-02-22=23:59:59');
        
        dateApiObj.updateOriginal();
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-22=23:59:59');
        expect(dateApi().getValue(dateApiObj.originalValue).format(FULL_FORMAT_ISO)).toBe('2021-03-22=23:59:59');
    });

    it('updateOriginal method => date to original', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-22T23:59:59');
        dateApiObj.addMonths(1);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-22=23:59:59');
        expect(dateApi().getValue(dateApiObj.originalValue).format(FULL_FORMAT_ISO)).toBe('2021-02-22=23:59:59');
        
        dateApiObj.updateOriginal(dateApi().getValue('2020-03-10T12:00:00').value);
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2020-03-10=12:00:00');
        expect(dateApi().getValue(dateApiObj.originalValue).format(FULL_FORMAT_ISO)).toBe('2020-03-10=12:00:00');
    });

    it('resetOriginal method => original to value', () =>
    {
        const dateApiObj = dateApi().getValue('2021-02-22T23:59:59');
        dateApiObj.addMonths(1);

        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-03-22=23:59:59');
        expect(dateApi().getValue(dateApiObj.originalValue).format(FULL_FORMAT_ISO)).toBe('2021-02-22=23:59:59');
        
        dateApiObj.resetOriginal();
        expect(dateApiObj.format(FULL_FORMAT_ISO)).toBe('2021-02-22=23:59:59');
        expect(dateApi().getValue(dateApiObj.originalValue).format(FULL_FORMAT_ISO)).toBe('2021-02-22=23:59:59');
    });
}