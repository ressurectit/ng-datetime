# Changelog

## Version 9.0.0 (2025-01-23)

### Bug Fixes

- fixed `DateConvertPipe` pipe
    - fixed typings, now correctly accepts also `undefined` and `null`
    - works as pre date-fns 4, which returns `null` value for `null` or `undefined` input value
- fixed `DateFormatPipe` pipe
    - fixed typings, now correctly accepts also `undefined` and `null`
    - works as pre date-fns 4, which returns empty string value for `null` or `undefined` input value

### Features

- new `IsAfterPipe` pipe, that tests whether is provided date after tested date
- new `IsBeforePipe` pipe, that tests whether is provided date before tested date
- updated `DateApiObject` interface
    - **new methods**
        - `timestamp` gets value of date time as timestamp (in miliseconds)
- updated `DateApi` interface
    - `weekdaysShort` method is now *deprecated*
    - new `weekdays` method, which gets array of weekday names, order of days is dependent on locale
- updated `DateTimeControlValueAccessorDirective` directive
    - now it can return also value as `DateTimeValueFormat.UnixTimestamp`
- updated `DateFormatPipe` pipe
    - is now `standalone`
- updated `DateConvertPipe` pipe
    - is now `standalone`
- updated `MonthCalendarComponent` component
    - is now `standalone`
- updated `CalendarDayTemplateDirective` directive
    - is now `standalone`
- updated `DateTimePickerComponent` directive
    - is now `standalone`
- *subpackage* `@anglr/datetime/moment`
    - updated `MomentDateApi`
        - now implements also new `timestamp`
    - updated `MomentDateApi`
        - now implements new `weekdays`
- *subpackage* `@anglr/datetime/date-fns`
    - updated `DateFnsDateApi`
        - now implements also new `timestamp`
    - updated `DateFnsDateApi`
        - now implements new `weekdays`

### BREAKING CHANGES

- minimal supported version of `@angular` is `19.1.0`
- minimal supported version of `@jscrpt/common` is `7.0.0`
- minimal supported version of `@anglr/common` is `22.0.0`
- minimal supported version of `date-fns` is `4.1.0`
- minimal supported version of `moment` is `2.30.1`
- minimal supported version of `tslib` is `2.8.1`
- updated all comments, fixed *unix timestamp* for *timestamp*
- updated `DateTimeValueFormat` enum
    - `UnixTimestamp` now returns value in seconds, use `Timestamp` to get value in miliseconds
- renamed `ButtonDateTimeInputSADirective` to `ButtonDateTimeInputDirective`
- renamed `DatePickerInputSADirective` to `DatePickerInputDirective`
- renamed `DateTimeInputHandlerSADirective` to `DateTimeInputHandlerDirective`
- renamed `DateTimePickerInputSADirective` to `DateTimePickerInputDirective`
- renamed `SimpleDatePickerInputSADirective` to `SimpleDatePickerInputDirective`
- renamed `SimpleDateTimeInputHandlerSADirective` to `SimpleDateTimeInputHandlerDirective`
- renamed `SimpleDateTimePickerInputSADirective` to `SimpleDateTimePickerInputDirective`
- renamed `WithNowSADirective` to `WithNowDirective`
- renamed `WithTimeSADirective` to `WithTimeDirective`
- renamed `WithTodaySADirective` to `WithTodayDirective`
- renamed `DateTimeSADirective` to `DateTimeDirective`
- renamed `DateTimeControlValueAccessorSADirective` to `DateTimeControlValueAccessorDirective`
- renamed `DateTimeInputSADirective` to `DateTimeInputDirective`
- renamed `DateTimeMaxValidatorSADirective` to `DateTimeMaxValidatorDirective`
- renamed `DateTimeValidatorSADirective` to `DateTimeValidatorDirective`
- renamed `DayPickerSAComponent` to `DayPickerComponent`
- renamed `MonthPickerSAComponent` to `MonthPickerComponent`
- renamed `RollerTimePickerSAComponent` to `RollerTimePickerComponent`
- renamed `YearPickerSAComponent` to `YearPickerComponent`
- renamed `DateTimePickerSADirective` to `DateTimePickerDirective`
- renamed `LoopScrollDataSADirective` to `LoopScrollDataDirective`
- renamed `LoopScrollSADirective` to `LoopScrollDirective`

## Version 8.1.0 (2024-08-27)

### Bug Fixes

- fixed `DateTimeSADirective` directive, now handles initial set of value from `ControlValueAccessor` after initialization of this directive, which now correctly applies min/max restrictions

### Features

- updated `DateTimeInputValue` interface
    - **new properties**
        - `valueSet` occurs when value is set, occurs everytime when value was set, even from code
- updated `DateTimeBase` class
    - now correctly implements updated `DateTimeInputValue` interface
