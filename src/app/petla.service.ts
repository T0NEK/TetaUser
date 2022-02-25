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
private zapisznotatkitrescsubscribe_p = new Subscription();
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
  this.zapisznotatkitrescsubscribe_p = this.notatki.ZapiszTrescNotatki$.subscribe
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
   if(this.zapisznotatkitrescsubscribe_p) { this.zapisznotatkisubscribe_p.unsubscribe(); }   
  }

poleceniaWykonaj(polecenie: string, tekst: string)
{
 //console.log('działanie ',polecenie)
 //console.log('tekst: ',tekst)
 //console.log('bufordane: ',this.bufordane)
  if (polecenie != 'end')
 {
    let dowykonania = this.polecenia.sprawdzDzialania(polecenie) 
    //console.log('polecenie: ',dowykonania)
    switch (dowykonania.dzialanie) {
      case 'komunikat': setTimeout(() => {
                                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(), dowykonania.komunikat);
                                this.poleceniaWykonaj(dowykonania.nastepnyTrue, tekst);   
                              }, dowykonania.czas);
            break;
      case 'informacja': setTimeout(() => {
                                let wynik = this.Informacje(dowykonania, tekst) 
                                this.poleceniaWykonaj(wynik, tekst);     
                                }, dowykonania.czas);
            break;
      case 'dane': setTimeout(() => {
                                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(), dowykonania.komunikat); 
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
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(), dowykonania.komunikat);
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
    case 'tekst': this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(), dowykonania.prefix + tekst + dowykonania.sufix);
                  wynik = dowykonania.nastepnyTrue;   
          break;
    case 'tekstAlert': this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(), dowykonania.prefix + tekst + dowykonania.sufix);
          wynik = dowykonania.nastepnyTrue;   
          break;
    case 'tekstPolecenie': 
    this.funkcje.addLiniaKomunikatu("", this.funkcje.getDedal(), "", "", [this.funkcje.setNazwaLinia(dowykonania.prefix, [this.funkcje.setTextNazwa("", tekst, "", this.funkcje.getKolor().liniakomend, "liniakomend")], dowykonania.sufix)], "");
    //this.funkcje.addLiniaKomunikatuPolecenia(this.funkcje.getDedal(), dowykonania.prefix + tekst + dowykonania.sufix);
          wynik = dowykonania.nastepnyTrue;   
          break;
    case 'bufor1':  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(), dowykonania.prefix + this.bufordane[0] + dowykonania.sufix);
                    wynik = dowykonania.nastepnyTrue;
          break;
    case 'bufor2':  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(), dowykonania.prefix + this.bufordane[1] + dowykonania.sufix);
                    wynik = dowykonania.nastepnyTrue;
           break;
    case 'bufor12': this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(), dowykonania.prefix +this.bufordane[0] + dowykonania.sufix + this.bufordane[1]);
                    wynik = dowykonania.nastepnyTrue;
          break;
    case 'notatka': switch (dowykonania.sufix)
                    {
                      case 'wlasciciel': this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(), dowykonania.prefix + this.notatki.getNotatkaWlasciciel() );
                            wynik = dowykonania.nastepnyTrue;
                            break;
                      case 'identyfikator': this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(), dowykonania.prefix + this.notatki.getNotatkaIdentyfikator() );
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
    case 'kasuj': switch (warunek.sufix) {
                          case 'historia': this.funkcje.setLiniaDialoguClear(); wynik = warunek.nastepnyTrue;
                                break;
                          case 'polecenia': this.funkcje.setLiniaKomunikatuHistoriaClear(); wynik = warunek.nastepnyTrue; 
                                break;
                          case 'notatka': this.notatki.setNotatkaClear(); wynik = warunek.nastepnyTrue; 
                                break;
                          default: wynik = 'bad';                              
                            break;
                          }
          break;
    case 'notatka': switch (warunek.sufix) {
                          case 'wersja': this.notatki.setNotatkaWersja(this.bufordane[0]); wynik = warunek.nastepnyTrue;
                                break;
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
  const decyzjeC = ['1','2','3','4','5','6','7','8','9','0'];
  let wynik: string;
  //console.log( 'warunek',warunek )
  //console.log( 'zalogowany',this.funkcje.getZalogowany() )
  switch (warunek.komunikat) {
    case 'notatka': switch (warunek.sufix) {
                          case 'wczytana': if ( this.notatki.getNotatkaCzyWczytana() )
                                          { wynik = warunek.nastepnyTrue} else { wynik = warunek.nastepnyFalse }
                                break;
                          case 'edycja': if ( this.notatki.getNotatkaCzyEdycja() )
                                          { wynik = warunek.nastepnyTrue} else { wynik = warunek.nastepnyFalse }
                                break
                          case 'edytuj': if ( this.notatki.getNotatkaMozliwoscEdycji(this.funkcje.getZalogowany().zalogowany) )
                                          { wynik = warunek.nastepnyTrue} else { wynik = warunek.nastepnyFalse }
                                break
                          case 'zmiany': if ( this.notatki.getNotatkaZmiana() )
                                          { wynik = warunek.nastepnyTrue} else { wynik = warunek.nastepnyFalse }
                                break          
                          case 'zakres': if ( this.notatki.getNotatkaZakres(Number(this.bufordane[0])) )
                                          { wynik = warunek.nastepnyTrue} else { wynik = warunek.nastepnyFalse }
                                break
                          case 'dostepna': this.bufordane[1] = this.notatki.getNotatkaCzyDostepna(Number(this.bufordane[0]))
                          //console.log(this.bufordane)
                          //console.log(this.bufordane[1] === true)
                                          if ( this.bufordane[1] === true )
                                          { wynik = warunek.nastepnyTrue} else { wynik = warunek.nastepnyFalse }   
                                break             
                          case 'identyfikator': if ( this.bufordane[0] == this.notatki.getNotatkaIdentyfikator() )
                                          { wynik = warunek.nastepnyTrue} else { wynik = warunek.nastepnyFalse }                      
                                break          
                default: wynik = 'bad'; break;
                          }
          break
    case 'sprawdz': switch (warunek.sufix) {
                          case 'number':  wynik = warunek.nastepnyTrue;
                                          for (let index = 0; index < this.bufordane[0].length; index++) 
                                          { if ( decyzjeC.indexOf(this.bufordane[0][index]) <0 )
                                            { wynik = warunek.nastepnyFalse; break; }
                                          }                    
                                break          
                          case 'taknie': if ( decyzjeT.concat(decyzjeN).indexOf(this.bufordane[0]) != -1 )
                                        { wynik = warunek.nastepnyTrue} else { wynik = warunek.nastepnyFalse}
                                break          
                          default: wynik = 'bad'; break;
                          }    
          break;                  
    case 'zdecyduj': switch (warunek.sufix) {          
                          case 'taknie': if ( decyzjeT.indexOf(this.bufordane[0]) != -1 )
                                        { wynik = warunek.nastepnyTrue} else { wynik = warunek.nastepnyFalse}
                          break;
                          default: wynik = 'bad'; break;
                          }    
          break;          
    default: wynik = 'bad'; break;
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
                      [this.funkcje.setNazwaLinia("", [this.funkcje.setTextNazwa("", "nazwa", "", this.funkcje.getKolor().liniakomend, "liniakomend")], "")],
                      "",
                      tekst); 
          break;
    case 'polecenia_all': this.wyswietlLista( 0, true, this.polecenia.getPolecenia(), dowykonania,
                      "", 
                      [this.funkcje.setNazwaLinia("", [this.funkcje.setTextNazwa("", "nazwa", "", this.funkcje.getKolor().liniakomend, "liniakomend")], "")],
                      "",
                      tekst); 
          break;      
    case 'moduly': this.wyswietlLista( 0, false, this.moduly.getModuly(), dowykonania,
                      "", 
                      [this.funkcje.setNazwaLinia('Moduł: "', [this.funkcje.setTextNazwa("", "nazwa", "", this.funkcje.getKolor().liniakomend, "liniakomend")], '"'),
                       this.funkcje.setNazwaLinia(" symbol: [ ", [this.funkcje.setTextNazwa("", "symbol", "", this.funkcje.getKolor().liniakomend, "liniakomend")], " ]"),
                      ],
                      "",
                      tekst); 
          break;
    case 'dostep': this.wyswietlLista( 0, false, this.notatki.getNotatki(), dowykonania,
                      "", 
                      [this.funkcje.setNazwaLinia('osoba: ', [this.funkcje.setTextNazwa("", "stanText", " ", this.funkcje.getKolor().liniakomend, "liniakomend")], ' '),
                      this.funkcje.setNazwaLinia('', [this.funkcje.setTextNazwa("", "wlascicielText", "", this.funkcje.getKolor().liniakomend, "liniakomend")], ''),
                      this.funkcje.setNazwaLinia(" funkcja: ", [this.funkcje.setTextNazwa("(", "tytul", ")", "", "")], ""),
                      ],
                      "",
                      tekst); 
          break;      
    case 'notatki': this.wyswietlLista( 0, false, this.notatki.getNotatki(), dowykonania,
          "", 
          [this.funkcje.setNazwaLinia('id: [ ', [this.funkcje.setTextNazwa("", "identyfikator", "", this.funkcje.getKolor().liniakomend, "liniakomend")], ' ];'),
           this.funkcje.setNazwaLinia(' tutuł: "', [this.funkcje.setTextNazwa("", "tytul", "", this.funkcje.getKolor().liniakomend, "liniakomend")], '";'),
           this.funkcje.setNazwaLinia(' autor: "', [this.funkcje.setTextNazwa("", "wlascicielText", "", "", "")], '";'),
           this.funkcje.setNazwaLinia(' z dnia: ', [this.funkcje.setTextNazwa("", "czas", "", "", "")], ';'),
           this.funkcje.setNazwaLinia(' dostepność: ', [this.funkcje.setTextNazwa("", "stanText", "", "", "")], '')
          ],
          "",
          tekst); 
    break;
 }
  
}

