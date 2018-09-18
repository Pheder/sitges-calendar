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
  NgbAccordion
} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarView
} from 'angular-calendar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent  {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date(2018, 9, 1);

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
  title: string = "";

  activeDayIsOpen: boolean = false;

  constructor(private http: HttpClient) {

    let movies = localStorage.getItem('movies');
    if (movies) {
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
      this.events.push(session);
      session.active = true;
    }
    this.refresh.next();
    localStorage.setItem('movies', JSON.stringify(this.movies));
  }

}