- updated `DateTimePickerComponent` component
    - now correctly implements updated `DateTimeInputValue` interface
    - now correctly calls `valueSet` anytime value changes
- updated `ButtonDateTimeInputSADirective` directive
    - now correctly calls `valueSet` anytime value changes
- updated `DateTimeInputSADirective` directive
    - now correctly calls `valueSet` anytime value changes

## Version 8.0.3 (2024-08-21)

### Bug Fixes

- fixed bug with entering invalid value as user input, when error is thrown

## Version 8.0.2 (2024-07-04)

### Bug Fixes

- fixed bug with using *datetime* value format `UnixTimestamp`, incorrectly returned value as *DateTime*

## Version 8.0.1 (2024-07-04)

### Bug Fixes

- fixed bug with parsing user input for `DataString` value format

## Version 8.0.0 (2024-01-25)

### Features

- updated `DateTimeValueFormat` enum
    - new value `DataString` formatted date as string value, custom string format for date time value, different from displayed string format
- updated `DateTimeSADirective` directive
    - **new inputs**
        - `dataFormat` represents data format that is used as value of date time when `DateTimeValueFormat.DataString` is set to `valueFormat`
- updated `DateTimeValidationArgs` interface
    - **new properties**
        - `dataFormat` format of data string value
- updated `DateTime` decorator
    - **new arguments**
        - `dataFormat` format of data string value

### BREAKING CHANGES

- minimal supported version of `NodeJs` is `18.13`
- minimal supported version of `@angular` is `17.0.1`
- minimal supported version of `@jscrpt/common` is `6.0.0`
- minimal supported version of `@anglr/common` is `19.0.0`
- minimal supported version of `tslib` is `2.6.2`
- updated `parseDateTime` function, has new argument
    - `dataFormat` string format for parsing string dates, required only for string dates, has higher priority than `stringFormat`
- updated `formatDateTime` function, has new argument
    - `dataFormat` string format for formatting string dates, required only for string dates, has higher priority than `stringFormat`
- updated `datetimeMaxValidator` validator function, has new argument
    - `dataFormat` optional string data format of value
- updated `datetimeMinValidator` validator function, has new argument
    - `dataFormat` optional string data format of value
- updated `datetimeValidator` validator function, has new argument
    - `dataFormat` optional string data format of value

## Version 7.0.0 (2023-08-17)

### Features

- new `ButtonDateTimeInputSADirective` directive, that is used for setting up date time input for button
    - **extends** `DateTimeBase`
    - **implements**
        - `DateTimeInput`
        - `OnDestroy`
    - **inputs**
        - `value` current value of date time, could be string, unix timestamp, Date, TDate object, or ranged DateTimeValue
    - **properties**
        - `rawValue` value of date time, raw string value which is visible to user
        - `disabled` indication whether is date time disabled1
        - `element` html element that represents input itself
        - `focus` occurs when input gains focus
        - `blur` occurs when input loses focus
- updated `DateTimePickerDirectiveOptions` interface
    - new **properties**
        - `targetElement` string that defines element in which should be picker rendered, if not specified, body is used, working only with `absolute` set to `true`

### BREAKING CHANGES

- minimal supported version of `@angular` is `16.0.3`
- minimal supported version of `@anglr/common` is `17.0.0`
- minimal supported version of `@jscrpt/common` is `4.0.0`
- minimal supported version of `@rxjs` is `7.5.7`
- minimal supported version of `date-fns` is `2.30.0`
- minimal supported version of `tslib` is `2.6.1`
- dropped support of `NodeJs` lower than `16.14`

## Version 6.1.0 (2023-01-04)

### Bug Fixes

- fixed `WithTodaySADirective`
    - now correctly sets value of date time to start of a current day

### Features

- new `WithNowSADirective` directive, that sets current date and time as day and time for empty date time on focus
- new `DateTimeInputHandlerSADirective` directive, that adds handler for date time input, which allows navigation using keyboard and checking restriction of value
- new `DatePickerInputSADirective` directive, that combines date picker with date input
- new `DateTimePickerInputSADirective` directive, that combines date time picker with date time input
- new `parseRawInput` function, that parses raw value into internal value and value
- new `getInternalValue` function, gets internal value and fix lowest time difference
- updated `DateTimeSADirective` directive
    - **new properties**
        - `customFormatChanges` occurs when there are changes in custom format value

## Version 6.0.0 (2022-12-23)

### Features

- new `DateObject` type, that represents date object, either as date api or plain
- new `EventParser` service, that is used for parsing events into events to requested period
    - **methods**
        - `getEventsPerDay` gets events parsed per day
