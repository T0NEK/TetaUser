import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby } from '../definicje';
import { OsobyService } from '../osoby.service';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';

@Component({
  selector: 'app-zalogowani-uzytkownicy',
  templateUrl: './zalogowani-uzytkownicy.component.html',
  styleUrls: ['./zalogowani-uzytkownicy.component.css']
})
export class ZalogowaniUzytkownicyComponent implements OnDestroy {

  private osobysubscribe_zu = new Subscription();
  //private gosciesubscribe_zu = new Subscription();
  tablicaosoby: Osoby[] = [];
  //tablicagoscie: Osoby[] = [];
  height: any;
  width: any;
  zalogowany: number = 0;

constructor(private all: AppComponent, private osoby: OsobyService, private funkcje: FunkcjeWspolneService) 
  {
    this.height = all.wysokoscNawigacja;
    this.width = all.szerokoscZalogowani;
    //console.log(this.height)
    this.osobysubscribe_zu = osoby.OdczytajOsoby$.subscribe
    ( data => 
      {
        data.forEach((element: Osoby) => 
        { 
          //console.log('1 ',element.id)
          //console.log('2 ',this.funkcje.getZalogowany().zalogowany)
          //console.log('3 ',element.zalogowany)
          if ((element.id == this.funkcje.getZalogowany().zalogowany)&&(!element.zalogowany))
          { this.funkcje.setWylogowany(funkcje.getZalogowany().zalogowany) ;
            this.zalogowany = funkcje.getZalogowany().zalogowany;
            //console.log('                     coś')
          }
          else
          if ((element.id == this.funkcje.getZalogowany().zalogowany)&&(element.zalogowany))
          { this.funkcje.setWylogowany(0);
            this.zalogowany = 0;
            //console.log('zero')
          }
        }
        );
        this.tablicaosoby = data; 
      //console.log( this.tablicaosoby[7].id, this.tablicaosoby[7].zalogowany )
      } )
   //this.gosciesubscribe_zu = osoby.OdczytajGoscie$.subscribe
   // ( data => { this.tablicagoscie = data; } )
  }

  ngOnDestroy()
  {
    if(this.osobysubscribe_zu) { this.osobysubscribe_zu.unsubscribe()}   
    //if(this.gosciesubscribe_zu) { this.gosciesubscribe_zu.unsubscribe()}   
  }

}
