import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby, OsobyWiadomosci, Wiadomosci, Wiersze } from '../definicje';
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
  tablicawiadomosci: Wiadomosci[] = []; 
  height: any;
  width: any;
  width1: any;
  checkedW = true;
  checkedN = false;

  checked = true;
  @ViewChild('scrollViewportDialog') VSVDialog!: CdkVirtualScrollViewport;


  constructor(private all: AppComponent, private wiadonosci: WiadomosciService, private funkcje: FunkcjeWspolneService, private changeDetectorRef: ChangeDetectorRef) 
  { 
    this.height = (all.wysokoscNawigacja - all.wysokoscDialogMin) + 'px' ;
    this.width = (all.szerokoscZalogowani + 10) + 'px';
    this.width1 = (all.szerokoscAll - 2 * all.szerokoscZalogowani - 20) + 'px';
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
        this.tablicawiadomosci = data.wiadomosci;  
        changeDetectorRef.detectChanges();
        this.VSVDialog.checkViewportSize()
        console.log(this.tablicawiadomosci) 
      } 
    )

    
  }

  ngOnDestroy()
  {
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
    if(this.zakladkasubscribe) { this.zakladkasubscribe.unsubscribe()}   
    if(this.wiadomoscisubscribe) { this.zakladkasubscribe.unsubscribe()}   
  }


  Przelacz(wszystkie: string, all: boolean)
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

  onClick(kto: string)
  {// dla przewijaj
      this.funkcje.fokusLiniaDialogu('');
  }

  Przewijaj()
  {   
    if ((!this.checked)) { this.Przewin() }
  }

  Przewin()
  {
    //let count = this.VSVDialog.getDataLength();
    //this.changeDetectorRef.detectChanges();
    //this.VSVDialog.checkViewportSize()
    //this.VSVDialog.scrollToIndex((count), 'smooth'); 
  }
  
}
