import { CalendarDateFormatter, DateFormatterParams, CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { LOCALE_ID, Inject, Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class

  public weekViewHour({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'HH:mm', locale);
  }

}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  // you can override any of the methods defined in the parent class

  month(event: CalendarEvent): string {
    return `<b>${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )} - ${new DatePipe(this.locale).transform(
      event.end,
      'HH:mm',
      this.locale
    )} :</b> ${event.title} |<i> ${event['sala']} </i>`;
  }
}