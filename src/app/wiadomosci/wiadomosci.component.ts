import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby, OsobyWiadomosci } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { WiadomosciService } from '../wiadomosci.service';

@Component({
  selector: 'app-wiadomosci',
  templateUrl: './wiadomosci.component.html',
  styleUrls: ['./wiadomosci.component.css']
})
export class WiadomosciComponent implements OnDestroy {


  @ViewChild('wszyscy') wszyscy!: MatSlideToggle;
  @ViewChild('nikt') nikt!: MatSlideToggle;
  private osobysubscribe = new Subscription();
  private zakladkasubscribe = new Subscription();
  private wiadomoscisubscribe = new Subscription();
  tablicaosoby: OsobyWiadomosci[] = [];
  tablicawiadomosciold: WiadomosciService[] = []; 
  tablicawiadomosci: WiadomosciService[] = []; 
  height: any;
  width: any;
  checkedW = true;
  checkedN = false;

  constructor(private all: AppComponent, private wiadonosci: WiadomosciService, private funkcje: FunkcjeWspolneService) 
  { 
    this.height = all.wysokoscNawigacja;
    this.width = all.szerokoscZalogowani;
    this.zakladkasubscribe = funkcje.ZakladkaDialogu$.subscribe
    (
       data =>
       {
          if (data == 2) 
          {
          if (this.tablicaosoby.length == 0)
          { 
            this.wiadonosci.wczytajOsoby();
            this.wiadonosci.OdczytajWiadomosci( this.funkcje.getZalogowany().zalogowany );
          }
          }

       }
    )
    this.osobysubscribe = wiadonosci.OdczytajOsoby$.subscribe
    ( data => 
      { 
        this.tablicaosoby = data;   
      } 
    )
    this.wiadomoscisubscribe = wiadonosci.Wiadomosci$.subscribe
    ( data => 
      { 
        this.tablicawiadomosci = data;  
        //console.log(this.tablicawiadomosci) 
      } 
    )
  }

  ngOnDestroy()
  {
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
    if(this.zakladkasubscribe) { this.zakladkasubscribe.unsubscribe()}   
    if(this.wiadomoscisubscribe) { this.zakladkasubscribe.unsubscribe()}   
  }


  Przewijaj(wszystkie: string, all: boolean)
  {
    if (wszystkie == 'all')
    {
      this.tablicaosoby.forEach(element => { element.wybrany = all });
      if (!this.checkedW) { this.wszyscy.toggle() };
      if (this.checkedN) { this.nikt.toggle() };
    }
    else
    {
      
    }
  }

}
