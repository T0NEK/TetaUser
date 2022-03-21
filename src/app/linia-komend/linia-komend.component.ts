import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Polecenia } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
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
private liniablokada = '';
blokada = true;
private stanpolecenia: Polecenia;
szerokoscInput: any;
dlugoscInput: any;
wysokoscInput = 42;
maxLenght: number;

constructor(private polecenia: PoleceniaService, private petla: PetlaService, private funkcje: FunkcjeWspolneService, private all: AppComponent, private wiadomosci: WiadomosciService, private changeDetectorRef: ChangeDetectorRef )
  {
    //console.log('con linia kom')
      this.stanpolecenia = {"nazwa": "", "czas": 500, "prefix": "", "komunikat": "", "sufix": "", "dzialanie": "bad", "polecenie": true, "nastepnyTrue": "brak", "nastepnyFalse": "brak"}
      this.szerokoscInput = all.szerokoscAll;   
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
              this.szerokoscInput =((this.linia + this.liniaP).length == 0 ?  all.szerokoscAll : all.szerokoscInput)
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
              this.szerokoscInput = all.szerokoscAll;  
             //setTimeout(() => {
              this.linia = data.komunikat.liniaL;
              this.liniaH = '*'.repeat(this.linia.length);
              this.liniaP = data.komunikat.liniaP;
              this.liniaHP = '*'.repeat(this.liniaP.length);
            // },50)  
            }
            else
            { 
              this.szerokoscInput = ((this.linia + this.liniaP).length == 0 ?  all.szerokoscAll : all.szerokoscInput) 
              this.linia = data.komunikat.liniaL;
              this.liniaH = '*'.repeat(this.linia.length);
              this.liniaP = data.komunikat.liniaP;
              this.liniaHP = '*'.repeat(this.liniaP.length);
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
                this.haslo = ( data == 'on' ? true : false);
                //this.liniaInput.nativeElement.focus();
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
console.log(data)
              let nowyznak = this.DodajZnak(data);
console.log(nowyznak)              
              switch (nowyznak.dzialanie.znak) {
                case '&enter' :   this.funkcje.ZablokujLinieDialogu({"liniaL": "", "liniaP": ""})
                                  this.WybranoEnter(nowyznak.liniaL + nowyznak.liniaP)
                          break;
                case 8593     :   this.PokazHistorie(-1); //góra
                          break;
                case 8595     :   this.PokazHistorie(1); //dół
                          break;
                case "&zakres" :   this.ZaDlugiTekst({"liniaL": nowyznak.liniaL, "liniaP": nowyznak.liniaP}, nowyznak.dzialanie.wynik) 
                          break;
                default:
                  //console.log(this.maxLenght)
                this.linia = nowyznak.liniaL;
                this.liniaH = '*'.repeat(this.linia.length);
                this.liniaP = nowyznak.liniaP;
                this.liniaHP = '*'.repeat(this.liniaP.length);
                this.szerokoscInput = ((this.linia + this.liniaP).length == 0 ? all.szerokoscAll :  all.szerokoscInput)
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
    if (!(rodzaj.pusta))  { this.funkcje.ZablokujLinieDialogu({"liniaL":'empty', "liniaP": ""}) }
    if (!(rodzaj.znaki))  { 
                          this.funkcje.ZablokujLinieDialogu({"liniaL":'max ' + this.maxLenght + ' znaków', "liniaP": ""}) 
                          if (tekst.liniaL.length > this.maxLenght) 
                          { tekst.liniaL = tekst.liniaL.substring(0, this.maxLenght); tekst.liniaP = ''; }
                          else
                          { tekst.liniaP = tekst.liniaP.substring(0, this.maxLenght - tekst.liniaL.length); }
                          }
    if (!(rodzaj.dlugosc)) {this.funkcje.ZablokujLinieDialogu({"liniaL":'zbyt dużo znaków', "liniaP": ""}) }
    setTimeout(() => 
              {  
              this.funkcje.OdblokujLinieDialogu({"liniaL": tekst.liniaL, "liniaP": tekst.liniaP})
              },1200)
  }
  
  Zmiana(event: any)
  {
  //  console.log('ZMIANA', event) 
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
      case 'Home':      this.funkcje.LiniaDialoguChar(8593); break;
      case 'ArrowDown': this.funkcje.LiniaDialoguChar(8595); break;
      case 'End':       this.funkcje.LiniaDialoguChar(8595); break;
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
            { console.log('error Zmiana: ', event) }
        }
      break;
    }
  }
/* (start) funkcje lini Input*/





ClearLinia()
{
  this.linia = ''; this.liniaP = '';
  this.liniaH = ''; this.liniaHP = '';
  this.szerokoscInput = this.all.szerokoscAll;
}  
/* (end) funkcje lini Input*/

/* (start) historia poleceń */
private linie = Array ('pomoc', 'zapisz', 'zamknij', '1644743771H5V129934757909', 'edytuj', 'notatka','notatki','wersja','john','liu','zaloguj');
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
  let linia = ''; 
    if ( this.linie_wskaznik < 0) 
    {
      this.funkcje.ZablokujLinieDialogu({"liniaL":'koniec historii', "liniaP": ""})
      this.linie_wskaznik = 0;
      if (this.linie.length > 0) { linia = this.linie[0]; } else { linia = ''}
      setTimeout(() => {
      this.funkcje.OdblokujLinieDialogu({"liniaL":linia, "liniaP": ""})
      },1200)
    }
    else 
    if ( this.linie_wskaznik < this.linie.length )  
    {
      this.linia = this.linie[this.linie_wskaznik];
      this.szerokoscInput = ((this.linia + this.liniaP).length == 0 ? this.all.szerokoscAll :  this.all.szerokoscInput)
    }
    else
    {
      this.linie_wskaznik = this.linie.length; 
    }
  
}
/* (end) historia poleceń */

WybranoEnter(linia: string)
{
  console.log(linia)
  if ((this.funkcje.getNrZakladki() == 2 )&&(this.funkcje.getZalogowany().zalogowany != 0))
  {
    this.wiadomosci.WyslijWiadomosc.next(linia);
  }
  else
  {  
    let polecenie: any;
    if (this.haslo)
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
      //   this.funkcje.OdblokujLinieDialogu('');
        }, this.stanpolecenia.czas);
      }   
  }
}


DodajZnak(znak: any)
{
    let linia = this.linia;
    let liniaP = this.liniaP;
    let wynik: any;
    this.linia = '';
    this.liniaP = '';
//console.log('znak  ',znak)
//console.log('blokada  ',this.blokada)
if (!this.blokada)
{  
  switch (znak) {
      case '&enter' :  wynik = this.SprawdzDlugosc(linia,liniaP,'');
      console.log(wynik)
                      if (!(wynik.pusta && wynik.dlugosc && (this.funkcje.getNrZakladki() == 2 ? true : wynik.znaki )))
                      { znak = "&zakres" }
                      break;
      case 8593     :  break;
      case 8595     :  break;
      case '&delall'    : linia = ''; liniaP = ''; break;
      case '&back'  :   linia = linia.substring(0,linia.length-1); break;
      case '&del'   :   liniaP = liniaP.substring(1); break;
      case '&bad'   :   break;
      case 8592     :   liniaP = linia.substring(linia.length-1) + liniaP;  linia = linia.substring(0,linia.length-1); break;
      case 8594     :   linia = linia + liniaP.substring(0,1);  liniaP = liniaP.substring(1); break;
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