GetSet(dowykonania: any)
{
 //console.log(dowykonania)
  switch (dowykonania.komunikat) 
  {
    case 'wczytaj': switch (dowykonania.sufix) {
          case 'moduly': this.moduly.Wczytajmoduly(this.funkcje.getZalogowany().zalogowany, dowykonania); break;
          case 'notatki': this.notatki.Wczytajnotatki(this.funkcje.getZalogowany().zalogowany, dowykonania); break;
          case 'notatka_dostep': this.notatki.WczytajnotatkiDostep(this.funkcje.getZalogowany().zalogowany, dowykonania, this.bufordane[0]); break;                
          case 'notatka': this.notatki.WczytajnotatkiTresc(this.funkcje.getZalogowany().zalogowany, dowykonania, this.bufordane[0]); break;                
          }
        break;  
    case 'zapisz': switch (dowykonania.sufix) {
            case 'notatki': this.notatki.Zapisznotatki(this.funkcje.getZalogowany().zalogowany, this.bufordane[0], dowykonania); break;
            case 'notatka': this.notatki.ZapiszTrescnotatki(dowykonania); break;                
            }
        break;
    case 'usun': switch (dowykonania.sufix) {
            case 'notatki': this.notatki.Usunnotatki(this.funkcje.getZalogowany().zalogowany, this.bufordane[0], dowykonania); break;
            }
         break;        
    case 'udostepnij': switch (dowykonania.sufix) {
            case 'notatki': this.notatki.Udostepnijnotatki(this.funkcje.getZalogowany().zalogowany, this.bufordane[0], [this.bufordane[1], this.bufordane[2]],  dowykonania); break;
            }
       break;             
  }
}



