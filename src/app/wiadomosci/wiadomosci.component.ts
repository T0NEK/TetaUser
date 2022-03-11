import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class WiadomosciComponent implements OnDestroy, AfterViewInit {


  @ViewChild('wszyscy') wszyscy!: MatSlideToggle;
  @ViewChild('nikt') nikt!: MatSlideToggle;
  private osobysubscribe = new Subscription();
  private zakladkasubscribe = new Subscription();
  private wiadomoscisubscribe = new Subscription();
  tablicaosoby: OsobyWiadomosci[] = [];
  tablicaosobywybrane: number[] = [];
  tablicawiadomosciorg: Wiadomosci[] = []; 
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
          { if (this.checked) { this.Przewin()} }
          }

       }
    )
    this.osobysubscribe = wiadonosci.OdczytajOsoby$.subscribe
    ( data => 
      { 
        this.tablicaosoby = data;   
        this.tablicaosoby.forEach((element, index) => { this.tablicaosobywybrane[index] = -1; });
        console.log(this.tablicaosobywybrane)
      } 
    )
    this.wiadomoscisubscribe = wiadonosci.Wiadomosci$.subscribe
    ( data => 
      { 
        this.tablicawiadomosciorg = data.wiadomosci;  
        this.tablicawiadomosci = this.AktualizujWybraneOsoby(data.wiadomosci)
        if (this.checked) { this.Przewin()}
        //changeDetectorRef.detectChanges();
        //this.VSVDialog.checkViewportSize()
      } 
    )

  }

  ngOnDestroy()
  {
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
    if(this.zakladkasubscribe) { this.zakladkasubscribe.unsubscribe()}   
    if(this.wiadomoscisubscribe) { this.zakladkasubscribe.unsubscribe()}   
  }

  ngAfterViewInit()
  {
  //console.log('AV dialog')
    //this.tablicazawartosci = this.funkcje.getLinieDialogu(); 
    this.changeDetectorRef.detectChanges();
    this.VSVDialog.checkViewportSize()
  } 

AktualizujWybraneOsoby(tabela: Wiadomosci[]): Wiadomosci[]
{
  //console.log(this.tablicaosobywybrane)
  let tabelawynik: Wiadomosci[] = []
  for (let index = 0; index < tabela.length; index++) 
  {
    if ( this.tablicaosobywybrane.includes(tabela[index].id) )
    {
      tabelawynik = [...tabelawynik, tabela[index]]
    }    
  }
  return tabelawynik
}


  Przelacz(wszystkie: number, all: boolean)
  {
    console.log(wszystkie)
    console.log(all)
    
    if (wszystkie == -1)
    {
      this.tablicaosoby.forEach((element, index) => 
        { 
          element.wybrany = all;
          this.tablicaosobywybrane[index] = (all ? element.id : -1);
        });
        
      if (!this.checkedW) { this.wszyscy.toggle() };
      if (this.checkedN) { this.nikt.toggle() };
    }
    else
    {
      this.tablicaosoby[wszystkie].wybrany = !all;
      this.tablicaosobywybrane[wszystkie] = (!all ? (this.tablicaosoby[wszystkie].id) : -1);
    }
  this.tablicawiadomosci = this.AktualizujWybraneOsoby(this.tablicawiadomosciorg)  
  console.log(this.tablicawiadomosci)
  console.log(this.tablicaosobywybrane)
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
    let count = this.VSVDialog.getDataLength();
    this.changeDetectorRef.detectChanges();
    this.VSVDialog.checkViewportSize()
    this.VSVDialog.scrollToIndex((count), 'smooth'); 
  }
  
}
