import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Wiersze } from './definicje';

@Injectable({
  providedIn: 'root'
})
export class FunkcjeWspolneService {

constructor()
 {
   console.log('con fun wsp');
  this.poprawne = this.poprawne.concat(this.klw11,this.klw11alt,this.klw12,this.klw12alt,this.klw12caps,this.klw21,this.klw21caps,this.klw22,this.klw22caps)
 }


/* (start) dodanie lini komunikatu */
private linieDialogu: Wiersze[] = [];
  
getLinieDialogu() { return this.linieDialogu }
addLinieDialogu(linia: any) 
  {
   this.linieDialogu = [...this.linieDialogu, linia];   
  }

private LiniaKomunikatu = new Subject<any>();
LiniaKomunikatu$ = this.LiniaKomunikatu.asObservable();
addLiniaKomunikatu(linia: string, kolor: string)
{
  let wiersz = {'data':(moment()).format('YYYY-MM-DD HH:mm:ss'), 'name': 'dedal', 'kolor': kolor, 'tekst': linia}
  this.addLinieDialogu(wiersz)
  this.LiniaKomunikatu.next(wiersz);
}
/* (end) dodanie lini komunikatu */ 

/* (start) fokus lini dialogu */
private LiniaDialogu = new Subject<any>();
LiniaDialogu$ = this.LiniaDialogu.asObservable();
fokusLiniaDialogu()
{
  this.LiniaDialogu.next();
}
/* (end) fokus lini dialogu */

/* (start) fokus lini dialogu */
ZablokujLinieDialogu(komunikat: string)
{
  if (komunikat == '') { komunikat = 'przetwarzam, czekaj' }
  this.blokadaLiniaDialogu(true,komunikat)
}

OdblokujLinieDialogu()
{
  this.blokadaLiniaDialogu(false,'')
}

private LiniaDialoguBlokada = new Subject<any>();
LiniaDialoguBlokada$ = this.LiniaDialoguBlokada.asObservable();
private blokadaLiniaDialogu(stan: boolean, komunikat: string)
{
  this.LiniaDialoguBlokada.next({"stan": stan,"komunikat": komunikat});
}
/* (end) fokus lini dialogu */

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