wyswietlLista(licznik: number, wszystkie: boolean, lista: any, polecenie: any, prefix: string, linia: Linia[], sufix: string, tekst: string)
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
      if ( ( (wszystkie) ) && ( (typeof lista[licznik].polecenie === 'boolean' ? lista[licznik].polecenie : true) ) )
       { 
        let liniaNew: Linia[] = [];
        for (let indexL = 0; indexL < linia.length; indexL++) 
        {
          let nazwaNew: Nazwa[] = [];
          for (let indexT = 0; indexT < linia[indexL].text.length; indexT++) {
            //const element2 = (typeof linia[indexL].text[indexT].text === "string" ? lista[licznik][linia[indexL].text[indexT].text] : '')
            //console.log('element2 ',element2)      
            nazwaNew = [...nazwaNew, this.funkcje.setTextNazwa(
                              linia[indexL].text[indexT].prefix,
                              (typeof linia[indexL].text[indexT].text === "string" ? lista[licznik][linia[indexL].text[indexT].text]:''),
                              linia[indexL].text[indexT].sufix,
                              linia[indexL].text[indexT].kolor,
                              linia[indexL].text[indexT].rodzaj
                        )]
          }  
        liniaNew = [...liniaNew, this.funkcje.setNazwaLinia(
                              linia[indexL].prefix,
                              nazwaNew,
                              linia[indexL].sufix
                        )]
        }
        this.funkcje.addLiniaKomunikatu("", this.funkcje.getDedal(), "", "", liniaNew, "");
      }
      this.wyswietlLista(++licznik, wszystkie, lista, polecenie,prefix, linia,  sufix, tekst)
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
