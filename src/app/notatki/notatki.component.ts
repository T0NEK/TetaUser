import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
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
//  @HostListener('click',['$event']) onClick2(event: any) { this.onClick(event) }
//  @HostListener('keyup.tab',['$event']) onClick3(event: any) { this.onKeyUp(event) }
 private fokus_subscribe_no = new Subscription();
 height: any;
 notatkaTytul: string;
 notatkaStan: any;

constructor(private funkcje: FunkcjeWspolneService, private all: AppComponent)
  {
    this.height = (all.wysokoscAll - all.wysokoscInfo - all.wysokoscKlw - all.wysokoscLinia - all.wysokoscDialogMin - all.wysokoscPrzewijaj-100) + 'px';
    this.notatkaTytul = 'Wczytaj notatkę';
    this.notatkaStan = {"wczytana": false, "edycja": true};
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

  onKeyUp(kto: any)
  {
    console.log('app2   ',kto);
    //console.log(kto.target);
    //console.log('>',kto.target.innerText,'<');
    //console.log(kto.target.className);
  }


}
