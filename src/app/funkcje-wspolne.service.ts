import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Kolory, Linia, Nazwa, Wiersze, Zalogowany } from './definicje';

@Injectable({ providedIn: 'root' })

export class FunkcjeWspolneService {

private dedal = 'dedal';
private osoba: Zalogowany;
private kolory: Kolory;
public iloscZnakowwKomend = 40;


constructor ()
 {
  //console.log('con fun wsp');
  
  //this.dane0 = {"prefix": "", "nazwa1": "", "separator":"", "nazwa2": "", "sufix": "", "kolor": "", "rodzaj": ""};
  this.poprawne = this.poprawne.concat(this.klw11,this.klw11alt,this.klw12,this.klw12alt,this.klw12caps,this.klw21,this.klw21caps,this.klw22,this.klw22caps,this.klw22alt)
  
  this.kolory = {"info": "", "alert": "rgb(199, 100, 43)", "krytyczny": "red", "liniakomend": "rgb(00, 123, 255)", "zalogowany": "rgb(230, 255, 0)", "wylogowany": "white"}
  
  this.osoba =  { 'zalogowany': 0, 'imie': '', 'nazwisko': '', 'funkcja': '', 'rodzaj': '', 'narosl': false, "polecenia": true, 'kolor': "white"} 

  //do skasowania i wiadomosci.component.ts ~65 do skasowania: this.wiadomosci.wczytajOsoby();
  //this.zalogujOsoba({'zalogowany': 2, 'imie': 'John', 'nazwisko': 'Spow', 'funkcja': 'Kapitan', 'rodzaj': 'M','kolor': this.kolory.zalogowany})    

  this.znaki = this.znaki.concat('',' ',this.klw11,this.klw11alt,this.klw12,this.klw12alt,this.klw12caps,this.klw21,this.klw21caps,this.klw22,this.klw22caps,this.klw22alt,this.klw22capsalt)
  this.dluznaki = this.dluznaki.concat(0,2.45,this.dlu11,this.dlu11alt,this.dlu12,this.dlu12alt,this.dlu12caps,this.dlu21,this.dlu21caps,this.dlu22,this.dlu22caps,this.dlu22alt,this.dlu22capsalt)


}



getKolor() : Kolory { return this.kolory };

/* (start) funkcje zalogowanego */ 

getDedal() { return this.dedal };

getZalogowany() { return this.osoba };


wylogujOsoba(): Zalogowany
{
  return { 'zalogowany': 0, 'imie': '', 'nazwisko': '', 'funkcja': '', 'rodzaj': '', 'narosl': false, "polecenia": true, 'kolor': this.getKolor().wylogowany} 
}

zalogujOsoba(data : any)
{
  this.osoba.zalogowany = data.zalogowany;
  this.osoba.imie = data.imie;
  this.osoba.nazwisko = data.nazwisko;
  this.osoba.funkcja = data.funkcja;
  this.osoba.rodzaj = data.rodzaj;
  this.osoba.narosl = data.narosl;
  this.osoba.polecenia = data.polecenia;
  this.osoba.kolor = (data.zalogowany == 0 ? this.getKolor().wylogowany : this.getKolor().zalogowany);
}

setOsobaNarosl(stan: boolean)
{
  this.osoba.narosl = stan;
}

getPolecenia() { return this.osoba.polecenia }
setPolecenia(stan: boolean) { this.osoba.polecenia = stan}
/* (end) funkcje zalogowanego */ 

/* (start) dodanie lini komunikatu */
//private linieDialogu: Wiersze[] = [];
  
//getLinieDialogu() { return this.linieDialogu; }

/*
addLinieDialogu(linia: Wiersze) 
  {
   this.linieDialogu = [...this.linieDialogu, linia];   
  }
*/

private nrzakladki: any = 1;
getNrZakladki() { return this.nrzakladki; }

private ZakladkaDialogu = new Subject<any>();
 ZakladkaDialogu$ = this.ZakladkaDialogu.asObservable();
 setzakladkadialogu(event: any)
 {
   this.nrzakladki = event;
   this.ZakladkaDialogu.next(event);
 }

setTextNazwa(prefix: string, text: string, sufix: string, kolor: string, rodzaj: string):Nazwa
{
  //console.log('tx', (typeof prefix === "string" ? prefix : '' ) + (typeof text === "string" ? text : '' ) + (typeof sufix === "string" ? sufix : '' ))
  //console.log('dl', this.DlugoscTekstu(typeof prefix === "string" ? prefix : '' ) + this.DlugoscTekstu(typeof text === "string" ? text : '' ) + this.DlugoscTekstu(typeof sufix === "string" ? sufix : '' ))
  return {
    "prefix": (typeof prefix === "string" ? prefix : "" ),
    "text": (typeof text === "string" ? text : "" ),
    "sufix": (typeof sufix === "string" ? sufix : "" ),
    "kolor": (typeof kolor === "string" ? kolor : "" ),
    "rodzaj": (typeof rodzaj === "string" ? rodzaj : "tekst" ),
    "dlugosc": this.DlugoscTekstu(typeof prefix === "string" ? prefix : '' ) + this.DlugoscTekstu(typeof text === "string" ? text : '' ) + this.DlugoscTekstu(typeof sufix === "string" ? sufix : '' ) + 4
  }
}

setNazwaLinia(prefix: string, nazwa: Nazwa[], sufix: string):Linia
{
  let dlugosc = 0;
  //console.log('1',(typeof prefix === "string" ? prefix : '' ) + (typeof sufix === "string" ? sufix : '' ))
  //console.log(this.DlugoscTekstu(typeof prefix === "string" ? prefix : '' ) + dlugosc + this.DlugoscTekstu(typeof sufix === "string" ? sufix : '' ))
  for (let index = 0; index < nazwa.length; index++) 
  { 
    //console.log('2-',index,'- ', nazwa[index])
    //console.log('3-',index,'- ',nazwa[index].dlugosc)
    dlugosc = dlugosc + nazwa[index].dlugosc 
  }
  //console.log('4',dlugosc)
  return {
    "prefix":  (typeof prefix === "string" ? prefix:"" ),
    "text": nazwa, 
    "sufix": (typeof sufix === "string" ? sufix:"" ),
    "dlugosc": this.DlugoscTekstu(typeof prefix === "string" ? prefix : '' ) + dlugosc + this.DlugoscTekstu(typeof sufix === "string" ? sufix : '' ) + 4
  }
}

setLiniaWiersz(data: string, przed: string, name: string, po: string, prefix: string, linia: Linia[], sufix: string):Wiersze
{
  return {'data':data, 
          'name': przed + name + po,
          'prefix': prefix,
          'linia': linia,
          'sufix': sufix
          }
}

addLiniaKomunikatuPolecenia(name: string, blad: string)
  {
    this.addLiniaKomunikatu("", name, "", "", [this.setNazwaLinia("", [this.setTextNazwa("", blad, "", this.getZalogowany().kolor, "liniakomend kursor")], "")], "");
  }
  

addLiniaKomunikatuKolor(name: string, blad: string, kolor: string)
  {
    this.addLiniaKomunikatu("", name, "", "", [this.setNazwaLinia("", [this.setTextNazwa("", blad, "", kolor, "")], "")], "");
  }
  

addLiniaKomunikatuInfo(name: string, blad: string)
{
  this.addLiniaKomunikatu("", name, "", "", [this.setNazwaLinia("", [this.setTextNazwa("", blad, "", "", "")], "")], "");
}

addLiniaKomunikatuAlert(name: string, blad: string)
{
  this.addLiniaKomunikatu("", name, "", "", [this.setNazwaLinia("", [this.setTextNazwa("", blad, "", this.getKolor().alert, "")], "")], "");
}


addLiniaKomunikatuKrytyczny(name: string, blad: string)
{
  this.addLiniaKomunikatuAlert(name, blad)
  this.addLiniaKomunikatuKolor(name, "Błąd krytyczny - terminal stop", this.getKolor().krytyczny)
  this.addLiniaKomunikatuKolor(name, "Wezwij MG", this.getKolor().krytyczny)
}

setLiniaDialoguClear()
{
  this.LiniaKomunikatu.next({'przed': '', 'name': '', 'po': '', 'prefix': '', 'linia': '', 'sufix': '', 'clear': true});
}

setLiniaInformacjeClear()
{
  this.DodajInformacje.next({'dane': '', 'clear': true});
}

private DodajInformacje = new Subject<any>();
DodajInformacje$ = this.DodajInformacje.asObservable();
addDodajInformacje(dane: any, clear: boolean)
{
 this.DodajInformacje.next({"dane": dane, "clear": clear})
}

private DodajHistorie = new Subject<any>();
DodajHistorie$ = this.DodajHistorie.asObservable();
addDodajHistorie(dane: any, clear: boolean, polecenie: string)
{
 this.DodajHistorie.next({"dane": dane, "clear": clear, "polecenie": polecenie})
}

private DodajUszkodzenia = new Subject<any>();
DodajUszkodzenia$ = this.DodajUszkodzenia.asObservable();
addDodajUszkodzenia(dane: any, clear: boolean)
{
 this.DodajUszkodzenia.next({"dane": dane, "clear": clear})
}

private DodajTest = new Subject<any>();
DodajTest$ = this.DodajTest.asObservable();
addDodajTest(dane: any, clear: boolean)
{
 this.DodajTest.next({"dane": dane, "clear": clear})
}

private DodajReset = new Subject<any>();
DodajReset$ = this.DodajReset.asObservable();
addDodajReset(dane: any, clear: boolean)
{
 this.DodajReset.next({"dane": dane, "clear": clear})
}

private DodajNaprawa = new Subject<any>();
DodajNaprawa$ = this.DodajNaprawa.asObservable();
addDodajNaprawa(dane: any, clear: boolean)
{
 this.DodajNaprawa.next({"dane": dane, "clear": clear})
}


private LiniaKomunikatu = new Subject<any>();
LiniaKomunikatu$ = this.LiniaKomunikatu.asObservable();
addLiniaKomunikatu(przed: string, name: string, po: string, prefix: string, linia: Linia[], sufix: string)
{
 this.LiniaKomunikatu.next({'przed': przed, 'name': name, 'po': po, 'prefix': prefix, 'linia': linia, 'sufix': sufix, 'clear': false})
}

addLiniaKomunikatuFormat(data: string, przed: string, name: string, po: string, prefix: string, linia: Linia[], sufix: string, szerokosc: number): Wiersze[]
{
  let wynik: Wiersze[] = []
  przed = (przed === "" ? ', ' : przed);
  po = ( po === "" ? ' > ' : po);
  let dlugosc = 0;
  //let spacje = 0;
  let spacje = '          ';
  let wiersz: Wiersze;
  for (let index = 0; index < linia.length; index++) { dlugosc = dlugosc + linia[index].dlugosc }
  //let data = ' ' + (moment()).format('YYYY-MM-DD HH:mm:ss');
  if (typeof data != 'string') { data = '1900-01-01 00:00:01'}
  if ( ( this.DlugoscTekstu(data + przed + name + po + prefix + sufix) + dlugosc) < szerokosc)
  {
  wiersz = this.setLiniaWiersz (data, przed, name, po, prefix, linia, sufix);  
  wynik = [...wynik, wiersz];
  }
  else
  {
    let dlugosc = 0;
    if ( this.DlugoscTekstu(data + przed + name + po + prefix ) > szerokosc)
  {
    wiersz = this.setLiniaWiersz (data, przed, name, po, "", [], "")
    wynik = [...wynik, wiersz];
    data = spacje;
    name = "";
    przed = "";
    po = "";
    //spacje = 10 * 2.45; // 10 spacje w html przed kolejną linią
  }
  {
    let liniaNew: Linia[] = []; 
    for (let index = 0; index < linia.length; index++) 
    {
      if ( (this.DlugoscTekstu(data + przed + name + po + prefix) + dlugosc + linia[index].dlugosc ) < szerokosc)
      {
        liniaNew = [...liniaNew,linia[index]];
        dlugosc = dlugosc + linia[index].dlugosc
      }
      else
      {
        wiersz = this.setLiniaWiersz (data, przed, name, po, prefix, liniaNew, "");
        wynik = [...wynik, wiersz];
        data = spacje;
        name = "";
        przed = "";
        po = "";
        prefix = "";
        liniaNew = [linia[index]];
        dlugosc =  linia[index].dlugosc;
        //spacje = 10 * 2.45; // 10 spacje w html przed kolejną linią
      }
    }
  if ( ( this.DlugoscTekstu(data + przed + name + po + prefix +  sufix) + dlugosc ) < szerokosc)
  {
    wiersz = this.setLiniaWiersz (data, przed, name, po, prefix, liniaNew, sufix)
    wynik = [...wynik, wiersz];
  }
  else
  {
    wiersz = this.setLiniaWiersz (data, przed, name, po, prefix, liniaNew, "")
    wynik = [...wynik, wiersz];
    wiersz = this.setLiniaWiersz (data, "", "", "", "", [], sufix);
    wynik = [...wynik, wiersz];
    
  }      
  } 
  }
  return wynik
}
/* (end) dodanie lini komunikatu */ 



/* (start) fokus lini dialogu */
private LiniaDialogu = new Subject<any>();
LiniaDialogu$ = this.LiniaDialogu.asObservable();
fokusLiniaDialogu(tekst: string)
{
  this.LiniaDialogu.next(tekst);
}
/* (end) fokus lini dialogu */

/* (start) blokada lini dialogu */
ZablokujAll(komunikat: string)
{
  this.ZablokujLinieDialogu({"liniaL": komunikat, "liniaP": ""}, true)  
}

OdblokujAll(komunikat: string)
{
  this.OdblokujLinieDialogu({"liniaL": komunikat, "liniaP": ""}, false)  
  this.UstawStanPolecenia({"czas": 500, "komunikat": "", "dzialania": "","nastepny":"brak"})
}


ZablokujLinieDialogu(komunikat: any, blokada: boolean = false)
{
  if ( (komunikat.liniaL + komunikat.liniaP) == '') { komunikat.liniaL = 'przetwarzam, czekaj' }
  this.blokadaLiniaDialogu(true, komunikat, blokada)
}

OdblokujLinieDialogu(komunikat: any, blokada: boolean = false)
{
  this.blokadaLiniaDialogu(false, komunikat, blokada)
}

private LiniaDialoguBlokada = new Subject<any>();
LiniaDialoguBlokada$ = this.LiniaDialoguBlokada.asObservable();
private blokadaLiniaDialogu(stan: boolean, komunikat: any, blokada: boolean)
{
  this.LiniaDialoguBlokada.next({"stan": stan, "komunikat": komunikat, "blokada": blokada});
}
/* (end) blokada lini dialogu */


/* (start) stan polecen lini dialogu */
UstawStanPolecenia(stan: any)
{
  this.blokadaLiniaStanPolecen(stan)
}

private LiniaDialoguStanPolecen = new Subject<any>();
LiniaDialoguStanPolecen$ = this.LiniaDialoguStanPolecen.asObservable();
private blokadaLiniaStanPolecen(stan: any)
{
  this.LiniaDialoguStanPolecen.next(stan);
}



setLiniaKomunikatuHistoriaClear()
{ this.liniakomunikatuHistoriaStan('') }

setLiniaKomunikatuHistoriaDodaj(komunikat: string)
{ this.liniakomunikatuHistoriaStan(komunikat) }

private LiniaDialoguStanHistoria = new Subject<any>();
LiniaDialoguStanHistoria$ = this.LiniaDialoguStanHistoria.asObservable();
private liniakomunikatuHistoriaStan(komunikat: string)
{
  this.LiniaDialoguStanHistoria.next(komunikat);
}


Password(stan: string)
{  this.blokadaLiniaStanHaslo(stan) }

private LiniaDialoguStanHaslo = new Subject<any>();
LiniaDialoguStanHaslo$ = this.LiniaDialoguStanHaslo.asObservable();
private blokadaLiniaStanHaslo(stan: string)
{
  this.LiniaDialoguStanHaslo.next(stan);
}
/* (end) stan polecen lini dialogu */




/* (start) dodanie znaku lini dialogu */
private LiniaDialoguAddChar = new Subject<any>();
LiniaDialoguAddChar$ = this.LiniaDialoguAddChar.asObservable();
LiniaDialoguChar(znak: any)
{
  //console.log('znak przekazany 1 ',znak)
  //console.log('znak przekazany 2 ',this.PoprawnyZnak(znak))
  this.LiniaDialoguAddChar.next(this.PoprawnyZnak(znak));
}

private LiniaDialoguZmien = new Subject<any>();
LiniaDialoguZmien$ = this.LiniaDialoguZmien.asObservable();
LiniaDialogu_Zmien(znak: any)
{
this.LiniaDialoguZmien.next(znak)
}

/* (end) dodanie znaku lini dialogu */

/* (start) sprawdzenie dopuszczalnych znaków lini dialogu */
  klw11 = Array ('1','2','3','4','5','6','7','8','9','0',',','.','-',':',';','?','!','"','(',')');
  dlu11 = Array (10.1,10.1,10.1,10.1,10.1,10.1,10.1,10.1,10.1,10.1,3.54,4.74,4.97,4.37,3.8,8.5,4.64,5.75,6.15,6.25);
  klw11alt = Array ('`','~','@','#','$','%',String.fromCharCode(8240),'^','&','*','[',']','{','}','<','>');
  dlu11alt = Array (5.57,12.25,16.17,11.09,10.1,13.19,18.0,7.52,11.19,7.75,4.77,4.77,6.09,6.09,9.15,9.40);
  klw12 = Array ('ą','ć','ę','ł','ń','ó','ś','ż','ź',String.fromCharCode(8593),String.fromCharCode(8592),String.fromCharCode(8594));
  dlu12 = Array (9.79,9.41,9.54,4.87,9.94,10.27,9.29,8.92,8.92,9.0,18.0,18.0);
  klw12caps = Array ('Ą','Ć','Ę','Ł','Ń','Ó','Ś','Ż','Ź',String.fromCharCode(8593),String.fromCharCode(8592),String.fromCharCode(8594));
  dlu12caps = Array (11.75,11.72,10.24,9.7,12.84,12.39,10.69,10.79,10.79,9.0,18.0,18.0);
  klw12alt = Array ('+','-',String.fromCharCode(215),String.fromCharCode(247),'=',String.fromCharCode(8800),String.fromCharCode(177),String.fromCharCode(176),'_','/','|',String.fromCharCode(92),String.fromCharCode(10003),String.fromCharCode(8648),String.fromCharCode(8647),String.fromCharCode(8649))
  dlu12alt = Array (10.2,4.97,9.6,10.27,9.89,9.89,9.62,6.72,8.12,7.42,8.12,4.39,13.49,9.0,18.0,18.0)
  klw21 = Array ('a','b','c','d','e','f','g','h','i','j','k','l','m');
  dlu21 = Array (9.79,10.1,9.42,10.15,9.54,6.25,10.1,9.92,4.37,4.3,9.12,4.37,15.78);
  klw21caps = Array ('A','B','C','D','E','F','G','H','I','J','K','L','M');
  dlu21caps = Array (11.75,11.2,11.72,11.8,10.24,9.95,12.27,12.84,4.9,9.94,11.29,9.69,15.72);
  klw22 = Array ('n','o','p','q','r','s','t','u','v','w','x','y','z',String.fromCharCode(8595));
  dlu22 = Array (9.94,10.27,10.1,10.24,6.09,9.29,5.89,9.92,8.72,13.54,8.92,8.52,8.92,9);
  klw22alt = Array ('n','o','p','q','r','s','t','u','v','w','x','y','z',String.fromCharCode(8650));
  dlu22alt = Array (9.94,10.27,10.1,10.24,6.09,9.29,5.89,9.92,8.72,13.54,8.92,8.52,8.92,9);
  klw22caps = Array ('N','O','P','Q','R','S','T','U','V','W','X','Y','Z',String.fromCharCode(8595));
  dlu22caps = Array (12.84,12.39,11.35,12.39,11.09,10.69,10.73,11.67,11.45,15.97,11.29,10.82,10.79,9.0);
  klw22capsalt = Array ('N','O','P','Q','R','S','T','U','V','W','X','Y','Z',String.fromCharCode(8650));
  dlu22capsalt = Array (12.84,12.39,11.35,12.39,11.09,10.69,10.73,11.67,11.45,15.97,11.29,10.82,10.79,9.0);
  poprawne = Array ('&space','&back','&del','&enter','Backspace', 'Delete', 'Enter',' ');
  dlupoprawne = Array (2.45,0,0,0,0,0,0,2.45);


private  znaki = Array <string>();
private  dluznaki = Array <number>();

DlugoscTekstu(tekst: string): number
{
  let dlugosc = 0;
  for (let index = 0; index < tekst.length; index++) 
  {
    dlugosc = dlugosc + this.dluznaki[this.znaki.indexOf(tekst[index])];
  }
  return dlugosc
}


PoprawnyZnak(znak: any)
{
//console.log(znak)
//console.log('typ ', typeof znak === 'number' )
//console.log('jest ', this.poprawne.indexOf(String.fromCharCode(znak)))
//console.log('jestznak: ', this.poprawne[this.poprawne.indexOf(String.fromCharCode(znak))])
//console.log('jest ', this.poprawne.indexOf(znak))
//console.log('jestznak: ', this.poprawne[this.poprawne.indexOf(znak)])
if ( typeof znak === 'number') 
  {
    if ( this.poprawne.indexOf(String.fromCharCode(znak)) == -1 ) 
    { return '&bad'} else { return znak}
  }
  else
  { 
    if ( this.poprawne.indexOf(znak) == -1 ) 
    { return '&bad'} else { return znak}
  }
}
/* (end) sprawdzenie dopuszczalnych znaków lini dialogu */


/* (start) fokus lini dialogu */
private PoleNotatki = new Subject<any>();
PoleNotatki$ = this.PoleNotatki.asObservable();
fokusPoleNotatki()
{
  this.PoleNotatki.next();
}
/* (end) fokus lini dialogu */



}
