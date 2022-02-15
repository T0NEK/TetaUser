import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';
import { Linia, Nazwa, Polecenia } from './definicje'
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { ModulyService } from './moduly.service';
import { PoleceniaService } from './polecenia.service';
import { NotatkiService } from './notatki.service';

@Injectable({ providedIn: 'root'})

export class PetlaService implements OnDestroy 
{

private modulysubscribe_p = new Subscription();
private poleceniasubscribe_p = new Subscription();
private dzialaniasubscribe_p = new Subscription();
private notatkisubscribe_p = new Subscription();
private notatkitrescsubscribe_p = new Subscription();
private zapisznotatkisubscribe_p = new Subscription();
private bufordane = Array();



constructor(private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService, private http: HttpClient, private polecenia: PoleceniaService, private moduly: ModulyService, private notatki: NotatkiService)
{
    //console.log('con polecenia')
  
  this.poleceniasubscribe_p = this.polecenia.OdczytajPolecenia$.subscribe
    ( data => { this.poleceniaWykonaj(data, '') } )
  this.dzialaniasubscribe_p = this.polecenia.OdczytajDzialania$.subscribe
    ( data => { this.poleceniaWykonaj(data, '') } )  
  
  this.modulysubscribe_p = this.moduly.OdczytajModuly$.subscribe
    ( data => { this.poleceniaWykonaj(data.nastepny, data.komunikat) } )
  this.notatkisubscribe_p = this.notatki.OdczytajNotatki$.subscribe
    ( data => { this.poleceniaWykonaj(data.nastepny, data.komunikat) } )      
  this.notatkitrescsubscribe_p = this.notatki.OdczytajNotatkiTresc$.subscribe
    ( data => { this.poleceniaWykonaj(data.nastepny, data.komunikat) } )      
  this.zapisznotatkisubscribe_p = this.notatki.ZapiszNotatki$.subscribe
    ( data => { this.poleceniaWykonaj(data.nastepny, data.komunikat) } )      
  
    
}


ngOnDestroy()
  {
   if(this.modulysubscribe_p) { this.modulysubscribe_p.unsubscribe(); }   
   if(this.poleceniasubscribe_p) { this.modulysubscribe_p.unsubscribe(); }   
   if(this.dzialaniasubscribe_p) { this.modulysubscribe_p.unsubscribe(); }   
   if(this.notatkisubscribe_p) { this.notatkisubscribe_p.unsubscribe(); }   
   if(this.notatkitrescsubscribe_p) { this.notatkisubscribe_p.unsubscribe(); }   
   if(this.zapisznotatkisubscribe_p) { this.zapisznotatkisubscribe_p.unsubscribe(); }   
  }

poleceniaWykonaj(polecenie: string, tekst: string)
{
 console.log('działanie ',polecenie)
 console.log('tekst: ',tekst)
 console.log('bufordane: ',this.bufordane)
  if (polecenie != 'end')
 {
    let dowykonania = this.polecenia.sprawdzDzialania(polecenie) 
    console.log('polecenie: ',dowykonania)
    switch (dowykonania.dzialanie) {
      case 'komunikat': setTimeout(() => {
                                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.komunikat);
                                this.poleceniaWykonaj(dowykonania.nastepnyTrue, tekst);   
                              }, dowykonania.czas);
            break;
      case 'informacja': setTimeout(() => {
                                let wynik = this.Informacje(dowykonania, tekst) 
                                this.poleceniaWykonaj(wynik, tekst);     
                                }, dowykonania.czas);
            break;
      case 'dane': setTimeout(() => {
                                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.komunikat); 
                                this.funkcje.UstawStanPolecenia(dowykonania);
                                this.funkcje.OdblokujLinieDialogu('',0);
                              }, dowykonania.czas);
            break;
      case 'warunek': setTimeout(() => {
                                let wynik = this.sprawdzWarunek(dowykonania);
                                this.poleceniaWykonaj(wynik, tekst);   
                              }, dowykonania.czas);                                
            break;      
      case 'getset': setTimeout(() => { 
                                this.GetSet(dowykonania);
                                }, dowykonania.czas);
            break;
      case 'wykonaj': setTimeout(() => { 
                                let wynik =this.Wykonaj(dowykonania);
                                this.poleceniaWykonaj(wynik, tekst);   
                                }, dowykonania.czas);
            break;      
      case 'linie': setTimeout(() => {  
                                this.Lista(dowykonania, tekst)    
                              //  this.polecenieWyswietl(dowykonania);
                                }, dowykonania.czas);
            break;
      case 'zapiszdane': this.bufordane = [];
                         this.bufordane = [...this.bufordane,tekst];
                         setTimeout(() => 
                         {
                           this.poleceniaWykonaj(dowykonania.nastepnyTrue, tekst)
                         }, dowykonania.czas);
            break;                                   
      case 'dodajdane':  this.bufordane = [...this.bufordane,tekst];
                          setTimeout(() => 
                          {
                            this.poleceniaWykonaj(dowykonania.nastepnyTrue, tekst)
                          }, dowykonania.czas);
            break;   
      case 'password': this.funkcje.Password(dowykonania.komunikat);
                       this.poleceniaWykonaj(dowykonania.nastepnyTrue, tekst);   
            break;
      case 'logowanie': this.bufordane = [...this.bufordane,0];
                        this.komunikacja.Zaloguj(this.bufordane);
                        this.poleceniaWykonaj(dowykonania.nastepnyTrue, tekst);         
            break;  
      case 'wylogowanie': this.bufordane = ['', '', this.funkcje.getZalogowany().zalogowany];
                          this.komunikacja.Zaloguj(this.bufordane);
                          this.poleceniaWykonaj(dowykonania.nastepnyTrue, tekst);         
            break;              
      case 'bad': 
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.dedal, dowykonania.komunikat);
            break;  
    default:
            break;
    }
 }
 else
 {
  this.funkcje.OdblokujLinieDialogu('',0);
 }
}


