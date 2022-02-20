import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Kolory, Linia, Nazwa, Wiersze, Zalogowany } from './definicje';

@Injectable({ providedIn: 'root' })

export class FunkcjeWspolneService {

private dedal = 'dadal';
private osoba: Zalogowany;
private kolory: Kolory;
public iloscZnakowwKomend = 60;
public iloscZnakowwDialogu = 160;


constructor ()
 {
  //console.log('con fun wsp');
  
  //this.dane0 = {"prefix": "", "nazwa1": "", "separator":"", "nazwa2": "", "sufix": "", "kolor": "", "rodzaj": ""};
  this.poprawne = this.poprawne.concat(this.klw11,this.klw11alt,this.klw12,this.klw12alt,this.klw12caps,this.klw21,this.klw21caps,this.klw22,this.klw22caps)

  this.kolory = {"info": "", "alert": "rgb(199, 100, 43)", "krytyczny": "red", "liniakomend": "rgb(00, 123, 255)", "zalogowany": "rgb(230, 255, 0)", "wylogowany": "white"}
  
  this.osoba =  { 'zalogowany': 0, 'imie': '', 'nazwisko': '', 'autoryzacja': false, 'funkcja': '', 'rodzaj': '','kolor': ""} 
  
  //do skasowania
  this.zalogujOsoba({'zalogowany': 2, 'imie': 'John', 'nazwisko': 'Spow', 'autoryzacja': 2, 'funkcja': 'Kapitan', 'rodzaj': 'M','kolor': this.kolory.zalogowany})    
 }



getKolor() : Kolory { return this.kolory };

/* (start) funkcje zalogowanego */ 

getDedal() { return this.dedal };

getZalogowany() { return this.osoba };


wylogujOsoba(): Zalogowany
{
  return { 'zalogowany': 0, 'imie': '', 'nazwisko': '', 'autoryzacja': false, 'funkcja': '', 'rodzaj': '','kolor': this.getKolor().wylogowany} 
}

zalogujOsoba(data : any)
{
  this.osoba.zalogowany = data.zalogowany;
  this.osoba.imie = data.imie;
  this.osoba.nazwisko = data.nazwisko;
  this.osoba.autoryzacja = data.autoryzacja;
  this.osoba.funkcja = data.funkcja;
  this.osoba.rodzaj = data.rodzaj;
  this.osoba.kolor = (data.zalogowany == 0 ? this.getKolor().wylogowany : this.getKolor().zalogowany);
}

/* (end) funkcje zalogowanego */ 

/* (start) dodanie lini komunikatu */
private linieDialogu: Wiersze[] = [];
  
getLinieDialogu() { return this.linieDialogu; }

setLiniaDialoguClear()
{
  this.linieDialogu = [];
  this.LiniaKomunikatu.next(false);
}
addLinieDialogu(linia: Wiersze) 
  {
   this.linieDialogu = [...this.linieDialogu, linia];   
  }



setTextNazwa(prefix: string, text: string, sufix: string, kolor: string, rodzaj: string):Nazwa
{
  return {
    "prefix": (typeof prefix === "string" ? prefix : "" ),
    "text": (typeof text === "string" ? text : "" ),
    "sufix": (typeof sufix === "string" ? sufix : "" ),
    "kolor": (typeof kolor === "string" ? kolor : "" ),
    "rodzaj": (typeof rodzaj === "string" ? rodzaj : "tekst" ),
    "dlugosc": (typeof prefix === "string" ? prefix.length : 0 ) + (typeof text === "string" ? text.length : 0 ) + (typeof sufix === "string" ? sufix.length : 0 )
  }
}

setNazwaLinia(prefix: string, nazwa: Nazwa[], sufix: string):Linia
{
  let dlugosc = 0;
  for (let index = 0; index < nazwa.length; index++) { dlugosc = dlugosc + nazwa[index].dlugosc }
  return {
    "prefix":  (typeof prefix === "string" ? prefix:"" ),
    "text": nazwa, 
    "sufix": (typeof sufix === "string" ? sufix:"" ),
    "dlugosc": (typeof prefix === "string" ? prefix.length : 0 ) + dlugosc + (typeof sufix === "string" ? sufix.length : 0 )
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
    this.addLiniaKomunikatu("", name, "", "", [this.setNazwaLinia("", [this.setTextNazwa("", blad, "", this.getZalogowany().kolor, "liniakomend")], "")], "");
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

setLiniaKomunikatuClear()
{

}
  
private LiniaKomunikatu = new Subject<any>();
LiniaKomunikatu$ = this.LiniaKomunikatu.asObservable();
addLiniaKomunikatu(przed: string, name: string, po: string, prefix: string, linia: Linia[], sufix: string)
{
  przed = (przed === "" ? ', ' : przed);
  po = ( po === "" ? ' > ' : po);
  let dlugosc = 0;
  for (let index = 0; index < linia.length; index++) { dlugosc = dlugosc + linia[index].dlugosc }
  let data = (moment()).format('YYYY-MM-DD HH:mm:ss');
  console.log('dł',data.length + przed.length + name.length + po.length + prefix.length + dlugosc + sufix.length,'il',this.iloscZnakowwDialogu);
  if ( (data.length + przed.length + name.length + po.length + prefix.length + dlugosc + sufix.length) < this.iloscZnakowwDialogu)
  {
  this.addLinieDialogu( this.setLiniaWiersz (data, przed, name, po, prefix, linia, sufix) )
  this.LiniaKomunikatu.next(true);
  }
  else
  {
    if ((data.length + przed.length + name.length + po.length + prefix.length ) > this.iloscZnakowwDialogu)
  {
    this.addLinieDialogu( this.setLiniaWiersz (data, przed, name, po, "", [], "") );
    this.LiniaKomunikatu.next(true);
    data = "";
    name = "";
    przed = "";
    po = "";
  }
  {
    let liniaNew: Linia[] = []; 
    dlugosc = 0;
    for (let index = 0; index < linia.length; index++) 
    {
      if ( (data.length + przed.length + name.length + po.length + prefix.length + dlugosc + linia[index].dlugosc ) < this.iloscZnakowwDialogu)
      {
        liniaNew = [...liniaNew,linia[index]];
        dlugosc = dlugosc + linia[index].dlugosc
      }
      else
      {
        this.addLinieDialogu( this.setLiniaWiersz (data, przed, name, po, prefix, liniaNew, "") );
        this.LiniaKomunikatu.next(true);
        data = "";
        name = "";
        przed = "";
        po = "";
        prefix = "";
        liniaNew = [linia[index]];
        dlugosc = 10; // spacje w html
      }
    }
  if ((data.length + przed.length + name.length + po.length + prefix.length + dlugosc + sufix.length) < this.iloscZnakowwDialogu)
  {
    this.addLinieDialogu( this.setLiniaWiersz (data, przed, name, po, prefix, liniaNew, sufix) );
    this.LiniaKomunikatu.next(true);
  }
  else
  {
    this.addLinieDialogu( this.setLiniaWiersz (data, przed, name, po, prefix, liniaNew, "") );
    this.addLinieDialogu( this.setLiniaWiersz ("", "", "", "", "", [], sufix) );
    this.LiniaKomunikatu.next(true);
  }      
  } 
  }
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
  this.ZablokujLinieDialogu(komunikat, true)  
}

OdblokujAll(komunikat: string)
{
  this.OdblokujLinieDialogu(komunikat, komunikat.length, false)  
  this.UstawStanPolecenia({"czas": 500, "komunikat": "", "dzialania": "","nastepny":"brak"})
}


ZablokujLinieDialogu(komunikat: string, blokada: boolean = false)
{
  if (komunikat == '') { komunikat = 'przetwarzam, czekaj' }
  this.blokadaLiniaDialogu(true, komunikat, komunikat.length, blokada)
}

OdblokujLinieDialogu(komunikat: string, pozycja: number, blokada: boolean = false)
{
  this.blokadaLiniaDialogu(false, komunikat, pozycja , blokada)
}

private LiniaDialoguBlokada = new Subject<any>();
LiniaDialoguBlokada$ = this.LiniaDialoguBlokada.asObservable();
private blokadaLiniaDialogu(stan: boolean, komunikat: string, pozycja: number, blokada: boolean)
{
  this.LiniaDialoguBlokada.next({"stan": stan, "komunikat": komunikat, "pozycja": pozycja, "blokada": blokada});
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
  //console.log('znak przekazany',znak)
  this.LiniaDialoguAddChar.next(this.PoprawnyZnak(znak));
}
/* (end) dodanie znaku lini dialogu */

/* (start) sprawdzenie dopuszczalnych znaków lini dialogu */
  klw11 = Array ('1','2','3','4','5','6','7','8','9','0',',','.','-',':',';','?','!','"','(',')');
  klw11alt = Array ('`','~','@','#','$','%',String.fromCharCode(8240),'^','&','*','[',']','{','}','<','>');
  klw12 = Array ('ą','ć','ę','ł','ó','ś','ż','ź',String.fromCharCode(8593),String.fromCharCode(8592),String.fromCharCode(8594));
  klw12caps = Array ('Ą','Ć','Ę','Ł','Ó','Ś','Ż','Ź',String.fromCharCode(8593),String.fromCharCode(8592),String.fromCharCode(8594));
  klw12alt = Array ('+','-',String.fromCharCode(215),String.fromCharCode(247),'=',String.fromCharCode(8800),String.fromCharCode(177),String.fromCharCode(176),'_','/','|',String.fromCharCode(10003),String.fromCharCode(8593),String.fromCharCode(8592),String.fromCharCode(8594))
  klw21 = Array ('a','b','c','d','e','f','g','h','i','j','k','l','m');
  klw21caps = Array ('A','B','C','D','E','F','G','H','I','J','K','L','M');
  klw22 = Array ('n','o','p','q','r','s','t','u','v','w','x','y','z',String.fromCharCode(8595));
  klw22caps = Array ('N','O','P','Q','R','S','T','U','V','W','X','Y','Z',String.fromCharCode(8595));
  poprawne = Array ('&space','&back','&del','&enter');

PoprawnyZnak(znak: any)
{
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
