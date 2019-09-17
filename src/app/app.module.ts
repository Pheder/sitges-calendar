import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormsModule } from '@angular/forms';
import {NgbAccordionModule, NgbAlertModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { GroupByPipe } from './groupby';
import { SearchPipe } from './search';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/es';

registerLocaleData(locale, 'es');




@NgModule({
  declarations: [
    AppComponent,
    GroupByPipe,
    SearchPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbAccordionModule,
    NgbAlertModule,
    NgbPopoverModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  exports: [SearchPipe],
  providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
