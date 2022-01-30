import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby } from '../definicje';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-zalogowani-uzytkownicy',
  templateUrl: './zalogowani-uzytkownicy.component.html',
  styleUrls: ['./zalogowani-uzytkownicy.component.css']
})
export class ZalogowaniUzytkownicyComponent implements OnDestroy {

  private osobysubscribe = new Subscription();
  private gosciesubscribe = new Subscription();
  tablicaosoby: Osoby[] = [];
  tablicagoscie: Osoby[] = [];
  height: any;

constructor(private all: AppComponent, private osoby: OsobyService) 
  {
    this.height = all.wysokoscNawigacja;
    //console.log(this.height)
    this.osobysubscribe = osoby.OdczytajOsoby$.subscribe
    ( data => { this.tablicaosoby = data; } )
   //this.gosciesubscribe = osoby.OdczytajGoscie$.subscribe
   // ( data => { this.tablicagoscie = data; } )
  }

  ngOnDestroy()
  {
   if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
   if(this.gosciesubscribe) { this.gosciesubscribe.unsubscribe()}   
  }

}
