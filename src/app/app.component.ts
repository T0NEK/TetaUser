import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: Window, useValue: window }],
  host: {
    "(window:resize)":"onWindowResize($event)",
  //  "(click)":"onClick($event)",
  //  "(window:keypress)":"onKeyDown($event)"
  }  
})
export class AppComponent implements OnDestroy
{
  title = 'TetaUser';
  public wysokoscAll: any;
  public wysokoscInfo = 32;
  public wysokoscNawigacja: any;
  public wysokoscPrzewijaj = 24;
  public wysokoscDialogMin = 120;
  public wysokoscKlw = 100;
  public wysokoscLinia = 42;
  public szerokoscAll: any;
  public szerokoscInput: any;
  public szerokoscClear = 46;
  @ViewChild('content') content!: ElementRef;
  @HostListener('click',['$event']) onClick1(event: any) { this.onClick(event)}
  //@HostListener('keydown',['$event']) onClick4(event: any) { this.onKeyup(event) }
  private blokada_subscribe_app = new Subscription();
  private modalCzekaj: any;


constructor(config: NgbModalConfig, private modalService: NgbModal, private funkcje: FunkcjeWspolneService, private window: Window)
  {
  //  console.log(window.innerWidth)
  //  console.log(window.outerWidth)
  //  console.log(window.innerHeight)
  //  console.log(window.outerHeight)
    this.wysokoscAll = window.innerHeight;
    this.szerokoscAll = window.innerWidth
    this.wysokoscNawigacja = (this.wysokoscAll - this.wysokoscInfo - this.wysokoscKlw - this.wysokoscLinia - this.wysokoscDialogMin - this.wysokoscPrzewijaj);
  //  console.log(this.wysokoscNawigacja);
    this.szerokoscInput = this.szerokoscAll - this.szerokoscClear;

    config.backdrop = 'static';
    config.keyboard = false;
    config.centered = true;
    config.backdropClass = 'light-blue-backdrop';
  
    this.blokada_subscribe_app = funkcje.LiniaDialoguBlokada$.subscribe 
    ( data => 
      {
//              console.log('blokuj',data);
        if (data.blokada)
        {
          this.openCzekaj()
        }
        else
        {
          this.closeCzekaj()
        }
        
      } );    
  }

ngOnDestroy()
{
  this.blokada_subscribe_app.unsubscribe()    
}  

openCzekaj() 
{
 this.modalCzekaj = this.modalService.open(this.content);
}

closeCzekaj()
{
this.modalCzekaj.close()
}  


onClick(kto: any)
  {
    //console.log('app   ',kto);
    //console.log(kto.target);
    //console.log('>',kto.target.innerText,'<');
    //console.log(kto.target.className);
    //console.log(kto.target.classList);
    

    if ( kto.target.classList.contains('liniakomend') )
    { this.funkcje.fokusLiniaDialogu(kto.target.innerText) }
    else if ( kto.target.classList.contains('notatki') )
    { this.funkcje.fokusPoleNotatki() }
    else
    { this.funkcje.fokusLiniaDialogu('') }
  }

onKeyDown(kto: KeyboardEvent)
{
  //console.log(kto.key);
  //console.log(kto.altKey);
  //console.log(kto.shiftKey);
  //console.log(kto);
  //this.funkcje.LiniaDialoguChar(kto.key.charCodeAt(0))
}

onWindowResize(event: any) {
  //console.log('this.innerwidth', event.target.innerWidth,'this.innerheight', event.target.innerHeight,'this.outerwidth', event.target.outerWidth,'this.outerheight', event.target.outerHeight)
}

}
