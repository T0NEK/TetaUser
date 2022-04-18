import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { CzasService } from '../czas.service';
import { DedalService } from '../dedal.service';
import { Polecenia } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { KomunikacjaService } from '../komunikacja.service';
import { PetlaService } from '../petla.service';
import { PoleceniaService } from '../polecenia.service';
import { WiadomosciService } from '../wiadomosci.service';

@Component({
  selector: 'app-linia-komend',
  templateUrl: './linia-komend.component.html',
  styleUrls: ['./linia-komend.component.css']
})
export class LiniaKomendComponent implements OnDestroy {


//@ViewChild('liniaInput') liniaInput!: ElementRef;
private fokus_subscribe_lk = new Subscription();
private blokada_subscribe_lk = new Subscription();
private haslo_subscribe_lk = new Subscription();
private poleceniahistoria_subscribe_lk = new Subscription();
private stan_polecen_subscribe_lk = new Subscription();
private add_subscribe_lk = new Subscription();
private zmien_subscribe = new Subscription();
linia = '';
liniaP = '';
liniaH = '';
liniaHP = '';
haslo = false;
hasloStan = false;
private liniablokada = '';
blokada = true;
liniaB = '';
liniaBP = '';
private stanpolecenia: Polecenia;
szerokoscInput: any;
dlugoscInput: any;
wysokoscInput = 42;
maxLenght: number;

constructor(private polecenia: PoleceniaService, private petla: PetlaService, private funkcje: FunkcjeWspolneService, private all: AppComponent, private wiadomosci: WiadomosciService, private changeDetectorRef: ChangeDetectorRef, private czasy: CzasService, private komunikacja: KomunikacjaService, private dedal: DedalService )
  {
    //console.log('con linia kom')
      this.stanpolecenia = {"id":0, "nazwa": "", "czas": 500, "prefix": "", "komunikat": "", "sufix": "", "dzialanie": "bad", "polecenie": true, "nastepnyTrue": "brak", "nastepnyFalse": "brak"}
      this.szerokoscInput = all.szerokoscAll - all.szerokoscClear;   
      this.dlugoscInput = this.szerokoscInput * 0.9 * 18 / 24; 
      this.maxLenght = funkcje.iloscZnakowwKomend;

      this.fokus_subscribe_lk = funkcje.LiniaDialogu$.subscribe 
          ( data => 
            { 
              //console.log('data ',data+'.')
              if (typeof data === 'string')
              {
               for (let index = 0; index < data.length; index++)
                {
                  //console.log(data[index])
                 this.Zmiana(data[index])
                } 

              }
              this.szerokoscInput =((this.linia + this.liniaP).length == 0 ?  all.szerokoscAll : all.szerokoscInput)  - all.szerokoscClear;
            } 
          );

      this.blokada_subscribe_lk = funkcje.LiniaDialoguBlokada$.subscribe 
          ( data => 
            {
//('blokuj',data);
//console.log('data ', data)
            this.blokada = data.stan;
            if (data.stan)
            { 
              this.szerokoscInput = all.szerokoscAll - all.szerokoscClear;  
              this.liniaB = this.linia;
              this.linia = data.komunikat.liniaL;
              this.liniaH = '*'.repeat(this.linia.length);
              this.liniaBP = this.liniaP;
              this.liniaP = data.komunikat.liniaP;
              this.liniaHP = '*'.repeat(this.liniaP.length);
            }
            else
            { 
              this.szerokoscInput = ((this.linia + this.liniaP).length == 0 ?  all.szerokoscAll : all.szerokoscInput) - all.szerokoscClear 
              if ((data.komunikat.liniaL + data.komunikat.liniaP).length == 0)
              {
                this.linia = this.liniaB;
                this.liniaP = this.liniaBP;
              }
              else
              {
              this.linia = data.komunikat.liniaL;
              this.liniaH = '*'.repeat(this.linia.length);
              this.liniaP = data.komunikat.liniaP;
              this.liniaHP = '*'.repeat(this.liniaP.length);
              }
            }
            } );    

      this.stan_polecen_subscribe_lk = funkcje.LiniaDialoguStanPolecen$.subscribe 
            ( data => 
              { 
                //console.log('stan pole',data)
                this.stanpolecenia.nazwa = (typeof data.nastepnyTrue === 'string' ? data.nastepnyTrue : 'brak');
                this.stanpolecenia.czas = (typeof data.czas === 'string' ? data.czas : ' ');
                this.stanpolecenia.komunikat = (typeof data.komunikat === 'string' ? data.komunikat : ' ');
                this.stanpolecenia.dzialanie = (typeof data.dzialanie === 'string' ? data.dzialanie : ' ');
                this.stanpolecenia.nastepnyTrue = (typeof data.nastepnyTrue === 'string' ? data.nastepnyTrue : 'brak');
                this.stanpolecenia.nastepnyFalse = (typeof data.nastepnyFalse === 'string' ? data.nastepnyFalse : 'brak');
                //this.liniaInput.nativeElement.focus();
              } 
            );
  
      this.haslo_subscribe_lk = funkcje.LiniaDialoguStanHaslo$.subscribe 
            ( data => 
              { 
                if (data == 'on')
                {
                  this.hasloStan = true;
                }
                else
                {
                this.hasloStan = false;
                this.haslo = false;
                }
              } 
            );
  
      this.poleceniahistoria_subscribe_lk = funkcje.LiniaDialoguStanHistoria$.subscribe 
            ( data => 
              { if (data == '')
                { this.KasujHistorie(); }
                else
                { this.DodajHistorie(data)}
              } 
            );
      this.zmien_subscribe = funkcje.LiniaDialoguZmien$.subscribe 
            ( data => 
              { 
                //console.log('doZmiana -', data)
                this.Zmiana(data)
                //this.liniaInput.nativeElement.focus();
              } 
            );
  

      this.add_subscribe_lk = funkcje.LiniaDialoguAddChar$.subscribe 
          ( data => 
            { 
              //console.log('add: ',data)
//console.log(data)
              let nowyznak = this.DodajZnak(data);
//console.log(nowyznak)              
              switch (nowyznak.dzialanie.znak) {
                case '&enter' :   
                                  this.linia='';
                                  this.liniaP='';
                                  this.funkcje.ZablokujLinieDialogu({"liniaL": "", "liniaP": ""})
                                  this.WybranoEnter(nowyznak.liniaL + nowyznak.liniaP);
                                  this.haslo = false;
                          break;
                case 8593     :   if (!this.hasloStan) { this.PokazHistorie(-1); } //góra
                          break;
                case 8595     :   if (!this.hasloStan) { this.PokazHistorie(1); }//dół
                          break;
                case 8648     :   if (!this.hasloStan) { this.PokazHistorie( - this.linie_wskaznik - 1 ); }//dół
                          break;
                case 8650     :   if (!this.hasloStan) { this.PokazHistorie( this.linie.length - this.linie_wskaznik ); }//dół
                          break;
                case "&zakres" :   this.ZaDlugiTekst({"liniaL": nowyznak.liniaL, "liniaP": nowyznak.liniaP}, nowyznak.dzialanie.wynik) 
                          break;
                case "&bad"    :
                          break;      
                default:
                  //console.log(this.maxLenght)  
                this.haslo = this.hasloStan;  
                this.linia = nowyznak.liniaL;
                this.liniaH = '*'.repeat(this.linia.length);
                this.liniaP = nowyznak.liniaP;
                this.liniaHP = '*'.repeat(this.liniaP.length);
                this.szerokoscInput = ((this.linia + this.liniaP).length == 0 ? all.szerokoscAll :  all.szerokoscInput) - all.szerokoscClear
                break;
              }


                
            } 
          );
  }
  
