import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';

@Component({
  selector: 'app-notatki',
  templateUrl: './notatki.component.html',
  styleUrls: ['./notatki.component.css'],
  providers: [
    { provide: Window, useValue: window }],
  host: {
  //  "(window:resize)":"onWindowResize($event)",
    "(click)":"onClick($event)",
  //  "(window:keypress)":"onKeyDown($event)"
  }  
})
export class NotatkiComponent implements OnDestroy {

  @ViewChild('PoleNotatki') PoleNotatki!: ElementRef;
  private fokus_subscribe_no = new Subscription();

constructor(private funkcje: FunkcjeWspolneService)
  {
    this.fokus_subscribe_no = funkcje.PoleNotatki$.subscribe 
    ( data =>
      { 
        console.log('hello notatki')
        this.PoleNotatki.nativeElement.focus();
      } 
    );
  }

  ngOnDestroy()
  {
    this.fokus_subscribe_no.unsubscribe();    
  }

  onClick(kto: any)
  {
    console.log('app   ',kto);
    //console.log(kto.target);
    //console.log('>',kto.target.innerText,'<');
    //console.log(kto.target.className);
}



}
