import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
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
  selector: 'app-ustawienia-czas-na-dedalu',
  templateUrl: './ustawienia-czas-na-dedalu.component.html',
  styleUrls: ['./ustawienia-czas-na-dedalu.component.css'],
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

export class UstawieniaCzasNaDedaluComponent implements OnDestroy, AfterViewInit {

  events: any;
  buttonDSANdisabled: boolean;
  buttonDSAOdisabled: boolean;
  buttonDSAPdisabled: boolean;
  buttonDSAFdisabled: boolean;
  inputDSvalue : any;
  czas_startu_org: any;
  czas_startu_new: any;
  czas_startu_poprz: any;
  czas_startu_pier: any;
  private czas_startu_akcji_subscribe_cd = new Subscription();
  private czas_startu_akcji_org_subscribe_cd = new Subscription();
  timeDataStartuNew: NgbTimeStruct  = { hour: 12, minute: 0, second: 0};
  seconds = true;
  
  constructor(private czasy: CzasService,private changeDetectorRef: ChangeDetectorRef) 
  {
   this.czas_startu_akcji_subscribe_cd = czasy.OdczytajCzasDedala$.subscribe
    ( data => {
       this.czas_startu_org = data; 
       //changeDetectorRef.detectChanges();
       } );
   this.czas_startu_akcji_org_subscribe_cd = czasy.czasOryginalnyDedala$.subscribe
       ( data => {
          this.czas_startu_pier = data; 
          //changeDetectorRef.detectChanges();
          } );
   this.buttonDSANdisabled = true;
   this.buttonDSAOdisabled = false;
   this.buttonDSAPdisabled = true;
   this.buttonDSAFdisabled = false;     
  // console.log('this.czas_dedala_org_new')
  }

 ngAfterViewInit()
  {
   // console.log('AV cnd')
  } 
ngOnDestroy()
  {
    this.czas_startu_akcji_subscribe_cd.unsubscribe();
    this.czas_startu_akcji_org_subscribe_cd.unsubscribe();
  }

addEvent(type: string, event: MatDatepickerInputEvent<Date>) 
  {
   this.buttonDSANdisabled = false;  
   this.czas_startu_new = _moment(event.value); 
  }

data_startu_new()
  {
    this.czas_startu_poprz = this.czasy.getCzasDedala();
    this.czas_startu_new.hour(this.timeDataStartuNew.hour).minute(this.timeDataStartuNew.minute).seconds(this.timeDataStartuNew.second);
    this.czasy.zapisz_data_akcji(10, this.czas_startu_new.format('YYYY-MM-DD HH:mm:ss'));
    this.buttonDSAOdisabled = false;
    this.buttonDSAPdisabled = false;
    this.buttonDSAFdisabled = false;
  }

data_startu_poprz()
  {
    let czas = this.czasy.getCzasDedala() 
    this.czasy.zapisz_data_akcji(10, this.czas_startu_poprz);
    //this.czasy.changeCzasDedala( this.czas_startu_poprz );
    this.czas_startu_poprz = czas;
  //this.buttonDSAPdisabled = true;
  }

data_startu_pier()
  {
    this.czas_startu_poprz = this.czasy.getCzasDedala();
    this.czasy.zapisz_data_akcji(10, this.czasy.getCzasDedalaOryg() );
    //this.czasy.changeCzasDedala( this.czasy.getCzasDedalaOryg() );
    //this.buttonDSAOdisabled = true;
  }
    

data_startu_org()
{
  this.czas_startu_poprz = this.czasy.getCzasDedala();
  this.czasy.zapisz_data_akcji(10, this.czas_startu_org);
  //this.czasy.changeCzasDedala( this.czas_startu_org );
  //this.buttonDSAOdisabled = true;
}



}
