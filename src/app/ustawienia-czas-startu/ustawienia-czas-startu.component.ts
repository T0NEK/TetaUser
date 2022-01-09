import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CzasService } from '../czas.service';
import { MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {defaultFormat as _rollupMoment} from 'moment';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY.MM.DD',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'YYYY.MM.DD',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'app-ustawienia-czas-startu',
  templateUrl: './ustawienia-czas-startu.component.html',
  styleUrls: ['./ustawienia-czas-startu.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  //changeDetection : ChangeDetectionStrategy.OnPush
  })

export class UstawieniaCzasStartuComponent implements OnInit, AfterViewInit, OnDestroy {
  
  events: any;
  buttonDSNdisabled: boolean;
  buttonDSOdisabled: boolean;
  buttonDSAPdisabled: boolean;
  inputDSvalue : any;
  czas_startu_org: any;
  czas_startu_new: any;
  czas_startu_poprz: any;
  private czas_startu_new_subscribe = new Subscription();
  timeDataStartuNew: NgbTimeStruct  = { hour: 12, minute: 0, second: 0};
  seconds = true;
  
  constructor(private czasy: CzasService, private changeDetectorRef: ChangeDetectorRef ) 
  {
   this.czas_startu_new_subscribe = czasy.OdczytajCzasStartu$.subscribe
     ( data => { this.czas_startu_org = data;
    //changeDetectorRef.detectChanges()
    } )
   this.buttonDSNdisabled = true;
   this.buttonDSOdisabled = false;  
   this.buttonDSAPdisabled = true;     
  }

ngOnInit() 
  { 
    
  }

ngAfterViewInit()
  {

  } 

ngOnDestroy()
  {
    this.czas_startu_new_subscribe.unsubscribe();
  }

  DataChange(type: string, event: MatDatepickerInputEvent<Date>) 
  {
   this.buttonDSNdisabled = false;
   this.czas_startu_new = _moment(event.value);
     }


data_startu_new()
  {
    this.czas_startu_poprz = this.czasy.getCzasStartu();
    this.czas_startu_new.hour(this.timeDataStartuNew.hour).minute(this.timeDataStartuNew.minute).seconds(this.timeDataStartuNew.second);
    this.czasy.zapisz_data_startu(10, this.czas_startu_new.format('YYYY-MM-DD HH:mm:ss'));
    this.buttonDSOdisabled = false;
    this.buttonDSAPdisabled = false;
  }

data_startu_poprz()
  {
    let czas = this.czasy.getCzasStartu() 
    this.czasy.zapisz_data_startu(10, this.czas_startu_poprz);
    this.czas_startu_poprz = czas;
  //this.buttonDSAPdisabled = true;
  }

data_startu_org()
  {
    this.czas_startu_poprz = this.czasy.getCzasStartu(); 
    this.czasy.zapisz_data_startu(10, this.czas_startu_org);
  // this.buttonDSOdisabled = true;
  }

}
