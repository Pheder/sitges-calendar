import {
  Component
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import {
  Subject
} from 'rxjs';
import {
  NgbAccordion,
  NgbAlert
} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarView,
  DAYS_OF_WEEK,
  CalendarDateFormatter,
  CalendarEventTitleFormatter
} from 'angular-calendar';

import { CustomDateFormatter, CustomEventTitleFormatter } from './custom-date-formatter.provider';

const APP_VERSION = 1;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: CustomDateFormatter
  },
  {
    provide: CalendarEventTitleFormatter,
    useClass: CustomEventTitleFormatter
  }]
})

export class AppComponent  {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date(2019, 9, 1);
  weekStart: number = DAYS_OF_WEEK.MONDAY;


  actions: CalendarEventAction[] = [{
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({
        event
      }: {
        event: CalendarEvent
      }): void => {}
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({
        event
      }: {
        event: CalendarEvent
      }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
      }
    }
  ];

  refresh: Subject < any > = new Subject();

  events: CalendarEvent[] = [];
  movies: any;
  title: String = '';

  activeDayIsOpen: Boolean = false;

  constructor(private http: HttpClient) {

    const movies = localStorage.getItem('movies');
    const version =  localStorage.getItem('version') || 0;
    if (movies && version === APP_VERSION) {
      this.movies = JSON.parse(movies);
        this.movies.forEach(movie => {
          movie.actions = this.actions,
            movie.start = new Date(movie.start);
          movie.end = new Date(movie.end);
          movie.day = movie.start.getDate();
          if (movie.active) {
            this.events.push(movie);
          }
        });
    } else {
      http.get('assets/movies.json').subscribe(data => {
        data['movies'].forEach(movie => {
          movie.actions = this.actions,
          movie.start = new Date(movie.start);
          movie.end = new Date(movie.end);
          movie.day = movie.start.getDate();
        });
        this.movies = data['movies'];
        console.log(this.movies);
      });
    }


  }

  dayClicked({
    date,
    events
  }: {
    date: Date;events: CalendarEvent[]
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }


  toggle(session): void {
    if (session.active) {
      session.active = false;
      this.events.splice(this.events.indexOf(session), 1);
    } else {
      this.events = [
        ...this.events,
        session
      ];
      session.active = true;
    }
    this.refresh.next();
    localStorage.setItem('movies', JSON.stringify(this.movies));
    localStorage.setItem('version', APP_VERSION.toString() );
  }

  goShop(event){
    if(event.url){
      window.open(event.url);
    }
  }

}
