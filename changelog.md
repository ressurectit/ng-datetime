# Changelog

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