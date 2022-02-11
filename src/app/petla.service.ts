import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';
import { Nazwa, Polecenia } from './definicje'
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
}


ngOnDestroy()
  {
   if(this.modulysubscribe_p) { this.modulysubscribe_p.unsubscribe(); }   
   if(this.poleceniasubscribe_p) { this.modulysubscribe_p.unsubscribe(); }   
   if(this.dzialaniasubscribe_p) { this.modulysubscribe_p.unsubscribe(); }   
   if(this.notatkisubscribe_p) { this.notatkisubscribe_p.unsubscribe(); }   
  }

poleceniaWykonaj(polecenie: string, tekst: string)
{
 //console.log('działanie ',polecenie)
 //console.log('tekst: ',tekst)
  if (polecenie != 'end')
 {
    let dowykonania = this.polecenia.sprawdzDzialania(polecenie) 
    //console.log('polecenie: ',dowykonania)
    switch (dowykonania.dzialanie) {
      case 'komunikat': setTimeout(() => {
                                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.komunikat);
                                this.poleceniaWykonaj(dowykonania.nastepnyTrue, tekst);   
                              }, dowykonania.czas);
            break;
      case 'informacja': setTimeout(() => {
                                  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, tekst);
                                  this.poleceniaWykonaj(dowykonania.nastepnyTrue, tekst);   
                                }, dowykonania.czas);
            break;
      case 'dane': setTimeout(() => {
                                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.dedal, dowykonania.komunikat); 
                                this.funkcje.UstawStanPolecenia(dowykonania)
                              }, dowykonania.czas);
            break;
      case 'warunek': setTimeout(() => {
                                let wynik = this.sprawdzWarunek(dowykonania);
                                this.poleceniaWykonaj(wynik, tekst);   
                              }, dowykonania.czas);                                
            break;      
      case 'wczytaj': setTimeout(() => { 
                                this.Wczytaj(dowykonania);
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


sprawdzWarunek(warunek: Polecenia): string
{
  let wynik: string;
  //console.log( 'warunek',warunek )
  //console.log( 'zalogowany',this.funkcje.getZalogowany() )
  switch (warunek.komunikat) {
    case 'autoryzacja': if ( this.funkcje.getZalogowany().autoryzacja < warunek.autoryzacja )
                        { wynik = warunek.nastepnyFalse }
                        else
                        { wynik = warunek.nastepnyTrue}
      
      break;
    default:
      wynik = 'bad';
      break;
  }
return wynik;
}



Lista(dowykonania: any, tekst: string)
{
  //console.log(dowykonania)
  switch (dowykonania.komunikat) 
  {
    case 'polecenia': this.wyswietlLista( 0, false, this.polecenia.getPolecenia(), dowykonania, 
                      "",
                      {"prefix": "", "nazwa1": "nazwa", "separator":"", "nazwa2": "", "sufix": "", "kolor": 'rgb(00, 123, 255)', "rodzaj": 'liniakomend'}, 
                      "", this.funkcje.getDane0(), "", this.funkcje.getDane0(),
                      "",
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
                      {"prefix": "", "nazwa1": "id", "separator":"", "nazwa2": "", "sufix": "", "kolor": "rgb(00, 123, 255)", "rodzaj": "liniakomend"},
                      '] tutuł: "',
                      {"prefix": "", "nazwa1": "tytul" , "separator":" (autor: ", "nazwa2": "wlascicielText", "sufix": ")", "kolor": 'rgb(00, 123, 255)', "rodzaj": ''}, 
                      '" z dnia:',      
                      {"prefix": "", "nazwa1": "czas", "separator":" (", "nazwa2": "stanText", "sufix": ")", "kolor": "rgb(00, 123, 255)", "rodzaj": ""},
                      "", 
                      tekst); 
          break;      
  }
  
}

Wczytaj(dowykonania: any)
{
 //console.log(dowykonania)
  switch (dowykonania.komunikat) 
  {
    case 'moduly': this.moduly.Wczytajmoduly(this.funkcje.getZalogowany().zalogowany, dowykonania); break;
    case 'notatki': this.notatki.Wczytajnotatki(this.funkcje.getZalogowany().zalogowany, dowykonania); break;
  }
}



wyswietlLista(licznik: number, wszystkie: boolean, lista: any, polecenie: any, prefix: string, dane1: Nazwa, separator1: string, dane2: Nazwa, separator2: string, dane3: Nazwa, sufix: string, tekst: string)
{
  
  //console.log('licznik ',licznik)
  //console.log('lista ',lista)
  //console.log('polecenie ',polecenie)
  //console.log('zalogowany ',this.funkcje.getZalogowany())
  //console.log('dane1 ',dane1)
  //console.log('dane2 ',dane2)
  setTimeout(() => 
  {
    if (licznik < lista.length)
    {
      if ( ( ( (typeof lista[licznik].autoryzacja === 'boolean' ? lista[licznik].autoryzacja : false ) == wszystkie) || (wszystkie) ) && ( (typeof lista[licznik].polecenie === 'boolean' ? lista[licznik].polecenie : true) ) )
       { 
        this.funkcje.addLiniaKomunikatu
        (
            this.funkcje.dedal, 
            prefix,
            { "prefix": dane1.prefix,
              "nazwa1":(dane1.nazwa1 != '' ? lista[licznik][dane1.nazwa1] : '' ),
              "separator": dane1.separator, 
              "nazwa2": (dane1.nazwa2 != '' ? lista[licznik][dane1.nazwa2] : '' ),
              "sufix": dane1.sufix,
              "kolor": dane1.kolor,
              "rodzaj": dane1.rodzaj
            },
            separator1, 
            { "prefix": dane2.prefix,
              "nazwa1": (dane2.nazwa1 != '' ? lista[licznik][dane2.nazwa1] : '' ),
              "separator": dane2.separator,
              "nazwa2": (dane2.nazwa2 != '' ? lista[licznik][dane2.nazwa2] : '' ),
              "sufix": dane2.sufix,
              "kolor": dane2.kolor, 
              "rodzaj": dane2.rodzaj
            },  
            separator2, 
            { "prefix": dane3.prefix,
              "nazwa1": (dane3.nazwa1 != '' ? lista[licznik][dane3.nazwa1] : '' ),
              "separator": dane3.separator,
              "nazwa2": (dane3.nazwa2 != '' ? lista[licznik][dane3.nazwa2] : '' ),
              "sufix": dane3.sufix,
              "kolor": dane3.kolor, 
              "rodzaj": dane3.rodzaj
            },  
            sufix
        )
        }
      this.wyswietlLista(++licznik, wszystkie, lista, polecenie,prefix, dane1, separator1, dane2, separator2, dane3, sufix, tekst)
    }
    else
    {
      //console.log('i next')
      this.poleceniaWykonaj(polecenie.nastepnyTrue, tekst)
    }
  }, polecenie.czas);
}
/* (end) pomoc */
}