Informacje(dowykonania: Polecenia, tekst: string): string
{
  let wynik: string;
  //console.log( 'warunek',warunek )
  //console.log( 'zalogowany',this.funkcje.getZalogowany() )

  switch (dowykonania.komunikat) {
    case 'tekst': this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.prefix + tekst + dowykonania.sufix);
                  wynik = dowykonania.nastepnyTrue;   
          break;
    case 'bufor1':  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.prefix + this.bufordane[0] + dowykonania.sufix);
                    wynik = dowykonania.nastepnyTrue;
          break;
    case 'bufor2':  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.prefix + this.bufordane[1] + dowykonania.sufix);
                    wynik = dowykonania.nastepnyTrue;
           break;
    case 'bufor12': this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.prefix +this.bufordane[0] + ' ' + this.bufordane[1] + dowykonania.sufix);
                    wynik = dowykonania.nastepnyTrue;
          break;
    case 'notatka': switch (dowykonania.sufix)
                    {
                      case 'wlasciciel': this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.prefix + this.notatki.getNotatkaWlasciciel() );
                            wynik = dowykonania.nastepnyTrue;
                            break;
                      case 'identyfikator': this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.prefix + this.notatki.getNotatkaIdentyfikator() );
                            wynik = dowykonania.nastepnyTrue;
                            break;
                      default: wynik = 'bad'; break;
                    }
             
          break;
    default: wynik = 'bad'; break;
  }
return wynik;
}


Wykonaj(warunek: Polecenia): string
{
  let wynik: string;
  //console.log( 'warunek',warunek )
  //console.log( 'zalogowany',this.funkcje.getZalogowany() )
  switch (warunek.komunikat) {
    case 'edytuj':  switch (warunek.sufix) {
                            case 'on': this.notatki.setNotatkaEdytujOn(); wynik = warunek.nastepnyTrue;                              
                                break;
                            case 'off': this.notatki.setNotatkaEdytujOff(); wynik = warunek.nastepnyTrue;
                                break                                
                            default: wynik = 'bad';                              
                              break;
                          }
          break;
    default:
      wynik = 'bad';
      break;
  }
return wynik;
}

sprawdzWarunek(warunek: Polecenia): string
{
  const decyzjeT = ['t', 'T'];
  const decyzjeN = ['n', 'N'];
  let wynik: string;
  //console.log( 'warunek',warunek )
  //console.log( 'zalogowany',this.funkcje.getZalogowany() )
  switch (warunek.komunikat) {
    case 'notatka': if ( this.notatki.getNotatkaCzyWczytana() )
                        { wynik = warunek.nastepnyTrue}
                        else
                        { wynik = warunek.nastepnyFalse }
          break
    case 'edycja': if ( this.notatki.getNotatkaCzyEdycja() )
                      { wynik = warunek.nastepnyTrue}
                      else
                      { wynik = warunek.nastepnyFalse }
          break
    case 'edytuj': if ( this.notatki.getNotatkaMozliwoscEdycji() )
                      { wynik = warunek.nastepnyTrue}
                      else
                      { wynik = warunek.nastepnyFalse }
          break
    case 'zmiany': if ( this.notatki.getNotatkaZmiana() )
                      { wynik = warunek.nastepnyTrue}
                      else
                      { wynik = warunek.nastepnyFalse }
          break          
    case 'taknieSprawdz': if ( decyzjeT.concat(decyzjeN).indexOf(this.bufordane[0]) != -1 )
                      { wynik = warunek.nastepnyTrue}
                      else
                      { wynik = warunek.nastepnyFalse}
          break          
    case 'taknieZdecyduj': if ( decyzjeT.indexOf(this.bufordane[0]) != -1 )
                      { wynik = warunek.nastepnyTrue}
                      else
                      { wynik = warunek.nastepnyFalse}
          break          
default: wynik = 'bad'; break;
  }
return wynik;
}



