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
maxLenghtmax = 1000;

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
console.log('data ', data)
            this.blokada = data.stan;
            if (data.stan)
            { 
              this.szerokoscInput = all.szerokoscAll;  
             setTimeout(() => {
              this.linia = data.komunikat.liniaL;
              this.liniaH = '*'.repeat(this.linia.length);
              this.liniaP = data.komunikat.liniaP;
              this.liniaHP = '*'.repeat(this.liniaP.length);
             },50)  
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

              let nowyznak = this.DodajZnak(data);
              
                //console.log(this.maxLenght)
                if ( (this.funkcje.DlugoscTekstu(nowyznak.liniaL + nowyznak.liniaP) <= this.dlugoscInput) && ( (nowyznak.liniaL + nowyznak.liniaP ).length <= ( this.funkcje.getNrZakladki() == 2 ? this.maxLenghtmax : this.maxLenght ) ) )
                {
                this.linia = nowyznak.liniaL;
                this.liniaH = '*'.repeat(this.linia.length);
                this.liniaP = nowyznak.liniaP;
                this.liniaHP = '*'.repeat(this.liniaP.length);
                this.szerokoscInput = ((this.linia + this.liniaP).length == 0 ? all.szerokoscAll :  all.szerokoscInput)
                }
                else
                {
                  this.ZaDlugiTekst({"liniaL": this.linia, "liniaP": this.liniaP}) 
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

  ZaDlugiTekst(tekst: any)
  {
    //this.funkcje.ZablokujLinieDialogu('max ' + this.maxLenght + ' znaków')
    this.funkcje.ZablokujLinieDialogu({"liniaL":'zbyt dużo znaków', "liniaP": ""})
    setTimeout(() => {
    this.funkcje.OdblokujLinieDialogu({"liniaL": tekst.liniaL, "liniaP": tekst.liniaP})
    },1600)
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
            { this.DodajString(event) }
        }
      break;
    }
  }

  
DodajString(tekst: string)
  {
    console.log(tekst)
    //let liniaI = tekst.length;
  }


/* (start) funkcje lini Input*/

//getStanPolecenia()
//{  return this.stanpolecenia }

WartoscLinia(linia: string, clear: boolean)
{
  //console.log('linia ', linia)
  this.linia = linia;
  this.szerokoscInput = ( (this.linia + this.liniaP).length == 0 ?  this.all.szerokoscAll : this.all.szerokoscInput)
  this.szerokoscInput = ( clear ?  this.szerokoscInput : this.all.szerokoscAll)
}

key(event: any)
{
  console.log(event)
}

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
      this.linia = ''; this.liniaP = '';
      this.funkcje.ZablokujLinieDialogu({"liniaL":'koniec historii', "liniaP": ""})
      this.linie_wskaznik = 0;
      if (this.linie.length > 0) { linia = this.linie[0]; } else { linia = ''}
      setTimeout(() => {
      this.funkcje.OdblokujLinieDialogu({"liniaL":linia, "liniaP": ""})
      },1600)
    }
    else 
    if ( this.linie_wskaznik < this.linie.length )  
    {
      linia = this.linie[this.linie_wskaznik];
    }
    else
    {
      this.linie_wskaznik = this.linie.length; 
    }
  return linia;    
}
/* (end) historia poleceń */

WybranoEnter(linia: string)
{
  if ((this.funkcje.getNrZakladki() == 2 )&&(this.funkcje.getZalogowany().zalogowany != 0))
  {
    this.wiadomosci.WyslijWiadomosc.next(linia);
  }
  else
  {  
  if ( (this.funkcje.DlugoscTekstu(linia) <= this.dlugoscInput) && ( linia.length <= ( this.funkcje.getNrZakladki() == 2 ? this.maxLenghtmax : this.maxLenght ) ) )
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
    else
    { 
      this.ZaDlugiTekst({"liniaL": linia, "liniaP": ""}) 
    }  
  }
}


DodajZnak(znak: any)
  {
    let linia = this.linia;
    let liniaP = this.liniaP;
//console.log('znak  ',znak)
if (!this.blokada)
{  
  switch (znak) {
      case '&enter'     : if ((linia + liniaP).length != 0) 
                          { 
                            this.funkcje.ZablokujLinieDialogu({"liniaL": "", "liniaP": ""})
                            this.WybranoEnter(linia + liniaP)
                            linia = ''; liniaP = ''; 
                          }
                          break;
      case '&delall'    : linia = ''; liniaP = ''; 
                          break;
      case '&back'  :   linia = linia.substring(0,linia.length-1); break;
      case '&del'   :   liniaP = liniaP.substring(1); break;
      case '&bad'   :   break;
      case 8593     :   linia = this.PokazHistorie(-1); liniaP = ""; //góra
                        break;
      case 8595     :   linia = this.PokazHistorie(1); liniaP = "";//dół
                        break;
      case 8592     :   liniaP = linia.substring(linia.length-1) + liniaP;  linia = linia.substring(0,linia.length-1); break;
      case 8594     :   linia = linia + liniaP.substring(0,1);  liniaP = liniaP.substring(1); break;
      case '&amp;'   :  linia = linia + '&'; break;
      case '&lt;'    :  linia = linia + '<'; break;
      case '&rt;'    :  linia = linia + '>'; break;
      case '&space' :   linia = linia + ' '; break;
      default       :   linia = linia + String.fromCharCode(znak); break;
    }
    //console.log('linia ', linia,'       ', this.pozycja)
    //console.log('linia ', this.linia,'       ', this.liniablokada)
  }    
  return {"liniaL":linia, "liniaP":liniaP}
}

}