- new `MonthCalendarComponent` component, that is used for displaying month calendar
    - **implements**
        - `OnInit`
        - `OnChanges`
    - **inputs**
        - `showWeekNumber` indication that week number should be displayed
        - `display` date that should be displayed in month calendar
        - `weekDayName` format for displaying week day names
        - `dayAspectRatio` aspect ratio for displayed calendar day cell
        - `events` array of events that should be displayed
    - **content children**
        - **child** `CalendarDayTemplateDirective`
- new `CalendarDayTemplateContext` interface, that is context passed to template of calendar day
    - **properties**
        - `$implicit` data that are used for displaying calendar day
- new `CalendarDayTemplateDirective` directive, that is used for obtaining custom calendar day template
    - **properties**
        - `template` template obtained by this structural directive
- new `MonthCalendarModule` module, that is used for calendar displaying month
    - **exports**
        - `MonthCalendarComponent`
        - `CalendarDayTemplateDirective`
- new `SimpleDatePickerInputSADirective` directive, that combines date picker with simple date input
- new `SimpleDateTimePickerInputSADirective` directive, that combines date time picker with simple date time input
- new `SimpleDateTimeInputHandlerSADirective` directive, that adds simple handler for date time input, which allows simple navigation using keyboard
- new `CalendarDayAspectRatio` enum, that represents available aspect ratios for displaying calendar days
    - `OneToOne` aspect ratio of width to height is 1:1 (square)
    - `ThreeToTwo` aspect ratio of width to height is 3:2
    - `FourToThree` aspect ratio of width to height is 4:3
    - `SixteenToTen` aspect ratio of width to height is 16:10
    - `SixteenToNine` aspect ratio of width to height is 16:9
- new `MonthCalendarDayFormat` enum, that represents available day formats for calendar day
    - `None` no week day name displayed
    - `Short` short version of week day name
    - `Full` full version of week day name
- new `CalendarDayData` interface, that represents data for day for calendar
    - **properties**
        - `events` thin array of events array for day
        - `date` date of day
        - `day` number of day of month
        - `isWeekend` indication whether is this day weekend day
        - `isCurrentMonth` indication whether is this day for currently displayed month
        - `week` week number of year for day
- new `CalendarEventDayMetadata` interface, that represents event metadata for day
    - **extends**
        - `EventData`
        - `WithDateApiFromTo`
    - **properties**
        - `allDay` indication whether is event all day event
        - `onGoingFrom` indication that event is ongoing from previous date
        - `onGoingTo` indication that event is ongoing to next date
- new `EventData` interface, that represents data for event that are passed to calendar
    - **properties**
        - `data` data for event
        - `dateFrom` date when event starts
        - `dateTo` date when event ends
- new `WithDateApiFromTo` interface, that represents object that holds date api object for dateFrom and dateTo
    - **properties**
        - `dateApiFrom` date api for date when event starts
        - `dateApiTo` date api for date when event ends
- updated `DateApiObject` interface
    - new `isSame` method which, compares whether is date same as provided date
    - new `formatISO` method which, formats date value as ISO string representation
    - all following methods now accepts `DateObject<TDate>` instead of just `TDate` as argument
        - `isBefore`
        - `isAfter`
        - `diffDays`
        - `isSameWeek`
        - `isSameDecade`
        - `isSameYear`
        - `isSameMonth`
        - `isSameDay`
- updated `DateTimeSADirective` directive
    - now is standalone directive
- updated `DateTimeControlValueAccessorSADirective` directive
    - now is standalone directive
- updated `DateTimeInputSADirective` directive
    - now is standalone directive
- updated `DateTimeMaxValidatorSADirective` directive
    - now is standalone directive
- updated `DateTimeMinValidatorSADirective` directive
    - now is standalone directive
- updated `DateTimeValidatorSADirective` directive
    - now is standalone directive
- updated `DateTimePickerSADirective` directive
    - now is standalone directive
- *subpackage* `@anglr/datetime/moment`
    - updated `MomentDateApi`
        - now implements also new `isSame` and `formatISO` methods, and supports new `DateObject<TDate>` argument
- *subpackage* `@anglr/datetime/date-fns`
    - updated `DateFnsDateApi`
        - now implements also new `isSame` and `formatISO` methods, and supports new `DateObject<TDate>` argument

### BREAKING CHANGES

- updated minimal version requirements for `Node.js` (`14.20.0` or `16.13.0` or `18.10.0`)
- minimal supported version of `@angular` is now `15.0.4`
- minimal supported version of `@jscrpt/common` is now `3.3.0`
- minimal supported version of `@anglr/common` is now `15.0.1`
- minimal supported version of `tslib` is now `2.4.1`
- removed old stylings and themes
- most of generic default `any` replaced by `unknown`
- updated `DateApiObjectCtor` interface
    - switched order of generic arguments
