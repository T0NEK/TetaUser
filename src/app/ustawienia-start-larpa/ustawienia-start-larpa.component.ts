import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CzasService } from '../czas.service';

@Component({
  selector: 'app-ustawienia-start-larpa',
  templateUrl: './ustawienia-start-larpa.component.html',
  styleUrls: ['./ustawienia-start-larpa.component.css']
})
export class UstawieniaStartLarpaComponent implements OnInit, OnDestroy {

  buttonSTARTdisabled!: boolean;
  buttonPAUSEdisabled!: boolean;
  buttonSTOPdisabled!: boolean;
  private startstop_subscribe_sl = new Subscription();
  czas_rzeczywisty_start: any;
  czas_rzeczywisty_end: any;
  czas_trwania: any;


  constructor(private czasy: CzasService) 
   {
    this.startstop_subscribe_sl = czasy.GetStartStop$.subscribe
           ( data => {
                      this.buttonSTARTdisabled = ( data == 'START' ? true:false);
                      this.buttonSTOPdisabled = ( data == 'STOP' ? true:false);
                      this.czas_rzeczywisty_start = czasy.getCzasRzeczywistyStart();
                      this.czas_rzeczywisty_end = czasy.getCzasRzeczywistyEnd();
                      this.czas_trwania = ( czasy.getCzasRzeczywistyEnd() != '' ?  czasy.formatUplyw(czasy.getCzasRzeczywistyStart(),czasy.getCzasRzeczywistyEnd()):'')
                      } );
   }

ngOnInit() 
  {
  }

ngOnDestroy()
{
  this.startstop_subscribe_sl.unsubscribe();
}

start()
  {
    this.czasy.setStart();
  }

stop()
  {
    this.czasy.setStop()
  }

}