  ngOnDestroy()
  {
    this.fokus_subscribe_lk.unsubscribe();    
    this.blokada_subscribe_lk.unsubscribe();    
    this.haslo_subscribe_lk.unsubscribe();    
    this.poleceniahistoria_subscribe_lk.unsubscribe();    
    this.stan_polecen_subscribe_lk.unsubscribe();    
    this.add_subscribe_lk.unsubscribe();    
    this.zmien_subscribe.unsubscribe();    
  }

  ZaDlugiTekst(tekst: any, rodzaj: any)
  {
    this.haslo = false;
    if (!(rodzaj.pusta))  { this.funkcje.ZablokujLinieDialogu({"liniaL":'pusto', "liniaP": ""}) }
    else
    if (!(rodzaj.dlugosc)) {this.funkcje.ZablokujLinieDialogu({"liniaL":'zbyt dużo znaków', "liniaP": ""}) }
    else 
    if (!(rodzaj.znaki))  
      { 
      this.funkcje.ZablokujLinieDialogu({"liniaL":'max ' + this.maxLenght + ' znaków', "liniaP": ""}) 
      if (tekst.liniaL.length > this.maxLenght) 
      { tekst.liniaL = tekst.liniaL.substring(0, this.maxLenght); tekst.liniaP = ''; }
      else
      { tekst.liniaP = tekst.liniaP.substring(0, this.maxLenght - tekst.liniaL.length); }
      }
    setTimeout(() => 
              {  
              this.haslo = this.hasloStan;
              this.funkcje.OdblokujLinieDialogu({"liniaL": tekst.liniaL, "liniaP": tekst.liniaP})
              },1200)
  }
  
