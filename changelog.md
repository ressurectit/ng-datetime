# Changelog

## Version 5.0.0 (2022-10-18)

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
- new `DateTimeModule` module for basic date time directives, components, pipes
    - **exports**
        - `DateTimeControlValueAccessorDirective`
        - `DateTimeInputDirective`
        - `DateTimeMaxValidatorDirective`
        - `DateTimeMinValidatorDirective`
        - `DateTimeValidatorDirective`
- new `DATE_TIME_INPUT` injection token, that is used for injecting type that represents date time input
- new `DateTimeBase` class, that is base class for date time directives, contains basic shared data
    - **implements**
        - `DateTimeInputValue`
    - **inputs**
        - `valueFormat` gets or sets date time value format which is being worked with in this date time
        - `format` gets or sets format of string representation of date
        - `customFormat` custom format string representation of date
- new `DateTimeRestrictedBase` class, that is base class for date time directives with value restrictions
    - **extends** `DateTimeBase`
    - **implements**
        - `OnDestroy`
    - **inputs**
        - `maxDateTime` gets or sets max allowed date for date time
        - `minDateTime` gets or sets min allowed date for date time
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
    - **extends** `DateTimeRestrictedBase`
    - **implements**
        - `Validator`
        - `OnInit`
    - **provides**
        - `NG_VALIDATORS` providing self
- new `DateTimeMinValidatorDirective` directive, that applies validator for date time min value
    - **extends** `DateTimeRestrictedBase`
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
- updated `DateApiObject` interface
    - new `unixTimestamp` method, that gets value of date time as unix timestamp
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

## Version 4.0.0 (2022-10-14)

### Bug Fixes

- updated `DateValueProvider` service, now correctly returns start of day for format with day

### Features

- new `DateApiObjectCtor` interface that, is definition of type, that is used for creating instance of DateApiObject
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