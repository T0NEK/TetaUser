import { Component } from '@angular/core';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: Window, useValue: window }],
  host: {
    "(window:resize)":"onWindowResize($event)",
    "(click)":"onClick($event)",
  //  "(window:keypress)":"onKeyDown($event)"
  }  
})
export class AppComponent 
{
  title = 'TetaAdmin';
  public wysokoscAll: any;
  public wysokoscInfo = 32;
  public wysokoscNawigacja: any;
  public wysokoscPrzewijaj = 24;
  public wysokoscDialogMin = 120;
  public wysokoscKlw = 100;
  public wysokoscLinia = 40;
  public szerokoscAll: any;
  public szerokoscInput: any;
  public szerokoscClear = 40;
  
  


constructor(private funkcje: FunkcjeWspolneService, private window: Window)
  {
  //  console.log(window.innerWidth)
  //  console.log(window.outerWidth)
    console.log(window.innerHeight)
    console.log(window.outerHeight)
    this.wysokoscAll = window.innerHeight;
    this.szerokoscAll = window.innerWidth
    this.wysokoscNawigacja = (this.wysokoscAll - this.wysokoscInfo - this.wysokoscKlw - this.wysokoscLinia - this.wysokoscDialogMin - this.wysokoscPrzewijaj);
    console.log(this.wysokoscNawigacja);
    this.szerokoscInput = this.szerokoscAll - this.szerokoscClear;
  }

onClick(kto: any)
  {
    //console.log(kto);
    this.funkcje.fokusLiniaDialogu()
  }

onKeyDown(kto: KeyboardEvent)
{
  console.log(kto.key);
  console.log(kto.altKey);
  console.log(kto.shiftKey);
  console.log(kto);
  //this.funkcje.LiniaDialoguChar(kto.key.charCodeAt(0))
}

onWindowResize(event: any) {
  //console.log('this.innerwidth', event.target.innerWidth,'this.innerheight', event.target.innerHeight,'this.outerwidth', event.target.outerWidth,'this.outerheight', event.target.outerHeight)
}

}
