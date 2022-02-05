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

  private osobysubscribe_zu = new Subscription();
  private gosciesubscribe_zu = new Subscription();
  tablicaosoby: Osoby[] = [];
  tablicagoscie: Osoby[] = [];
  height: any;

constructor(private all: AppComponent, private osoby: OsobyService) 
  {
    this.height = all.wysokoscNawigacja;
    //console.log(this.height)
    this.osobysubscribe_zu = osoby.OdczytajOsoby$.subscribe
    ( data => { this.tablicaosoby = data; } )
   //this.gosciesubscribe_zu = osoby.OdczytajGoscie$.subscribe
   // ( data => { this.tablicagoscie = data; } )
  }

  ngOnDestroy()
  {
   if(this.osobysubscribe_zu) { this.osobysubscribe_zu.unsubscribe()}   
   if(this.gosciesubscribe_zu) { this.gosciesubscribe_zu.unsubscribe()}   
  }

}
