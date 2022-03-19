import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { CzasService } from '../czas.service';
import { Osoby, OsobyWiadomosci, Wiadomosci, Wiersze } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { KomunikacjaService } from '../komunikacja.service';
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
  private logowaniesubscribe = new Subscription();
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


  constructor(private all: AppComponent, private wiadomosci: WiadomosciService, private funkcje: FunkcjeWspolneService, private czas: CzasService, private komunikacja: KomunikacjaService, private changeDetectorRef: ChangeDetectorRef) 
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
            if (this.funkcje.getZalogowany().zalogowany == 0)
            {
              this.tablicaosoby = [];
              this.tablicaosobywybrane = [];
              this.tablicawiadomosciorg = []; 
              this.tablicawiadomosci = []; 
              //this.wiadomosci.wczytajOsoby(this.funkcje.getZalogowany().zalogowany);
            }
            else
            {
            //this.wiadomosci.wczytajOsoby(this.funkcje.getZalogowany().zalogowany);
            //this.wiadomosci.OdczytajWiadomosci( this.funkcje.getZalogowany().zalogowany );
            }
          { if (this.checked) { this.Przewin()} }
         }
      }  
    )
    this.osobysubscribe = wiadomosci.OdczytajOsoby$.subscribe
    ( data => 
      { 
        this.tablicaosoby = data;   
        this.tablicaosoby.forEach((element, index) => { this.tablicaosobywybrane[index] = -1; });
      } 
    )
    this.wiadomoscisubscribe = wiadomosci.Wiadomosci$.subscribe
    ( data => 
      { 
        let wiadomosci: Wiadomosci[] = [];
        
        const dlugosc = all.szerokoscAll - 4.5 * all.szerokoscZalogowani;
        for (let index = 0; index < data.wiadomosci.length; index++) 
        {
        if (this.funkcje.DlugoscTekstu(data.wiadomosci[index].tresc[0]) > dlugosc )  
        {
          let tresc: string[] = [];
          let tresc1: string = '';
          let tresc2: string = '';
          let spacja: boolean = false;
          for (let index2 = 0; index2 < data.wiadomosci[index].tresc[0].length; index2++) 
          {
            //console.log(this.funkcje.DlugoscTekstu(tresc2 + tresc1))
            if (this.funkcje.DlugoscTekstu(tresc2 + tresc1) > dlugosc )  
            {
              if (spacja)
              { tresc = [...tresc, tresc2]; tresc2 = '', spacja = false}
              else
              { tresc = [...tresc, tresc1]; tresc1 = '';}
            }
            else
            {
              if (data.wiadomosci[index].tresc[index2] == ' ')
              {
                spacja = true;
                tresc2 = tresc1 + ' '; 
                tresc1 = '';
              }
              else
              {
                tresc1 = tresc1 + data.wiadomosci[index].tresc[0][index2]; 
              }
            }
          }
          tresc = [...tresc, tresc2+tresc1];
          data.wiadomosci[index].tresc = tresc;
          wiadomosci = [...wiadomosci, data.wiadomosci[index]]
        }
        else
        {
          wiadomosci = [...wiadomosci, data.wiadomosci[index]]
        }
          
        }
        this.tablicawiadomosciorg = data.wiadomosci;  
        this.tablicaosoby = this.AktualizujOsobyNoweWiadomosci(this.tablicaosoby, data.nadawcy)
        this.tablicawiadomosci = this.AktualizujWybraneOsoby(data.wiadomosci);
        //this.AktualizujPrzeczytane(this.tablicawiadomosci);
        if (this.checked) { this.Przewin()}
        //changeDetectorRef.detectChanges();
        //this.VSVDialog.checkViewportSize()
      } 
    )

    this.wiadomoscisubscribe = wiadomosci.ZmianyWiadomosci$.subscribe
    ( data => 
      { 
        if (!data.wynik)
        {
        this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(), data.komunikat);
        }
        else
        {
          if (data.odczytane != 0)
          {
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(),'odczytano '+data.odczytane+' wiadomości')
          }
        }
      } 
    )

    this.wiadomoscisubscribe = wiadomosci.WyslijWiadomosc$.subscribe
    ( data => 
      { 
        let odbiorcy = '0';
        this.tablicaosobywybrane.forEach(element => 
          { if (element > 0) { odbiorcy = odbiorcy + ',' + element }
          });
        //console.log(odbiorcy, this.funkcje.getZalogowany().zalogowany, data, this.czas.getCzasDedala())
          
        if (odbiorcy.length > 1)  
        {
          this.wiadomosci.WyslijWiadomosci(odbiorcy, this.funkcje.getZalogowany().zalogowany, data, this.czas.getCzasDedala())
          this.funkcje.OdblokujLinieDialogu('',0)
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'musisz wybrać adresata')
          this.funkcje.OdblokujLinieDialogu(data,data.length)
        }

      } 
    )
  }

  ngOnDestroy()
  {
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
    if(this.zakladkasubscribe) { this.zakladkasubscribe.unsubscribe()}   
    if(this.wiadomoscisubscribe) { this.zakladkasubscribe.unsubscribe()}   
    if(this.logowaniesubscribe) { this.logowaniesubscribe.unsubscribe()}   
  }

  ngAfterViewInit()
  {
  //console.log('AV dialog')
    //this.tablicazawartosci = this.funkcje.getLinieDialogu(); 
    this.changeDetectorRef.detectChanges();
    this.VSVDialog.checkViewportSize()
  } 