- renamed `DateTimeDirective` to `DateTimeSADirective` directive
- renamed `DateTimeControlValueAccessorDirective` to `DateTimeControlValueAccessorSADirective` directive
- renamed `DateTimeInputDirective` to `DateTimeInputSADirective` directive
- renamed `DateTimeMaxValidatorDirective` to `DateTimeMaxValidatorSADirective` directive
- renamed `DateTimeMinValidatorDirective` to `DateTimeMinValidatorSADirective` directive
- renamed `DateTimeValidatorDirective` to `DateTimeValidatorSADirective` directive
- renamed `DateTimePickerDirective` to `DateTimePickerSADirective` directive
- renamed `LoopScrollDataDirective` to `LoopScrollDataSADirective` directive
- renamed `LoopScrollDirective` to `LoopScrollSADirective` directive
- removed `PickerBaseComponent` legacy component
- removed `PickerImplBaseComponent` legacy component
- removed `DateTimeDayPickerComponent` legacy component
- removed `DayPickerCssClasses` legacy interface
- removed `DateTimeMonthPickerComponent` legacy component
- removed `MonthPickerCssClasses` legacy interface
- removed `scaleUpDownTrigger` legacy animation
- removed `DateTimePickerLegacyComponent` legacy component
- removed `DateTimeRollerTimePickerComponent` legacy component
- removed `RollerTimePickerCssClasses` legacy interface
- removed `YearPickerCssClasses` legacy component
- removed `CommonPickerCssClasses` legacy interface
- removed `DateTimePickerCssClasses` legacy interface
- removed `DateTimePickerLegacyOptions` legacy interface
- removed `DateTimeLegacyPicker` legacy interface
- removed `DATE_TIME_PICKER_CONFIGURATION` legacy token
- removed `DateTimeLegacyPickerModule` legacy module
- removed `enterLeaveAnimateChildTrigger` legacy animation
- removed `DateTimeSelectorComponent` legacy component
- removed `DatetimeMaxValidatorDirective` legacy directive
- removed `DatetimeMinValidatorDirective` legacy directive
- removed `DateTimePickerRendererDirective` legacy directive
- removed `DatetimeValidatorDirective` legacy directive
- removed `DateTimeSelectorControlValueAccessor` legacy directive
- removed `DateTimeSelectorOptions` legacy interface
- removed `DateTimeSelector` legacy interface
- removed `DATE_TIME_SELECTOR_CONFIGURATION` legacy token
- removed `DateTimeBasicSelectorModule` legacy module
- removed `DateTimeSelectorModule` legacy module
- removed `maxDatetime` legacy validator function
- removed `minDatetime` legacy validator function
- removed `datetime` legacy validator function
- removed `Validators` legacy validators class
- removed `DateTimeValueObject` legacy interface

## Version 5.0.0 (2022-10-21)

### Features

- new `DateTimeInputValue` interface, which defines date time input value API
    - **properties**
        - `value` current value of date time, could be string, unix timestamp, Date, TDate object, or ranged DateTimeValue
        - `valueChange` occurs when value changes
- new `DateTimeInput` interface, which defines date time input and communication API for it
    - **extends**
        - `DateTimeInputValue`
    - **properties**
        - `rawValue` value of date time, raw string value which is visible to user
        - `disabled` indication whether is date time disabled
        - `focus` occurs when input gains focus
        - `blur` occurs when input loses focus
        - `element` html element that represents input itself
- new `DateTimeModule` module for basic date time directives, components, pipes
    - **exports**
        - `DateTimeDirective,`
        - `DateTimeControlValueAccessorDirective`
        - `DateTimeInputDirective`
        - `DateTimeMaxValidatorDirective`
        - `DateTimeMinValidatorDirective`
        - `DateTimeValidatorDirective`
- new `DATE_TIME_INPUT` injection token, that is used for injecting type that represents date time input
- new `DateTimeBase` class, that is base class for date time directives, contains basic shared data
    - **implements**
        - `DateTimeInputValue`
        - `OnDestroy`
- new `DateTimeInputDirective` directive, that is used for setting up date time input
    - **extends** `DateTimeBase`
    - **implements**
        - `DateTimeInput`
        - `OnDestroy`
    - **provides**
        - `DATE_TIME_INPUT` providing self
- new `DateTimeControlValueAccessorDirective` directive, that is control value accessor that is used for getting and setting value for date time
    - **implements**
        - `ControlValueAccessor`
        - `OnDestroy`
    - **provides**
        - `NG_VALUE_ACCESSOR` providing self
- new `DateTimeValidatorDirective` directive, that applies validator for date time
    - **extends** `DateTimeBase`
    - **implements**
        - `Validator`
        - `OnInit`
    - **provides**
        - `NG_VALIDATORS` providing self