  Zmiana(event: any)
  {
   //console.log('ZMIANA', event) 
  /* 
    console.log('ZMIANA', event) 
    console.log('ZMIANA', event.key)
    console.log('pozycje', this.pozycja )
    console.log('pozycjeS', this.liniaInput.nativeElement.selectionStart )
    console.log('pozycjeE', this.liniaInput.nativeElement.selectionEnd )
    console.log('pozycje', this.liniaInput.nativeElement.value )
  */    
    switch (event) {
      case 'ArrowRight': this.funkcje.LiniaDialoguChar(8594); break;
      case 'ArrowLeft': this.funkcje.LiniaDialoguChar(8592); break;
      case 'ArrowUp':   this.funkcje.LiniaDialoguChar(8593); break;
      case 'Home':      this.funkcje.LiniaDialoguChar(8647); break;
      case 'PageDown':      this.funkcje.LiniaDialoguChar(8650); break;
      case 'ArrowDown': this.funkcje.LiniaDialoguChar(8595); break;
      case 'End':       this.funkcje.LiniaDialoguChar(8649); break;
      case 'PageUp':      this.funkcje.LiniaDialoguChar(8648); break;
      case 'Backspace': this.funkcje.LiniaDialoguChar('&back'); break;
      case 'Delete':    this.funkcje.LiniaDialoguChar('&del'); break;
      case 'Enter': this.funkcje.LiniaDialoguChar('&enter'); break;
      case 'Space': this.funkcje.LiniaDialoguChar('&space'); break;
      default:
        {        
          if (event.length == 1 )
            { 
              this.funkcje.LiniaDialoguChar(event.charCodeAt(0)); 
            }
            else
            { 
              console.log('error Zmiana: ', event) 
            }
        }
      break;
    }
  }
/* (start) funkcje lini Input*/





ClearLinia()
{
  this.linia = ''; this.liniaP = '';
  this.liniaH = ''; this.liniaHP = '';
  this.szerokoscInput = this.all.szerokoscAll - this.all.szerokoscClear;
}  
/* (end) funkcje lini Input*/

/* (start) historia poleceń */
//private linie = Array ('pomoc', 'zapisz', 'zamknij', '1646500108H53E69153004536', 'edytuj', 'notatka','notatki','wersja','john','zaloguj');
private linie = Array ('john','zaloguj','moduły','zespoły','zespoły wszystkie','zespół','lab','ZU','test','reset');
private linie_wskaznik = this.linie.length;

DodajHistorie(linia: string)
{
  this.linie.push(linia);
  this.linie_wskaznik = this.linie.length;
  //console.log('historia ',this.linie,'    wskaznik',this.linie_wskaznik )
}
KasujHistorie()
{
  this.linie = [];
  this.linie_wskaznik = 0;
}

PokazHistorie(kierunek: number)
{
  this.linie_wskaznik = this.linie_wskaznik + kierunek;
  //console.log(this.linie_wskaznik)
  //console.log(this.linie.length)
  let linia = ''; 
    if ( this.linie_wskaznik < 0) 
    {
      this.funkcje.ZablokujLinieDialogu({"liniaL":'początek historii', "liniaP": ""})
      this.linie_wskaznik = 0;
      if (this.linie.length > 0) { linia = this.linie[0]; } else { linia = ''}
      setTimeout(() => 
      {
      this.funkcje.OdblokujLinieDialogu({"liniaL":linia, "liniaP": ""})
      },800)
    }
    else 
    if ( this.linie_wskaznik < this.linie.length )  
    {
      this.linia = this.linie[this.linie_wskaznik];
      this.szerokoscInput = ((this.linia + this.liniaP).length == 0 ? this.all.szerokoscAll :  this.all.szerokoscInput) - this.all.szerokoscClear
    }
    else
    {
      this.funkcje.ZablokujLinieDialogu({"liniaL":'koniec historii', "liniaP": ""})
      this.linie_wskaznik = this.linie.length - 1; 
      if (this.linie.length > 0) { linia = this.linie[this.linie.length -1]; } else { linia = ''}
      setTimeout(() => 
      {
      this.funkcje.OdblokujLinieDialogu({"liniaL":linia, "liniaP": ""})
      },800)
    }
  
}
/* (end) historia poleceń */

WybranoEnter(linia: string)
{
//console.log("linia ", linia, "  polecenia ", this.funkcje.getPolecenia(), "  zakładka ", this.funkcje.getNrZakladki(), "  zalogowany ", this.funkcje.getZalogowany().zalogowany, "  narosl ", this.funkcje.getZalogowany().narosl)  
if (
  (this.funkcje.getPolecenia())
  || ( (!this.funkcje.getPolecenia())&&(this.funkcje.getZalogowany().narosl)&&(this.funkcje.getNrZakladki() == 2 )&&((this.funkcje.getZalogowany().zalogowany != 0)) )
  )
{
 // console.log(linia)
  if ((this.funkcje.getNrZakladki() == 2 )&&((this.funkcje.getZalogowany().zalogowany != 0)))
  {
    this.wiadomosci.WyslijWiadomosc.next(linia);
  }
  else
  {  
    let polecenie: any;
    if (this.hasloStan)
      {
        this.funkcje.addLiniaKomunikatuPolecenia(this.funkcje.getZalogowany().imie, '*'.repeat(linia.length));
      }
      else
      {
        this.funkcje.addLiniaKomunikatuPolecenia(this.funkcje.getZalogowany().imie,linia);
        this.DodajHistorie(linia);  
      }

    if (( this.stanpolecenia.nastepnyTrue == 'brak')||( this.stanpolecenia.nastepnyTrue == 'bad'))
      {
        polecenie = this.polecenia.sprawdzPolecenie(linia);
        this.polecenia.HistoriaPolecen(polecenie.id, polecenie.nazwa, this.funkcje.getZalogowany().zalogowany, this.funkcje.getZalogowany().imie + ' ' + this.funkcje.getZalogowany().nazwisko, this.czasy.getCzasDedala(), this.komunikacja.getHost());
        setTimeout(() => {
                this.petla.poleceniaWykonaj(polecenie.dzialanie, '');
      //         this.funkcje.OdblokujLinieDialogu('');
        }, polecenie.czas);
      }
      else
      {
        setTimeout(() => {
          this.petla.poleceniaWykonaj(this.stanpolecenia.nastepnyTrue,linia);
          this.funkcje.UstawStanPolecenia('');
          //this.polecenia.HistoriaPolecen(0, linia, this.funkcje.getZalogowany().zalogowany, this.funkcje.getZalogowany().imie + ' ' + this.funkcje.getZalogowany().nazwisko, this.czasy.getCzasDedala(), this.komunikacja.getHostId());
      //   this.funkcje.OdblokujLinieDialogu('');
        }, this.stanpolecenia.czas);
      }   
  }
}
else
{
  this.funkcje.ZablokujLinieDialogu({"liniaL": "", "liniaP": ""})
  setTimeout(() => 
      {
        this.funkcje.ZablokujLinieDialogu({"liniaL": "problem z komunikacją", "liniaP": ""}, true);
        setTimeout(() =>  {
                          this.funkcje.OdblokujLinieDialogu({"liniaL": linia, "liniaP": ""});
                          },5000);
      },3000);
  
}
}


DodajZnak(znak: any)
{
    let linia = this.linia;
    let liniaP = this.liniaP;
    let wynik: any;
    //this.linia = '';
    //this.liniaP = '';
//console.log('znak  ',znak)
//console.log('blokada  ',this.blokada)
if (!this.blokada)
{  
  switch (znak) {
      case '&enter' :  wynik = this.SprawdzDlugosc(linia,liniaP,'');
                      if (!(wynik.pusta && wynik.dlugosc && (this.funkcje.getNrZakladki() == 2 ? true : wynik.znaki )))
                      { znak = "&zakres" }
                      break;
      case 8593     :  break;
      case 8595     :  break;
      case 8650     :  break;
      case 8648     :  break;
      case '&delall'    : linia = ''; liniaP = ''; break;
      case '&back'  :   linia = linia.substring(0,linia.length-1); break;
      case '&del'   :   liniaP = liniaP.substring(1); break;
      case '&bad'   :   break;
      case 8592     :   liniaP = linia.substring(linia.length-1) + liniaP;  linia = linia.substring(0,linia.length-1); break;
      case 8647     :   liniaP = linia + liniaP; linia = ''; break;
      case 8594     :   linia = linia + liniaP.substring(0,1);  liniaP = liniaP.substring(1); break;
      case 8649     :   linia = linia + liniaP; liniaP = ''; break;
      case '&amp;'   :  linia = linia + '&'; break;
      case '&lt;'    :  linia = linia + '<'; break;
      case '&rt;'    :  linia = linia + '>'; break;
      case '&space' :   linia = linia + ' '; break;
      default       :   wynik = this.SprawdzDlugosc(linia,liniaP,znak);
                        if (wynik.dlugosc && (this.funkcje.getNrZakladki() == 2 ? true : wynik.znaki ))
                        { linia = linia + String.fromCharCode(znak); }
                        else
                        { znak = "&zakres"}
                        break;
    }
    //console.log('linia ', linia,'       ', this.pozycja)
    //console.log('linia ', this.linia,'       ', this.liniablokada)
}    
else
{
    this.linia = linia;
    this.liniaP = liniaP;
    znak = '&bad';
}
return {"liniaL":linia, "liniaP":liniaP,"dzialanie": {"znak":znak, "wynik": wynik}}
}

SprawdzDlugosc(liniaL: string, liniaP: string, znak: string ): any
{
  let pusta: boolean = true;
  let znaki: boolean = true;
  let dlugosc: boolean = true;
  if ((liniaL + liniaP + znak).length == 0) 
    { pusta = false; }
    else
    { 
      if ( (this.funkcje.DlugoscTekstu(liniaL + liniaP + znak) > this.dlugoscInput) )
      { dlugosc = false; } 
      if ( (liniaL + liniaP + znak).length > (this.maxLenght + 1) ) 
      { znaki = false } 
    }
return { "pusta": pusta, "znaki": znaki, "dlugosc":dlugosc }  
}  
  

}
