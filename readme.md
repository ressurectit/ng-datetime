[![npm version](https://badge.fury.io/js/%40anglr%2Fdatetime.svg)](https://badge.fury.io/js/%40anglr%2Fdatetime)
[![Build status](https://ci.appveyor.com/api/projects/status/4ieg9q7sgfgbpboj?svg=true)](https://ci.appveyor.com/project/kukjevov/ng-datetime)

# @anglr/datetime

> Angular library for datetime input, manipulation, validation, formatting, and calendar/picker UI components with pluggable date adapters (date-fns, Moment.js, or any other implementing `DateApiObject`).

- [API](https://ressurectit.github.io/#/content/api/ng-datetime/datetime)
- [API Date FNS](https://ressurectit.github.io/#/content/api/ng-datetime-date-fns/datetime-date-fns)
- [API Moment](https://ressurectit.github.io/#/content/api/ng-datetime-moment/datetime-moment)
- [Samples](https://ressurectit.github.io/#/content/datetime#samples)

---

## Table of Contents

- [Why Use This Library?](#why-use-this-library)
- [Installation](#installation)
- [Architecture Overview](#architecture-overview)
- [Date Adapters](#date-adapters)
- [Modules](#modules)
- [Directives](#directives)
- [Pipes](#pipes)
- [Services](#services)
- [Validators](#validators)
- [Calendar](#calendar)
- [Date/Time Picker](#datetime-picker)
- [Theming & Styles](#theming--styles)
- [Usage Examples](#usage-examples)
- [Samples](#samples)
- [Advanced Usage](#advanced-usage)

---

## Why Use This Library?

- **Adapter-based architecture** — swap between `date-fns` and `Moment.js` (or your custom implementation) without changing your templates or component code.
- **Standalone directives** — tree-shakable, composable, use only what you need.
- **Rich keyboard handling** — arrow key navigation between date parts, increment/decrement with constraints, auto-selection of date segments.
- **Built-in validation** — min/max/format validators with Angular Reactive and Template-driven forms integration.
- **Flexible pickers** — configurable day/month/year/time pickers with positioning, CSS classes, and behavioral options.
- **Calendar component** — full month calendar with event support, custom day templates, and aspect ratio control.
- **Pipes for display** — format, convert, and compare dates directly in templates.
- **i18n-ready** — locale support via date-fns locales or Moment locale system.
- **Relative date parsing** — support for expressions like `+5d`, `-2M`, `+1y`.

---

## Installation

```bash
npm install @anglr/datetime
```

Choose your date adapter:

```bash
# date-fns (recommended)
npm install date-fns

# or Moment.js
npm install moment
```

**Peer dependencies:**

- `@angular/core` >= 19.1.0
- `@angular/forms` >= 19.1.0
- `@angular/common` >= 19.1.0
- `@angular/animations` >= 19.1.0
- `@anglr/common` >= 22.0.0
- `@jscrpt/common` >= 7.0.0
- `rxjs` >= 7.5.7

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              Your Application                    │
├──────────────────┬──────────────────────────────┤
│    Directives    │     Pipes / Validators       │
│  (date inputs,   │  (dateFormat, isAfter,       │
│   pickers, etc.) │   datetimeMin, etc.)         │
├──────────────────┴──────────────────────────────┤
│               Core Services                      │
│  (DateApi, DatePositionParser,                   │
│   DateTimeRelativeParser, DateValueProvider)     │
├─────────────────────────────────────────────────┤
│          Adapter Layer (DI tokens)               │
│  ┌──────────────────┐  ┌────────────────────┐  │
│  │  date-fns adapter │  │  Moment.js adapter │  │
│  │  DateFnsDateApi   │  │  MomentDateApi     │  │
│  └──────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────┘
```

The library uses Angular dependency injection tokens (`DATE_API`, `FORMAT_PROVIDER`, `DATE_API_OBJECT_TYPE`) allowing you to plug in any adapter at the application root.

---

## Date Adapters

### date-fns Adapter

Import path: `@anglr/datetime/date-fns`

```typescript
import {DATE_API} from '@anglr/datetime';
import {DateFnsDateApi, DateFnsLocale, DATE_FNS_DATE_API_OBJECT_TYPE, DATE_FNS_FORMAT_PROVIDER, DATE_FNS_LOCALE} from '@anglr/datetime/date-fns';
import {sk} from 'date-fns/locale';

export const appProviders = 
[
    {
        provide: DATE_API,
        useClass: DateFnsDateApi,
    },
    DATE_FNS_FORMAT_PROVIDER,
    DATE_FNS_DATE_API_OBJECT_TYPE,
    {
        provide: DATE_FNS_LOCALE,
        useValue: <DateFnsLocale>
        {
            locale: sk,
        },
    },
];
```

Default format tokens provided by `DATE_FNS_FORMAT_PROVIDER`:

| Token | Format |
|-------|--------|
| `date` | `'P'` (locale-aware) |
| `dateTime` | `'Pp'` |
| `time` | `'p'` |
| `year` | `'yyyy'` |
| `month` | `'MM'` |
| `day` | `'dd'` |
| `hour` | `'HH'` |
| `minute` | `'mm'` |
| `second` | `'ss'` |

### Moment.js Adapter

Import path: `@anglr/datetime/moment`

```typescript
import {DATE_API} from '@anglr/datetime';
import {MomentDateApi, MOMENT_FORMAT_PROVIDER, MOMENT_DATE_API_OBJECT_TYPE} from '@anglr/datetime/moment';

export const appProviders = 
[
    {
        provide: DATE_API,
        useClass: MomentDateApi,
    },
    MOMENT_FORMAT_PROVIDER,
    MOMENT_DATE_API_OBJECT_TYPE,
];
```

### Custom Format Provider

Override the default format tokens:

```typescript
import {FORMAT_PROVIDER, FormatProvider} from '@anglr/datetime';

{
    provide: FORMAT_PROVIDER,
    useFactory: () => 
    {
        return <FormatProvider>{
            date: 'd.M.y',
            dateTime: 'd.M.y HH:mm',
            time: 'HH:mm',
            year: 'yyyy',
            month: 'MM',
            week: 'ww',
            day: 'DD',
            hour: 'HH',
            minute: 'mm',
            second: 'ss',
            dayName: 'dddd',
            dayNameShort: 'dd',
            monthName: 'MMMM',
            monthNameShort: 'MMM',
        };
    },
}
```

---

## Modules

| Module | Description |
|--------|-------------|
| `DateTimeModule` | Core directives: `DateTimeDirective`, `DateTimeInputDirective`, `DateTimeControlValueAccessorDirective`, validators |
| `DateTimePickerModule` | `DateTimePickerComponent`, `DateTimePickerDirective` |
| `MonthCalendarModule` | `MonthCalendarComponent`, `CalendarDayTemplateDirective` |
| `DatePipesModule` | `dateFormat`, `dateConvert`, `isAfter`, `isBefore` pipes |

---

## Directives

### Composite (ready-to-use) Directives

These combine multiple internal directives for common use cases:

| Directive | Selector | Description |
|-----------|----------|-------------|
| `DatePickerInputDirective` | `input[dateTime][datePickerInput]` | Full date picker with advanced keyboard handler |
| `DateTimePickerInputDirective` | `input[dateTime][dateTimePickerInput]` | Full date + time picker with advanced keyboard handler |
| `SimpleDatePickerInputDirective` | `input[dateTime][simpleDatePickerInput]` | Date picker with simple keyboard handler |
| `SimpleDateTimePickerInputDirective` | `input[dateTime][simpleDateTimePickerInput]` | Date + time picker with simple keyboard handler |
| `ButtonDateTimeInputDirective` | `button[dateTime][dateTimeInput]` | Date/time input rendered as button/link |

### Behavior Directives

| Directive | Selector | Description |
|-----------|----------|-------------|
| `WithNowDirective` | `[dateTime][withNow]` | Sets value to current date/time on focus (if empty) |
| `WithTodayDirective` | `[dateTime][withToday]` | Sets value to start of today on focus (if empty) |
| `WithTimeDirective` | `[dateTime][withPicker][withTime]` | Adds time picker component and switches format to `'dateTime'` |

### Core Directives

| Directive | Selector | Description |
|-----------|----------|-------------|
| `DateTimeDirective` | `[dateTime]` | Shared data holder (format, restrictions, validation config) |
| `DateTimeInputDirective` | `input[dateTime][dateTimeInput]` | Text input with value parsing |
| `DateTimeInputHandlerDirective` | `[dateTime][withHandler]` | Advanced keyboard navigation (arrow keys navigate date parts) |
| `SimpleDateTimeInputHandlerDirective` | `[dateTime][withSimpleHandler]` | Simple keyboard (arrows: ±day/±week, Ctrl+Space: open picker) |
| `DateTimePickerDirective` | `[dateTime][withPicker]` | Controls picker component visibility and positioning |
| `DateTimeControlValueAccessorDirective` | `[dateTime][valueFormat]` | Angular ControlValueAccessor integration |
| `DateTimeValidatorDirective` | — | Validates date is valid format |
| `DateTimeMinValidatorDirective` | — | Validates date >= min |
| `DateTimeMaxValidatorDirective` | — | Validates date <= max |

### Keyboard Handlers

**`DateTimeInputHandlerDirective` (Advanced):**
- Left/Right arrows: Navigate between date segments (year → month → day → hour → minute)
- Up/Down arrows: Increment/decrement current segment with min/max constraints
- Typed characters: Replace selected segment with validation
- Click/select: Auto-select current date part

**`SimpleDateTimeInputHandlerDirective` (Simple):**
- Left/Right arrows: ±1 day
- Up/Down arrows: ±1 week
- Escape: Close picker
- Ctrl+Space: Open picker

---

## Pipes

| Pipe | Syntax | Description |
|------|--------|-------------|
| `dateFormat` | `{{ value \| dateFormat }}` | Format with default `'date'` format |
| `dateFormat` | `{{ value \| dateFormat: 'dateTime' }}` | Format with FormatProvider key |
| `dateFormat` | `{{ value \| dateFormat: 'yyyy-MM-dd' : true }}` | Format with custom format string |
| `dateConvert` | `{{ value \| dateConvert }}` | Convert to DateApiObject wrapper |
| `dateConvert` | `{{ value \| dateConvert: 'yyyy-MM-dd' }}` | Convert with parse format |
| `isAfter` | `{{ date1 \| isAfter: date2 }}` | Test if date1 is after date2 |
| `isBefore` | `{{ date1 \| isBefore: date2 }}` | Test if date1 is before date2 |

---

## Services

### DateApi\<TDate\>

Core abstraction for date manipulation. Injected via `DATE_API` token.

```typescript
import {Component, inject} from '@angular/core';
import {DATE_API, DateApi} from '@anglr/datetime';

@Component(
{
    /* ... */
})
export class ExampleComponent
{
    private readonly dateApi: DateApi<Date> = inject<DateApi<Date>>(DATE_API);

    example(): void
    {
        // Create date object
        const today = this.dateApi.now();

        // Parse value
        const date = this.dateApi.getValue('2024-01-15', 'yyyy-MM-dd');

        // Fluent API
        const formatted = this.dateApi.now()
            .addDays(5)
            .startOfDay()
            .format('yyyy-MM-dd');

        // Comparisons
        const isAfter = date.isAfter(today.value);
        const isSame = date.isSameMonth(today.value);
    }
}
```

### DateApiObject\<TDate\> (Fluent Wrapper)

Wraps a date value with chainable methods:

```typescript
const result = dateApi.getValue('2024-03-15', 'yyyy-MM-dd')
    .startOfMonth()         // → 2024-03-01
    .addMonths(2)           // → 2024-05-01
    .endOfMonth()           // → 2024-05-31
    .format('d.M.yyyy');    // → "31.5.2024"

// Getters/Setters
const year = obj.year();        // get: 2024
obj.year(2025);                 // set: 2025
obj.month(0);                   // January (0-based)
obj.dayOfMonth(15);

// Period helpers
obj.startOfDecade();
obj.endOfYear();
obj.startOfWeek();

// Clone and reset
const copy = obj.clone();
obj.resetOriginal();   // revert to initial value
obj.updateOriginal();  // lock current as new original
```

### DatePositionParserService

Parses cursor position within a date string format:

```typescript
import {Component, inject} from '@angular/core';
import {DatePositionParserService} from '@anglr/datetime';

@Component(
{
    /* ... */
})
export class ExampleComponent
{
    private readonly positionParser: DatePositionParserService = inject(DatePositionParserService);

    example(): void
    {
        const parser = this.positionParser.createParser('dd.MM.yyyy');
        const result = parser.parse('15.03.2024', 4);
        // result: { positionFrom: 3, positionTo: 5, part: 'month' }

        parser.next('15.03.2024', 1);
        // moves cursor to month segment
    }
}
```

### DateTimeRelativeParser\<TDate\>

Parses relative date expressions:

```typescript
import {Component, inject} from '@angular/core';
import {DateTimeRelativeParser} from '@anglr/datetime';

@Component(
{
    /* ... */
})
export class ExampleComponent
{
    private readonly relativeParser: DateTimeRelativeParser = inject(DateTimeRelativeParser);

    example(): void
    {
        // Syntax: [+-]\d+[yMwdhm]
        const result1 = this.relativeParser.parse('+5d');   // today + 5 days
        const result2 = this.relativeParser.parse('-2M');   // today - 2 months
        const result3 = this.relativeParser.parse('+1y');   // today + 1 year
    }
}
```

Supported suffixes: `y` (years), `M` (months), `w` (weeks), `d` (days), `h`/`H` (hours), `m` (minutes).

### DateValueProvider\<TDate\>

Converts single date values to date ranges based on format granularity:

```typescript
import {Component, inject} from '@angular/core';
import {DateValueProvider} from '@anglr/datetime';

@Component(
{
    /* ... */
})
export class ExampleComponent
{
    private readonly valueProvider: DateValueProvider = inject(DateValueProvider);

    example(dateObj: unknown): void
    {
        // For day format: returns startOfDay → endOfDay
        const range = this.valueProvider.getValue(dateObj, 'date');
        // range.from → 2024-03-15 00:00:00
        // range.to   → 2024-03-15 23:59:59
    }
}
```

---

## Validators

### Template-Driven Forms

```html
<input dateTime simpleDatePickerInput
       [minDateTime]="minDate"
       [maxDateTime]="maxDate">
```

### Reactive Forms (Programmatic)

```typescript
import {Component, inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DATE_API, DateApi, datetimeValidator, datetimeMinValidator, datetimeMaxValidator, DateTimeValueFormat} from '@anglr/datetime';

@Component(
{
    /* ... */
})
export class ValidatorExampleComponent
{
    private readonly dateApi: DateApi<Date> = inject<DateApi<Date>>(DATE_API);

    public readonly dateControl: FormControl = new FormControl('2024-01-15', [
        datetimeValidator(this.dateApi, DateTimeValueFormat.FormattedString, 'yyyy-MM-dd'),
        datetimeMinValidator(this.dateApi, '2024-01-01', DateTimeValueFormat.FormattedString, 'yyyy-MM-dd'),
        datetimeMaxValidator(this.dateApi, '2024-12-31', DateTimeValueFormat.FormattedString, 'yyyy-MM-dd'),
    ]);
}
```

### Model-Based Validation (Decorator)

```typescript
import {DateTime, DateTimeValueFormat} from '@anglr/datetime';

class MyModel
{
    @DateTime()
    public dateField: string;

    @DateTime(DateTimeValueFormat.DataString, 'yyyy-MM-dd', 'yyyy-MM-dd')
    public startDate: string;
}
```

### Value Format Options

| Format | Description |
|--------|-------------|
| `DateTimeValueFormat.DateInstance` | Native JS Date object |
| `DateTimeValueFormat.UnixTimestamp` | Seconds since epoch |
| `DateTimeValueFormat.Timestamp` | Milliseconds since epoch |
| `DateTimeValueFormat.FormattedString` | Display format string |
| `DateTimeValueFormat.DataString` | Data-specific format string |
| `DateTimeValueFormat.RangeOfDateInstances` | Period with `from` / `to` |

---

## Calendar

The `MonthCalendarComponent` displays a full month calendar with event support.

```typescript
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CalendarDayAspectRatio, EventData, MonthCalendarDayFormat, MonthCalendarModule} from '@anglr/datetime';

@Component(
{
    template: `
        <month-calendar [display]="currentMonth"
                        [events]="events"
                        [showWeekNumber]="true"
                        [dayAspectRatio]="CalendarDayAspectRatio.FourToThree"
                        [weekDayName]="MonthCalendarDayFormat.Short">
            <ng-template calendarDayTemplate let-day>
                <div class="day-number">{{ day.day }}</div>
                @for (event of day.events; track event) {
                    <div class="event" [class.all-day]="event.allDay">
                        {{ $any(event.data).title }}
                    </div>
                }
            </ng-template>
        </month-calendar>
    `,
    imports:
    [
        MonthCalendarModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPageComponent
{
    protected readonly CalendarDayAspectRatio: typeof CalendarDayAspectRatio = CalendarDayAspectRatio;
    protected readonly MonthCalendarDayFormat: typeof MonthCalendarDayFormat = MonthCalendarDayFormat;

    public currentMonth: Date = new Date();
    public events: EventData<Date, MyEvent>[] =
    [
        {data: {title: 'Meeting'}, dateFrom: new Date(2024, 2, 15), dateTo: new Date(2024, 2, 15)},
        {data: {title: 'Conference'}, dateFrom: new Date(2024, 2, 20), dateTo: new Date(2024, 2, 22)},
    ];
}
```

### Calendar Day Aspect Ratios

| Enum | Ratio | Value |
|------|-------|-------|
| `OneToOne` | 1:1 | 100 |
| `ThreeToTwo` | 3:2 | 66.66 |
| `FourToThree` | 4:3 | 75 |
| `SixteenToTen` | 16:10 | 62.5 |
| `SixteenToNine` | 16:9 | 56.25 |

---

## Date/Time Picker

### Picker Components

| Component | Description |
|-----------|-------------|
| `DayPickerComponent` | Day grid for selecting a date within a month |
| `MonthPickerComponent` | Month grid for selecting a month within a year |
| `YearPickerComponent` | Year grid for selecting a year within a decade |
| `RollerTimePickerComponent` | Scrollable time picker (hours, minutes) |

### Picker Options

```typescript
import {DateTimePickerDirective, DateTimePickerDirectiveOptions} from '@anglr/datetime';

// In template:
// <input dateTime simpleDatePickerInput [withPickerOptions]="pickerOptions">

pickerOptions: DateTimePickerDirectiveOptions =
{
    closeOnValueSelect: true,
    closeOnBlur: true,
    showOnFocus: true,
    disabled: false,
    absolute: true,
    pickerCssClass: 'my-custom-picker',
};
```

### Custom Picker Periods

```typescript
import {Directive} from '@angular/core';
import {DateTimeDirective, DateTimePickerDirective, DateTimeValueFormat, MonthPickerComponent, YearPickerComponent} from '@anglr/datetime';

@Directive(
{
    /* ... */
})
export class CustomPickerDirective<TDate = unknown>
{
    constructor(picker: DateTimePickerDirective<TDate>,
                dateTime: DateTimeDirective<TDate>)
    {
        picker.pickerOptions =
        {
            defaultPeriod: 'month',
            periodsDefinition:
            {
                'month': MonthPickerComponent,
                'year': YearPickerComponent,
            },
        };
        dateTime.customFormat = 'yyyy-MM';
        dateTime.valueFormat = DateTimeValueFormat.FormattedString;
    }
}
```

---

## Theming & Styles

Import styles via SCSS:

```scss
// All styles
@use '@anglr/datetime/styles';

// Individual themes
@use '@anglr/datetime/styles/themes/light';
@use '@anglr/datetime/styles/themes/dark';
```

Available themes: `light`, `dark`.

SCSS architecture:
- `styles/core/_mixins.scss` — Reusable mixins
- `styles/core/_theme.scss` — Theme variable definitions
- `styles/core/_functions.scss` — SCSS helper functions
- `styles/components/_date-time-picker.scss` — Picker component styles
- `styles/components/_month-calendar.scss` — Calendar component styles

---

## Usage Examples

### Basic Date Picker Input

```typescript
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {DateTimeModule, WithTodayDirective, SimpleDatePickerInputDirective} from '@anglr/datetime';

@Component(
{
    selector: 'my-form',
    template: `
        <input dateTime simpleDatePickerInput withToday
               class="form-control"
               [formControl]="dateControl">
    `,
    imports:
    [
        DateTimeModule,
        WithTodayDirective,
        ReactiveFormsModule,
        SimpleDatePickerInputDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyFormComponent
{
    public readonly dateControl: FormControl = new FormControl('');
}
```

### Date + Time Picker

```typescript
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {DateTimeModule, WithNowDirective, SimpleDateTimePickerInputDirective} from '@anglr/datetime';

@Component(
{
    template: `
        <input dateTime simpleDateTimePickerInput withNow
               class="form-control"
               [formControl]="dateTimeControl">
    `,
    imports:
    [
        DateTimeModule,
        WithNowDirective,
        ReactiveFormsModule,
        SimpleDateTimePickerInputDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateTimeFormComponent
{
    public readonly dateTimeControl: FormControl = new FormControl('');
}
```

### Advanced Keyboard-Navigable Date Input

```typescript
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {DateTimeModule, DateTimePickerModule, DatePickerInputDirective} from '@anglr/datetime';

@Component(
{
    template: `
        <input dateTime datePickerInput
               class="form-control"
               [formControl]="dateControl"
               [minDateTime]="minDate"
               [maxDateTime]="maxDate">
    `,
    imports:
    [
        DateTimeModule,
        ReactiveFormsModule,
        DateTimePickerModule,
        DatePickerInputDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedDateComponent
{
    public readonly dateControl: FormControl = new FormControl('');
    public minDate: string = '2024-01-01';
    public maxDate: string = '2024-12-31';
}
```

### Display Dates with Pipes

```typescript
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DatePipesModule} from '@anglr/datetime';

@Component(
{
    template: `
        <!-- Default date format -->
        <span>{{ createdAt | dateFormat }}</span>

        <!-- Date + time -->
        <span>{{ updatedAt | dateFormat: 'dateTime' }}</span>

        <!-- Custom format -->
        <span>{{ birthday | dateFormat: 'dd. MMMM yyyy' : true }}</span>

        <!-- Comparison -->
        @if (endDate | isBefore: today) {
            <span class="expired">Expired</span>
        }
    `,
    imports:
    [
        DatePipesModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent
{
    public createdAt: string = '2024-03-15T10:30:00Z';
    public updatedAt: Date = new Date();
    public birthday: Date = new Date(1990, 5, 15);
    public endDate: Date = new Date(2024, 0, 1);
    public today: Date = new Date();
}
```

### Creating a Custom Picker Directive (hostDirectives pattern)

```typescript
import {Directive} from '@angular/core';
import {
    DateTimeDirective,
    DateTimeValueFormat,
    DateTimeInputDirective,
    DateTimePickerDirective,
    SimpleDateTimeInputHandlerDirective,
} from '@anglr/datetime';

@Directive(
{
    selector: 'input[dateTime][dayPicker]',
    hostDirectives:
    [
        DateTimeInputDirective,
        DateTimePickerDirective,
        SimpleDateTimeInputHandlerDirective,
        {
            directive: DateTimeDirective,
            inputs: ['minDateTime', 'maxDateTime', 'valueFormat', 'format', 'customFormat', 'dataFormat'],
        },
    ],
})
export class DayPickerDirective<TDate = unknown>
{
    constructor(dateTime: DateTimeDirective<TDate>)
    {
        dateTime.valueFormat = DateTimeValueFormat.DataString;
        dateTime.dataFormat = 'yyyy-MM-dd';
    }
}
```

Usage in template:

```html
<input dateTime dayPicker class="form-control" [formControl]="myControl">
```

### Month-Only Picker Directive

```typescript
import {Directive} from '@angular/core';
import {
    DateTimeDirective,
    DateTimeValueFormat,
    MonthPickerComponent,
    YearPickerComponent,
    DateTimeInputDirective,
    DateTimePickerDirective,
    DateTimeInputHandlerDirective,
} from '@anglr/datetime';

@Directive(
{
    selector: 'input[dateTime][monthPicker]',
    hostDirectives:
    [
        DateTimeInputDirective,
        DateTimePickerDirective,
        DateTimeInputHandlerDirective,
        {
            directive: DateTimeDirective,
            inputs: ['minDateTime', 'maxDateTime'],
        },
    ],
})
export class MonthPickerDirective<TDate = unknown>
{
    constructor(picker: DateTimePickerDirective<TDate>,
                dateTime: DateTimeDirective<TDate>)
    {
        picker.pickerOptions =
        {
            defaultPeriod: 'month',
            periodsDefinition:
            {
                'month': MonthPickerComponent,
                'year': YearPickerComponent,
            },
        };
        dateTime.customFormat = 'yyyy-MM';
        dateTime.valueFormat = DateTimeValueFormat.FormattedString;
    }
}
```

### Day + Time Picker with DataString Output

```typescript
import {Directive} from '@angular/core';
import {
    DateTimeDirective,
    DateTimeValueFormat,
    WithTimeDirective,
    DateTimeInputDirective,
    DateTimePickerDirective,
    SimpleDateTimeInputHandlerDirective,
} from '@anglr/datetime';

@Directive(
{
    selector: 'input[dateTime][dayTimePicker]',
    hostDirectives:
    [
        WithTimeDirective,
        DateTimeInputDirective,
        DateTimePickerDirective,
        SimpleDateTimeInputHandlerDirective,
        {
            directive: DateTimeDirective,
            inputs: ['minDateTime', 'maxDateTime', 'valueFormat', 'format', 'customFormat', 'dataFormat'],
        },
    ],
})
export class DayTimePickerDirective<TDate = unknown>
{
    constructor(dateTime: DateTimeDirective<TDate>)
    {
        dateTime.valueFormat = DateTimeValueFormat.DataString;
        dateTime.dataFormat = "yyyy-MM-dd'T'HH:mm:ss";
    }
}
```

### Extending DateApiObject with Custom Methods

```typescript
import {DateApiObject} from '@anglr/datetime';
import {DateFnsDateApiObject} from '@anglr/datetime/date-fns';
import {differenceInMonths, differenceInYears, differenceInSeconds} from 'date-fns';

export class DateApiExtension extends DateFnsDateApiObject
{
    public override clone(): DateApiObject<Date>
    {
        return new DateApiExtension(new Date(this._value), null, this._localeSvc);
    }

    public override cloneOriginal(): DateApiObject<Date>
    {
        return new DateApiExtension(new Date(this._originalValue), null, this._localeSvc);
    }

    public diffMonths(date: Date): number
    {
        return differenceInMonths(this._value, date);
    }

    public diffYears(date: Date): number
    {
        return differenceInYears(this._value, date);
    }

    public diffSeconds(date: Date): number
    {
        return differenceInSeconds(this._value, date);
    }
}
```

Register the extension globally:

```typescript
import {DATE_API_OBJECT_TYPE} from '@anglr/datetime';

{
    provide: DATE_API_OBJECT_TYPE,
    useValue: DateApiExtension,
}
```

### Feature Module Pattern

```typescript
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
    DateTimeModule,
    WithNowDirective,
    WithTimeDirective,
    WithTodayDirective,
    DateTimePickerModule,
    DatePickerInputDirective,
    DateTimePickerInputDirective,
    DateTimeInputHandlerDirective,
    SimpleDatePickerInputDirective,
    SimpleDateTimePickerInputDirective,
    SimpleDateTimeInputHandlerDirective,
} from '@anglr/datetime';

@NgModule(
{
    imports:
    [
        WithNowDirective,
        WithTimeDirective,
        WithTodayDirective,
        DatePickerInputDirective,
        DateTimePickerInputDirective,
        DateTimeInputHandlerDirective,
        SimpleDatePickerInputDirective,
        SimpleDateTimePickerInputDirective,
        SimpleDateTimeInputHandlerDirective,
    ],
    exports:
    [
        DateTimeModule,
        WithNowDirective,
        WithTimeDirective,
        WithTodayDirective,
        ReactiveFormsModule,
        DateTimePickerModule,
        DatePickerInputDirective,
        DateTimePickerInputDirective,
        DateTimeInputHandlerDirective,
        SimpleDatePickerInputDirective,
        SimpleDateTimePickerInputDirective,
        SimpleDateTimeInputHandlerDirective,
    ],
})
export class FormsFeatureModule
{
}
```

### Display Feature Module with Pipes

```typescript
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatePipesModule} from '@anglr/datetime';

@NgModule(
{
    exports:
    [
        CommonModule,
        DatePipesModule,
    ],
})
export class DisplayingFeatureModule
{
}
```

---

## Samples

These samples demonstrate the building-block approach using individual directives. Live demos are available at [Samples](https://ressurectit.github.io/#/content/datetime#samples).

### Basic DateTime Input

A minimal date input using `dateTime` and `dateTimeInput` directives with a reactive form control.

```typescript
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {DatePipesModule, DateTimeModule} from '@anglr/datetime';

@Component(
{
    selector: 'basic-sample',
    templateUrl: 'basicSample.component.html',
    imports:
    [
        ReactiveFormsModule,
        DatePipesModule,
        DateTimeModule,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicSampleComponent
{
    protected datetimeControl: FormControl<unknown> = new FormControl(null);
}
```

```html
<div class="flex-row margin-bottom-extra-small">
    <div class="flex-1">Raw value: {{datetimeControl.value | json}}</div>
    <div class="flex-1">Date value: {{datetimeControl.value | dateFormat}}</div>
</div>

<input class="form-control" dateTime dateTimeInput [formControl]="datetimeControl">
```

### Basic DateTime Picker

Adds a date picker popup by applying the `withPicker` directive.

```typescript
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {DatePipesModule, DateTimeModule, DateTimePickerModule} from '@anglr/datetime';

@Component(
{
    selector: 'basic-picker-sample',
    templateUrl: 'basicPickerSample.component.html',
    imports:
    [
        DateTimePickerModule,
        ReactiveFormsModule,
        DatePipesModule,
        DateTimeModule,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicPickerSampleComponent
{
    protected datetimeControl: FormControl<unknown> = new FormControl(null);
}
```

```html
<div class="flex-row margin-bottom-extra-small">
    <div class="flex-1">Raw value: {{datetimeControl.value | json}}</div>
    <div class="flex-1">Date value: {{datetimeControl.value | dateFormat}}</div>
</div>

<input class="form-control" dateTime dateTimeInput withPicker [formControl]="datetimeControl">
```

### DateTime with Time

Enables time selection alongside date by adding the `withTime` directive.

```typescript
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {DatePipesModule, DateTimeModule, DateTimePickerModule, WithTimeDirective} from '@anglr/datetime';

@Component(
{
    selector: 'with-time-sample',
    templateUrl: 'withTimeSample.component.html',
    imports:
    [
        DateTimePickerModule,
        WithTimeDirective,
        ReactiveFormsModule,
        DatePipesModule,
        DateTimeModule,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithTimeSampleComponent
{
    protected datetimeControl: FormControl<unknown> = new FormControl(null);
}
```

```html
<div class="flex-row margin-bottom-extra-small">
    <div class="flex-1">Raw value: {{datetimeControl.value | json}}</div>
    <div class="flex-1">Date value: {{datetimeControl.value | dateFormat: 'dateTime'}}</div>
</div>

<input class="form-control" dateTime dateTimeInput withPicker withTime [formControl]="datetimeControl">
```

### Today vs Now

Compares `withToday` (sets value to start of day) and `withNow` (sets value to current date/time) when the input is focused while empty.

```typescript
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {DatePipesModule, DateTimeModule, DateTimePickerModule, WithNowDirective, WithTimeDirective, WithTodayDirective} from '@anglr/datetime';

@Component(
{
    selector: 'today-vs-now-sample',
    templateUrl: 'todayVsNowSample.component.html',
    imports:
    [
        WithTimeDirective,
        WithTodayDirective,
        DateTimePickerModule,
        ReactiveFormsModule,
        WithNowDirective,
        DatePipesModule,
        DateTimeModule,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodayVsNowSampleComponent
{
    protected datetimeControl: FormControl<unknown> = new FormControl(null);
    protected datetimeControl2: FormControl<unknown> = new FormControl(null);
}
```

```html
<div class="flex-row column-gap-small margin-bottom-extra-small">
    <div class="flex-1">
        <div>Raw value: {{datetimeControl.value | json}}</div>
        <div>Date value: {{datetimeControl.value | dateFormat: 'dateTime'}}</div>
    </div>

    <div class="flex-1">
        <div>Raw value: {{datetimeControl2.value | json}}</div>
        <div>Date value: {{datetimeControl2.value | dateFormat: 'dateTime'}}</div>
    </div>
</div>

<div class="flex-row column-gap-small">
    <div class="form-group flex-1">
        <label class="control-label">today</label>
        <input class="form-control" dateTime dateTimeInput withPicker withTime withToday [formControl]="datetimeControl">
    </div>

    <div class="form-group flex-1">
        <label class="control-label">now</label>
        <input class="form-control" dateTime dateTimeInput withPicker withTime withNow [formControl]="datetimeControl2">
    </div>
</div>
```

### Input Handlers

Demonstrates the difference between `withSimpleHandler` (simple arrow key navigation: ±1 day/±1 week) and `withHandler` (advanced segment-based keyboard navigation).

```typescript
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {DatePipesModule, DateTimeInputHandlerDirective, DateTimeModule, DateTimePickerModule, SimpleDateTimeInputHandlerDirective} from '@anglr/datetime';

@Component(
{
    selector: 'handlers-sample',
    templateUrl: 'handlersSample.component.html',
    imports:
    [
        SimpleDateTimeInputHandlerDirective,
        DateTimeInputHandlerDirective,
        DateTimePickerModule,
        ReactiveFormsModule,
        DatePipesModule,
        DateTimeModule,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandlersSampleComponent
{
    protected datetimeControl: FormControl<unknown> = new FormControl(null);
    protected datetimeControl2: FormControl<unknown> = new FormControl(null);
}
```

```html
<div class="flex-row column-gap-small margin-bottom-extra-small">
    <div class="flex-1">
        <div>Raw value: {{datetimeControl.value | json}}</div>
        <div>Date value: {{datetimeControl.value | dateFormat}}</div>
    </div>

    <div class="flex-1">
        <div>Raw value: {{datetimeControl2.value | json}}</div>
        <div>Date value: {{datetimeControl2.value | dateFormat}}</div>
    </div>
</div>

<div class="flex-row column-gap-small">
    <div class="form-group flex-1">
        <label class="control-label">simple handler</label>
        <input class="form-control" dateTime dateTimeInput withPicker withSimpleHandler [formControl]="datetimeControl">
    </div>

    <div class="form-group flex-1">
        <label class="control-label">handler</label>
        <input class="form-control" dateTime dateTimeInput withPicker withHandler [formControl]="datetimeControl2">
    </div>
</div>
```

### Different Data Types

Shows how to use different `valueFormat` options to control the output type of the form control value.

```typescript
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {DatePipesModule, DateTimeModule, DateTimePickerModule} from '@anglr/datetime';

@Component(
{
    selector: 'data-types-sample',
    templateUrl: 'dataTypesSample.component.html',
    imports:
    [
        DateTimePickerModule,
        ReactiveFormsModule,
        DatePipesModule,
        DateTimeModule,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTypesSampleComponent
{
    protected datetimeControl: FormControl<unknown> = new FormControl(null);
    protected timestampControl: FormControl<number|null> = new FormControl(null);
    protected stringControl: FormControl<string|null> = new FormControl(null);
    protected customStringControl: FormControl<string|null> = new FormControl(null);
}
```

```html
<div class="flex-row column-gap-medium margin-bottom-extra-small">
    <div class="flex-1">
        <div>Raw value: {{datetimeControl.value | json}}</div>
        <div>Date value: {{datetimeControl.value | dateFormat}}</div>
    </div>

    <div class="flex-1">
        <div>Raw value: {{timestampControl.value | json}}</div>
        <div>Date value: {{timestampControl.value | dateFormat}}</div>
    </div>

    <div class="flex-1">
        <div>Raw value: {{stringControl.value | json}}</div>
        <div>Date value: {{stringControl.value | dateFormat: 'date' : 'yyyyMMdd'}}</div>
    </div>

    <div class="flex-1">
        <div>Raw value: {{customStringControl.value | json}}</div>
        <div>Date value: {{customStringControl.value | dateFormat: 'date' : 'yyyy-MM-dd'}}</div>
    </div>
</div>

<div class="flex-row column-gap-medium">
    <div class="form-group flex-1">
        <label class="control-label">type DateInstance</label>
        <input class="form-control" dateTime dateTimeInput withPicker [formControl]="datetimeControl" valueFormat="DateInstance">
    </div>

    <div class="form-group flex-1">
        <label class="control-label">type UnixTimestamp</label>
        <input class="form-control" dateTime dateTimeInput withPicker [formControl]="timestampControl" valueFormat="Timestamp">
    </div>

    <div class="form-group flex-1">
        <label class="control-label">type FormattedString</label>
        <input class="form-control" dateTime dateTimeInput withPicker [formControl]="stringControl" valueFormat="FormattedString" customFormat="yyyyMMdd">
    </div>

    <div class="form-group flex-1">
        <label class="control-label">type DataString</label>
        <input class="form-control" dateTime dateTimeInput withPicker [formControl]="customStringControl" valueFormat="DataString" dataFormat="yyyy-MM-dd">
    </div>
</div>
```

### Customized Picker

Customizes the picker to show only month/year periods with a custom date format.

```typescript
import {Component, ChangeDetectionStrategy} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {DatePipesModule, DateTimeModule, DateTimePickerModule, DateTimePickerOptions, MonthPickerComponent, YearPickerComponent} from '@anglr/datetime';

@Component(
{
    selector: 'customized-picker-sample',
    templateUrl: 'customizedPickerSample.component.html',
    imports:
    [
        DateTimePickerModule,
        ReactiveFormsModule,
        DatePipesModule,
        DateTimeModule,
        JsonPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomizedPickerSampleComponent
{
    protected datetimeControl: FormControl<unknown> = new FormControl(null);
    protected pickerOptions: Partial<DateTimePickerOptions<unknown>>;

    constructor()
    {
        this.pickerOptions =
        {
            periodsDefinition:
            {
                month: MonthPickerComponent,
                year: YearPickerComponent,
            },
            defaultPeriod: 'month',
        };
    }
}
```

```html
<div class="flex-row margin-bottom-extra-small">
    <div class="flex-1">Raw value: {{datetimeControl.value | json}}</div>
    <div class="flex-1">Date value: {{datetimeControl.value | dateFormat: 'date': 'yyyyMM'}}</div>
</div>

<input class="form-control" dateTime dateTimeInput withPicker [formControl]="datetimeControl" [pickerOptions]="pickerOptions" valueFormat="FormattedString" customFormat="yyyyMM">
```

---

## Advanced Usage

### Relative Date Input

Users can type relative expressions in inputs configured with `DateTimeRelativeParser`:

| Expression | Result |
|------------|--------|
| `+5d` | Today + 5 days |
| `-2M` | Today - 2 months |
| `+1y` | Today + 1 year |
| `-3w` | Today - 3 weeks |
| `+2h` | Now + 2 hours |
| `-30m` | Now - 30 minutes |

### DateTimeValue Interface (Ranges)

```typescript
import {DateTimeValue} from '@anglr/datetime';

// Represents a date range
const period: DateTimeValue<Date> =
{
    from: new Date(2024, 0, 1),
    to: new Date(2024, 11, 31),
};
```

### Using DateApi in Services

```typescript
import {inject, Injectable} from '@angular/core';
import {DATE_API, DateApi} from '@anglr/datetime';

@Injectable(
{
    providedIn: 'root',
})
export class MyDateService
{
    private readonly dateApi: DateApi<Date> = inject<DateApi<Date>>(DATE_API);

    public isExpired(dateStr: string): boolean
    {
        const date = this.dateApi.getValue(dateStr, 'yyyy-MM-dd');
        const now = this.dateApi.now();

        return date.isBefore(now.value);
    }

    public getMonthRange(date: Date): {from: string; to: string}
    {
        const obj = this.dateApi.getValue(date);

        return {
            from: obj.clone().startOfMonth().format('yyyy-MM-dd'),
            to: obj.clone().endOfMonth().format('yyyy-MM-dd'),
        };
    }

    public formatForDisplay(date: Date): string
    {
        return this.dateApi.getValue(date).format('d.M.yyyy HH:mm');
    }
}
```

---

## License

[MIT](LICENSE)