- new `DateTimeMaxValidatorDirective` directive, that applies validator for date time max value
    - **extends** `DateTimeBase`
    - **implements**
        - `Validator`
        - `OnInit`
    - **provides**
        - `NG_VALIDATORS` providing self
- new `DateTimeMinValidatorDirective` directive, that applies validator for date time min value
    - **extends** `DateTimeBase`
    - **implements**
        - `Validator`
        - `OnInit`
    - **provides**
        - `NG_VALIDATORS` providing self
- new `DateTimeValueFormat` enum, that represents available formats for date time value
    - `DateInstance` instance of date
    - `UnixTimestamp` numeric unix timestamp in miliseconds
    - `FormattedString` formatted date as string value
    - `RangeOfDateInstances` range of date instances from, to
- new `DateTimeObjectValue` type that represents parsed date value or values in case of range
- new `DateTimeInputOutputValue` type that represents input output types that can be processed by date time
- new `parseDateTime` function, that parses date time input output value
- new `formatDateTime` function, that formats value into specified format of date time
- new `isDateTimeValue` function, that tests whether value is `DateTimeValue`
- new `getSingleDateTimeValue` function, that gets single date time value, use in places where ranged date time can not be used
- new `datetimeValidator` function, that is date time validator factory function, creates validator for checking validity of datetime
- new `datetimeMaxValidator` function, that is date time validator factory function, creates validator for checking validity of datetime max value
- new `datetimeMinValidator` function, that is date time validator factory function, creates validator for checking validity of datetime min value
- new `DateTimeValidationArgs` interface, that represents validations arguments for date time validators for model based forms
    - **properties**
        - `valueFormat` format of validated value
        - `stringFormat` format of string value
        - `maxValue` max allowed value
        - `minValue` min allowed value
- new `dateTimeModelValidatorFactory` function, that is factory function that creates validator function factory
- new `DateTime` decorator, that sets date time validator to property on which is used
- new `DateTimePickerModule` module, that is module for components that are used as date time picker
    - **exports**
        - `DateTimePickerComponent`
        - `DateTimePickerDirective`
- new `DateTimePickerDirective` directive, that is directive that is used for displaying and attaching date time picker
    - **extends** `DateTimeBase`
    - **implements**
        - `OnInit`
        - `OnDestroy`
    - **inputs**
        - `withPickerOptions` gets or sets options for date time picker directive
    - **methods**
        - `showPicker` hides date time picker
        - `hidePicker` shows date time picker
- new `DateTimePickerComponent` directive, which is component used for displaying date time picker
    - **extends** `DateTimeDirective`
    - **implements**
        - `DateTimeInputValue`
        - `OnChanges`
        - `OnDestroy`
        - `OnInit`
    - **inputs**
        - `value` docs from `DateTimeInputValue`
        - `options` options for date time picker
    - **outputs**
        - `valueChange` docs from `DateTimeInputValue`
- new `DateTimePicker` interface, which describes date time picker API for each date time period
    - **extends**
        - `Invalidatable`
    - **properties**
        - `value` value of date time picker
        - `display` date that describes which date should be displayed
        - `maxDate` max allowed date
        - `minDate` min allowed date to be selected
        - `canScaleUp` indication whether picker can display scale date time period up
        - `canScaleDown` indication whether picker can display scale date time period down
        - `ranged` indication whether is value range of two values or single value
        - `valueChange` occurs when date time picker value changes
        - `scaleUp` occurs when period should be scaled up
        - `scaleDown` occurs when period should be scaled down
- new `DateTimePickerDirectiveOptions` directive, which is defintion of date time picker directive options
    - **properties**
        - `closeOnValueSelect` indication whether close picker on value selection
        - `closeOnBlur` indication whether close picker when date time input loses focus
        - `showOnFocus` indication whether display picker when date time input gets focus
        - `alwaysVisible` indication whether is picker always visible, mostly used for debugging
        - `disabled` indication whether picker is disabled, if true, you cant display picker
        - `absolute` indication whether use absolute global positioning of picker
        - `positionOptions` position options that are used to position picker
        - `pickerCssClass` custom css class that is being added to picker component
- new `DATE_TIME_PICKER_DIRECTIVE_OPTIONS` injection token for global options for date time picker directive
- new `DATE_TIME_PICKER_OPTIONS` injection token for global options for date time picker component
- new `DateTimePeriodPickerBase` class, which is base abstract class for each date time period picker
    - **implements**
        - `DateTimePicker`
- new `DateTimePickerOptions` interface, that is defintion of date time picker component options
    - **properties**
        - `periodsDefinition` definition of types for each period type for picker
        - `defaultPeriod` name of default period for picker that is displayed after opening