AktualizujOsobyNoweWiadomosci(tabela: OsobyWiadomosci[], nadawcy: number[]): OsobyWiadomosci[]
{
  tabela.forEach(element => 
    {
      element.nowe = nadawcy.includes(1*element.id);
    });
  return tabela;
}

AktualizujPrzeczytane(tabela: Wiadomosci[])
{
  let tabelawynik = '0';
  let odczytane = 0;
  for (let index = 0; index < tabela.length; index++) 
  {
    if ((tabela[index].przeczytana == false)&&(tabela[index].wyslana==false))
    { 
      odczytane++;
      tabelawynik = tabelawynik + ',' + tabela[index].id.toString(); 
    }
  }
  if (odczytane != 0)
  { 
    this.wiadomosci.AktualizujPrzeczytane(tabelawynik, this.funkcje.getZalogowany().zalogowany,odczytane); 
  }  
  
}


AktualizujWybraneOsoby(tabela: Wiadomosci[]): Wiadomosci[]
{
  //console.log(this.tablicaosobywybrane)
  let tabelawynik: Wiadomosci[] = []
  for (let index = 0; index < tabela.length; index++) 
  {
    if (( this.tablicaosobywybrane.includes(1*tabela[index].autor) )||((1*tabela[index].autor == this.funkcje.getZalogowany().zalogowany )&&( this.tablicaosobywybrane.includes(1*tabela[index].odbiorca))))
    {
      tabelawynik = [...tabelawynik, tabela[index]];
    }    
  }
  return tabelawynik
}


  Przelacz(wszystkie: number, all: boolean)
  {
    if (wszystkie == -1)
    {
      this.tablicaosoby.forEach((element, index) => 
        { 
          element.wybrany = all;
          this.tablicaosobywybrane[index] = (all ? 1*element.id : -1);
        });
        
      if (!this.checkedW) { this.wszyscy.toggle() };
      if (this.checkedN) { this.nikt.toggle() };
    }
    else
    {
      this.tablicaosoby[wszystkie].wybrany = !all;
      this.tablicaosobywybrane[wszystkie] = (!all ? (1*this.tablicaosoby[wszystkie].id) : -1);
    }
  this.tablicawiadomosci = this.AktualizujWybraneOsoby(this.tablicawiadomosciorg);
  this.AktualizujPrzeczytane(this.tablicawiadomosci);
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
