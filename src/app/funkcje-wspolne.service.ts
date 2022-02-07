import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Nazwa, Wiersze, Zalogowany } from './definicje';

@Injectable({ providedIn: 'root' })



export class FunkcjeWspolneService {

public dedal = 'dadal';
private osoba: Zalogowany;

constructor()
 {
  //console.log('con fun wsp');
  this.dane0 = {"prefix": "", "nazwa1": "", "separator":"", "nazwa2": "", "sufix": "", "kolor": "", "rodzaj": ""};
  this.poprawne = this.poprawne.concat(this.klw11,this.klw11alt,this.klw12,this.klw12alt,this.klw12caps,this.klw21,this.klw21caps,this.klw22,this.klw22caps)
  this.osoba = this.wylogujOsoba();
  this.zalogujOsoba({'zalogowany': 2, 'imie': 'John', 'nazwisko': 'Spow', 'autoryzacja': 2, 'funkcja': 'Kapitan', 'rodzaj': 'M','kolor':'rgb(230, 255, 0)'})
 }

/* (start) funkcje zalogowanego */ 

getZalogowany()
{
  return this.osoba
}


wylogujOsoba(): Zalogowany
{
  return { 'zalogowany': 0, 'imie': '', 'nazwisko': '', 'autoryzacja': false, 'funkcja': '', 'rodzaj': '','kolor':'white'} 
}

zalogujOsoba(data : any)
{
  this.osoba.zalogowany = data.zalogowany;
  this.osoba.imie = data.imie;
  this.osoba.nazwisko = data.nazwisko;
  this.osoba.autoryzacja = data.autoryzacja;
  this.osoba.funkcja = data.funkcja;
  this.osoba.rodzaj = data.rodzaj;
  this.osoba.kolor = (data.zalogowany == 0 ? 'white' : 'rgb(230, 255, 0)');
}

/* (end) funkcje zalogowanego */ 

/* (start) dodanie lini komunikatu */
private linieDialogu: Wiersze[] = [];
private dane0: Nazwa;
  
getLinieDialogu() { return this.linieDialogu; }
getDane0() { return this.dane0; }
addLinieDialogu(linia: any) 
  {
   this.linieDialogu = [...this.linieDialogu, linia];   
  }

addLiniaKomunikatuPolecenia(name: string, blad: string)
  {
    this.addLiniaKomunikatuD1(name, "", {"prefix": "", "nazwa1":blad, "separator":"", "nazwa2": "", "sufix": "", "kolor": this.getZalogowany().kolor, "rodzaj":"liniakomend"} , "");
  }
  

addLiniaKomunikatuKolor(name: string, blad: string, kolor: string)
  {
    this.addLiniaKomunikatuD1(name, "", {"prefix": "", "nazwa1":blad, "separator":"", "nazwa2": "", "sufix": "", "kolor": kolor, "rodzaj":""} , "");
  }
  

addLiniaKomunikatuInfo(name: string, blad: string)
{
  this.addLiniaKomunikatuD1(name, "", {"prefix": "", "nazwa1":blad, "separator":"", "nazwa2": "", "sufix": "", "kolor": "", "rodzaj":""} , "");
}

addLiniaKomunikatuAlert(name: string, blad: string)
{
  this.addLiniaKomunikatuD1(name, "", {"prefix": "", "nazwa1":blad, "separator":"", "nazwa2": "", "sufix": "", "kolor": "rgb(199, 100, 43)", "rodzaj":""} , "");
}


addLiniaKomunikatuKrytyczny(name: string, blad: string)
{
  this.addLiniaKomunikatuD1(name, "", {"prefix": "", "nazwa1":blad, "separator":"", "nazwa2": "", "sufix": "", "kolor": "rgb(199, 100, 43)", "rodzaj":""} , "");
  this.addLiniaKomunikatuD1(name, "", {"prefix": "", "nazwa1":'Błąd krytyczny - terminal stop', "separator":"", "nazwa2": "", "sufix": "", "kolor": "red", "rodzaj":""} , "");
  this.addLiniaKomunikatuD1(name, "", {"prefix": "", "nazwa1":'Wezwij MG', "separator":"", "nazwa2": "", "sufix": "", "kolor": "red", "rodzaj":""} , "");
}

addLiniaKomunikatuD1(name: string, prefix: string, dane1: Nazwa, sufix: string) 
{
  this.addLiniaKomunikatu
          (  
            name, 
            prefix,
            dane1,
            "", 
            this.dane0,
            "", 
            this.dane0,  
            sufix
        )
}
  
private LiniaKomunikatu = new Subject<any>();
LiniaKomunikatu$ = this.LiniaKomunikatu.asObservable();
addLiniaKomunikatu(name: string, prefix: string, dane1: Nazwa, separator1: string, dane2: Nazwa, separator2: string, dane3: Nazwa, sufix: string)
{
  //console.log('dane1 f ',dane1)
  //console.log('dane2 f ',dane2)
  if (!(typeof dane1.rodzaj === 'string')) { dane1.rodzaj = 'tekst';}
  if (!(typeof dane2.rodzaj === 'string')) { dane2.rodzaj = 'tekst'}
  let wiersz:  Wiersze = {'data':(moment()).format('YYYY-MM-DD HH:mm:ss'), 
                          'name': name,
                          'prefix': prefix,
                          'dane1': dane1,
                          'separator1': separator1,
                          'dane2': dane2,
                          'separator2': separator2,
                          'dane3': dane3,
                          'sufix': sufix
                         }
  this.addLinieDialogu(wiersz)
  this.LiniaKomunikatu.next(wiersz);
  //console.log(wiersz)
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

}