- new `DateTimeDirective` directive, that holds shared data for date time, like formats, restrictions
    - **implements**
        - `OnDestroy`
    - **properties**
        - `maxDateTimeChanges` occurs when there are changes in max date time value
        - `minDateTimeChanges` occurs when there are changes in min date time value
    - **inputs**
        - `valueFormat` gets or sets date time value format which is being worked with in this date time
        - `format` gets or sets format of string representation of date
        - `customFormat` custom format string representation of date
        - `maxDateTime` gets or sets max allowed date for date time
        - `minDateTime` gets or sets min allowed date for date time
- new `DayPickerSAComponent` component, which is used for displaying day picker
    - **extends** `DateTimePeriodPickerBase`
    - **implements**
        - `DateTimePicker`
- new `MonthPickerSAComponent` component, which is used for displaying month picker
    - **extends** `DateTimePeriodPickerBase`
    - **implements**
        - `DateTimePicker`
- new `YearPickerSAComponent` component, which is used for displaying year picker
    - **extends** `DateTimePeriodPickerBase`
    - **implements**
        - `DateTimePicker`
- new `RollerTimePickerSAComponent` component, which is used for rendering roller time picker
    - **extends** `DateTimePeriodPickerBase`
    - **implements**
        - `DateTimePicker`
- new `WithTimeSADirective` directive, that sets up usage of date time picker to use time format and time picker
- new `WithTodaySADirective` directive, that sets today as day for empty date time on focus
- updated `DateApiObject` interface
    - new `unixTimestamp` method, that gets value of date time as unix timestamp
- updated `DateFormatPipe`
    - improved typings for `transform`
- *subpackage* `@anglr/datetime/moment`
    - updated `MomentDateApi`
        - now implements also new `unixTimestamp`
- *subpackage* `@anglr/datetime/date-fns`
    - updated `DateFnsDateApi`
        - now implements also new `unixTimestamp`

### BREAKING CHANGES

- dropped support of `Node.js` version `12`
- minimal supported version of `@angular` is now `14.2.6`
- minimal supported version of `rxjs` is now `7.5.6`
- minimal supported version of `@jscrpt/common` is now `3.1.0`
- minimal supported version of `@anglr/common` is now `14.1.0`
- minimal supported version of `tslib` is now `2.4.0`
- minimal supported version of `moment` is now `2.29.4`
- minimal supported version of `date-fns` is now `2.29.3`
- dropped dependency `positions`
- all previous selectors, pickers and everything is now deprecated and marked as legacy
- updated `DateTimeValue` interface
    - `from` can now also be `undefined` or `null`
    - `to` can now also be `undefined` or `null`
- updated `DateTimeRelativeParser` service
    - now `m` means minutes and `M` means months
- updated `DateTimePickerModule` renamed to `DateTimeLegacyPickerModule`
- updated `DateTimePickerComponent` renamed to `DateTimePickerLegacyComponent`
- updated `DateTimePicker` renamed to `DateTimeLegacyPicker`
- updated `DateTimePickerOptions` renamed to `DateTimePickerLegacyOptions`
- updated `DateFormatPipe`
    - typings that allows custom format must use `customFormat` new parameter

## Version 4.0.0 (2022-10-14)

### Bug Fixes

- updated `DateValueProvider` service, now correctly returns start of day for format with day

### Features

- new `DateApiObjectCtor` interface, that is definition of type, that is used for creating instance of DateApiObject
- new `DATE_API_OBJECT_TYPE` injection token used for injecting type that creates instance of DateApiObject
- updated `DateApi` interface
    - new generic parameter `TDateApiObject` which allows to get specific `DateApiObject` implementation
- *subpackage* `@anglr/datetime/moment`
    - updated `MomentDateApi`
        - now creates `DateApiObject` using `DATE_API_OBJECT_TYPE`
    - new `momentDateApiObjectType` type that represents creation of DateApiObject for moment
    - new `MOMENT_DATE_API_OBJECT_TYPE` injection token used for injecting type that creates instance of DateApiObject for moment
    - `MomentDateApiObject` made part of public API
- *subpackage* `@anglr/datetime/date-fns`
    - updated `DateFnsDateApi`
        - now creates `DateApiObject` using `DATE_API_OBJECT_TYPE`
    - new `dateFnsDateApiObjectType` type that represents creation of DateApiObject for date-fns
    - new `DATE_FNS_DATE_API_OBJECT_TYPE` injection token used for injecting type that creates instance of DateApiObject for date-fns
    - `DateFnsDateApiObject` made part of public API

### BREAKING CHANGES

- updated `DateConvertPipe` now returns `DateApiObject<TDate>` instead of `TDate`
- updated `DateFnsDateApi` constructor has new parameter `DATE_API_OBJECT_TYPE`
- renamed `DATEFNS_FORMAT_PROVIDER` to `DATE_FNS_FORMAT_PROVIDER`