Lista(dowykonania: any, tekst: string)
{
  //console.log(dowykonania)
  switch (dowykonania.komunikat) 
  {
/*    case 'polecenia': this.wyswietlLista( 0, false, this.polecenia.getPolecenia(), dowykonania, 
                      [{"",
                      {"prefix": "", "nazwa1": "nazwa", "separator":"", "nazwa2": "", "sufix": "", "kolor": 'rgb(00, 123, 255)', "rodzaj": 'liniakomend'}, 
                      ""}],
                      tekst); 
          break;
    case 'polecenia_all': this.wyswietlLista( 0, true, this.polecenia.getPolecenia(), dowykonania,
                      "",
                      {"prefix": "", "nazwa1": "nazwa", "separator":"", "nazwa2": "", "sufix": "", "kolor": 'rgb(00, 123, 255)', "rodzaj": 'liniakomend'}, 
                      "", this.funkcje.getDane0(), "", this.funkcje.getDane0(),
                      "", 
                      tekst); 
          break;
    case 'moduly': this.wyswietlLista(0, false, this.moduly.getModuly(), dowykonania,
                      'Moduł: "',
                      {"prefix": '', "nazwa1": "nazwa" , "separator":'', "nazwa2": "", "sufix": "", "kolor": 'rgb(00, 123, 255)', "rodzaj": 'liniakomend'}, 
                      '" symbol: [',      
                      {"prefix": "", "nazwa1": "symbol", "separator":"", "nazwa2": "", "sufix": "", "kolor": "rgb(00, 123, 255)", "rodzaj": "liniakomend"},
                      "]",
                      this.funkcje.getDane0(), "", 
                      tekst); 
          break;
    case 'notatki': this.wyswietlLista(0, false, this.notatki.getNotatki(), dowykonania,
                      "id: [",
                      {"prefix": "", "nazwa1": "identyfikator", "separator":"", "nazwa2": "", "sufix": "", "kolor": "rgb(00, 123, 255)", "rodzaj": "liniakomend"},
                      '] tutuł: "',
                      {"prefix": "", "nazwa1": "tytul" , "separator":" (autor: ", "nazwa2": "wlascicielText", "sufix": ")", "kolor": 'rgb(00, 123, 255)', "rodzaj": ''}, 
                      '" z dnia:',      
                      {"prefix": "", "nazwa1": "czas", "separator":" (", "nazwa2": "stanText", "sufix": ")", "kolor": "rgb(00, 123, 255)", "rodzaj": ""},
                      "", 
                      tekst); 
          break;      
  */}
  
}

GetSet(dowykonania: any)
{
 //console.log(dowykonania)
  switch (dowykonania.komunikat) 
  {
    case 'wczytaj': switch (dowykonania.sufix) {
          case 'moduly': this.moduly.Wczytajmoduly(this.funkcje.getZalogowany().zalogowany, dowykonania); break;
          case 'notatki': this.notatki.Wczytajnotatki(this.funkcje.getZalogowany().zalogowany, dowykonania); break;
          case 'notatka': this.notatki.WczytajnotatkiTresc(this.funkcje.getZalogowany().zalogowany, dowykonania, this.bufordane[0]); break;                
          }
        break;  
    case 'zapisz': switch (dowykonania.sufix) {
            case 'notatki': this.notatki.Zapisznotatki(this.funkcje.getZalogowany().zalogowany, this.bufordane[0], dowykonania); break;
            //case 'notatka': this.notatki.WczytajnotatkiTresc(this.funkcje.getZalogowany().zalogowany, dowykonania, this.bufordane[0]); break;                
            }
        break;
  }
}



wyswietlLista(licznik: number, wszystkie: boolean, lista: any, polecenie: any, prefix: string, linia: Nazwa[], sufix: string, tekst: string)
{
  
  //console.log('licznik ',licznik)
  //console.log('lista ',lista)
  //console.log('polecenie ',polecenie)
  //console.log('zalogowany ',this.funkcje.getZalogowany())
  //console.log('dane1 ',dane1)
  //console.log('dane2 ',dane2)
/*
  setTimeout(() => 
  {
    if (licznik < lista.length)
    {
      if ( ( ( (typeof lista[licznik].autoryzacja === 'boolean' ? lista[licznik].autoryzacja : false ) == wszystkie) || (wszystkie) ) && ( (typeof lista[licznik].polecenie === 'boolean' ? lista[licznik].polecenie : true) ) )
       { 
        let linie: Nazwa [] = [];
        for (let index = 0; index < linia.length; index++) {
          const element: Nazwa = 
                          {
                            "prefix": linia[index].prefix,
                            "text1": (linia[index].text1 != '' ? lista[licznik][linia[index].text1] : '' ),
                            "separator": linia[index].separator, 
                            "text2": (linia[index].text2 != '' ? lista[licznik][linia[index].text2] : '' ),
                            "sufix": linia[index].sufix,
                            "kolor": linia[index].kolor,
                            "rodzaj": linia[index].rodzaj
                          };
          linie = [...linie, element]                          
        }
        this.funkcje.addLiniaKomunikatu
        (
            this.funkcje.dedal, 
            prefix,
            linie,
            sufix
        )
        }
      this.wyswietlLista(++licznik, wszystkie, lista, polecenie,prefix, linia,  sufix, tekst)
    }
    else
    {
      //console.log('i next')
      this.poleceniaWykonaj(polecenie.nastepnyTrue, tekst)
    }
  }, polecenie.czas);
*/
}
/* (end) pomoc */
}