## Version 3.0.0 (2022-05-04)

### Bug Fixes

- fixed date-fns bug with displaying *dateTime* format
- fixed placeholder value of `undefined`
- fixed problem with occasionally error *cant access property length*
- fixed not working setting *disabled* or *enabled* from code
- fixed problem with writing date manually into input

### Features

- `DateApiObject` interface
    - new `startOfHour` method, that updates value to start date and time of current hour
    - new `endOfHour` method, that updates value to end date and time of current hour
    - new `addHours` method, that add hours, if count not specified adds 1 hour
    - new `subtractHours` method, that subtract hours, if count not specified subtract 1 hour
    - new `startOfMinute` method, that updates value to start date and time of current minute
    - new `endOfMinute` method, that updates value to end date and time of current minute
    - new `addMinutes` method, that add minutes, if count not specified adds 1 minute
    - new `subtractMinutes` method, that subtract minutes, if count not specified subtract 1 minute
    - new `hour` method, that gets or sets hours zero based
    - new `minute` method, that gets or sets minutes zero based
- `DateTimeRelativeParser` now supports *hours* and *minutes* as relative values
- updated `DateApi` interface
    - new `isDate` method, that tests whether is value TDate
- `FormatProvider` interface
    - new `year` property, that is format token for displaying full year
    - new `month` property, that is format token for displaying month double digit number
    - new `week` property, that is format token for displaying week double digit number
    - new `day` property, that is format token for displaying day double digit number
    - new `hour` property, that is format token for displaying hour (24h format) double digit number
    - new `minute` property, that is format token for displaying minute double digit number
    - new `second` property, that is format token for displaying second double digit number
    - new `dayName` property, that is format token for displaying standalone day full name
    - new `dayNameShort` property, that is format token for displaying standalone day short name
    - new `monthName` property, that is format token for displaying standalone month full name
    - new `monthNameShort` property, that is format token for displaying standalone month short name
- `DateTimeSelectorOptions` interface
    - now allows absolute positioning of picker, which is default
    - new `pickerAbsolute` property, that is indication whether use absolute positioning of picker
    - new `positionOptions` property, that is position options that are used in case of absolute picker
    - new `pickerAbsoluteContainer` property, that is css selector for absolute picker container
- new `PickerImplBaseComponent` abstract component, that is base class used as base for picker as base implementation of DateTimePicker interface
- updated `PickerBaseComponent` now extends `PickerImplBaseComponent`
- new `DateTimePickerRendererDirective` directive, that is used for rendering datetime picker in selector
    - *inputs*
        - `options` current options used by selector
        - `dateTimePicker` current selected value
        - `minValue` gets or sets minimal possible value for picker, that can be picked
        - `maxValue` gets or sets maximal possible value for picker, that can be picked
        - `selectorElement` selector element which is used during absolute positioning of picker
    - *outputs*
        - `valueChange` occurs when value changes
- `DateTimeDayPickerComponent` component now supports scaling down to *time*
- `CommonPickerCssClasses` interface
    - new `clickable` property, that is name of css class that represents clickable items in picker
- new `DateTimeRollerTimePickerComponent` component used for rendering roller time picker
- new `RollerTimePickerCssClasses` interface, that holds specific css classes for roller time picker
- new `LoopScrollDirective` directive that renders loop scroll for array of elements
    - *selector* `"loopScroll"`
    - *inputs*
        - `loopScroll` value that is being set in loop scroll
        - `open` indication whether is currently selection scroll open
    - *outputs*
        - `loopScrollChange` occurs when current value of loop scroll changes
    - *ContentChildren* of `LoopScrollDataDirective`, that is array of items that are loop scrolled
- new `LoopScrollData` interface, that represents data for LoopScrollDirective
- new `LoopScrollDataDirective` directive, that is loop scroll data that are used inside LoopScrollDirective
    - *selector* `"loopScrollData"`
    - *inputs*
        - `loopScrollData` data for loop
        - `clone` indication that this node is clone
- updated `InputDateTimeSelectorComponent` now supports *hours* and *minutes*
- updated `DateValueProvider` now supports *hours* and *minutes*
- *subpackage* `@anglr/datetime/moment`
    - updated `MomentDateApi`
        - to correspond with `DateApi` interface
    - updated `MomentDateApiObject` to correspond with `DateApiObject` interface
    - updated `MOMENT_FORMAT_PROVIDER` to correspond with `FormatProvider` interface
- *subpackage* `@anglr/datetime/date-fns`
    - updated `DateFnsDateApi`
        - to correspond with `DateApi` interface
    - updated `DateFnsDateApiObject` to correspond with `DateApiObject` interface
    - updated `DATEFNS_FORMAT_PROVIDER` to correspond with `FormatProvider` interface

### BREAKING CHANGES

- minimal supported version of `@anglr/common` is `11.2.0`
- removed `AsRequiredTypePipe` replaced with one from `@anglr/common`
- strict null checks
- both `DateTimePickerOptions` and `DateTimeSelectorOptions` have now all properties required, and options are now passed as `Partial`
- updated `CommonPickerCssClasses` have now all properties required, and setting is now passed as `Partial`

## Version 2.0.1 (2022-02-22)

### Bug Fixes

- fixed typings, not using rolled up typings for now
- fixed scss entry points

## Version 2.0.0 (2022-02-21)

### BREAKING CHANGES

- minimal supported version of *Angular* is `13.1.0`
- minimal supported version of `@jscrpt/common` is `2.2.0`
- minimal supported version of `@anglr/common` is `10.0.0`
- compiled as *Angular IVY* **only** with new *APF*
- removed support of *es5* target and using latest package.json features
- removed dependency `@anglr/types`, all mising types used directly here
- dropped support of `Node.js <= 12.20`

## Version 1.0.0 (2022-02-17)

### Features

- constants identifying datetime parts/components (`MINUTE`, `HOUR`, `DAY`, ...)
- `DateTimeValue` representing datetime value as interval from to
- `DATE_API` token used for injecting `DateApi` abstraction layer
- `FORMAT_PROVIDER` token used for injecting `FormatProvider` that contains some of default formats (day, time, datetime)
- `FormatProvider` that contains some of default formats (day, time, datetime)
- `DateApi` and `DateApiObject` used as abstraction layer for working with datetime'
- `DatePositionParserService` used for obtaining implementation of `DatePositionParser`
- `DatePositionParser` and `DefaultDatePositionParser` used for parsing string datetime into parts and allowing selection of separate parts
- `DatePositionParserResult` as result of datetime parsing
- `DateValueProvider` which serves as provider of `DateTimeValue` for specified date and format
- `DateFormatPipe` pipe that is used for formatting date
- `DateConvertPipe` pipe that is used for converting date
- `DatePipesModule` module used for exporting date pipes
- customizable `DateTimeSelector`, allowing to select, insert, edit datetime value
    - `DATE_TIME_SELECTOR_CONFIGURATION` token for injecting `DateTimeSelectorOptions`
    - `DateTimeSelectorOptions` defintion of datetime selector component options
    - `DateTimeSelector` describes datetime selector component used for displaying and selecting value
    - `DateTimeSelectorComponent` as main component allowing for displaying *selector* implementation and *picker*
    - `InputDateTimeSelectorComponent` component used for selecting datetime in input field, allowing splitting of value into period/parts
    - `SimpleInputDateTimeSelectorComponent` component used for selecting datetime in input field, simple input
    - `DateTimeSelectorControlValueAccessor` directive for enabling *Angular Forms* binding to selector, also allowing gaining value as string, or simple value or range value
    - `DateTimeSelectorModule` module containing selector
    - `DateTimeBasicSelectorModule` module containing simple input selector
- customizable `DateTimePicker`, allowing to pick datetime value
    - `DateTimePickerCssClasses` css classes applied to datetime picker
    - `DateTimePickerOptions` defintion of datetime picker component options
    - `DATE_TIME_PICKER_CONFIGURATION` token used for injecting `DateTimePickerOptions`
    - `DateTimePicker` describes datetime picker component used for displaying and selecting value
    - `PeriodData` data that represents data for any picker type
    - `DayData` data that represents day in date picker
    - `MonthData` data that represents month in date picker
    - `YearData` data that represents year in date picker
    - `DateTimePickerComponent` as main component allowing displaying *picker*
    - `DateTimeDayPickerComponent` component used for picking day from *month* view
    - `DateTimeMonthPickerComponent` component used for picking month from *year* view
    - `DateTimeYearPickerComponent` component used for picking year from *decade* view
    - `DateTimePickerModule` module containing pickers
- added new *subpackage* `@anglr/datetime/moment`
- *subpackage* `@anglr/datetime/moment`
    - `MOMENT_FORMAT_PROVIDER` token for injecting `FormatProvider` for *MomentJs*
    - `MomentDateApi` *MomentJs* implementation of `DateApi` returning *MomentJs* implementation of `DateApiObject`
- added new *subpackage* `@anglr/datetime/date-fns`
- *subpackage* `@anglr/datetime/date-fns`
    - `DATEFNS_FORMAT_PROVIDER` token for injecting `FormatProvider` for *date-fns*
    - `DateFnsDateApi` *date-fns* implementation of `DateApi` returning *date-fns* implementation of `DateApiObject`
    - `DateFnsLocale` date FNS locale service, used for obtaining locale
    - `DATE_FNS_LOCALE` token for injecting `DateFnsLocale`