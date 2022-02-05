import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';
import { Polecenia } from './definicje'
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { ModulyService } from './moduly.service';

@Injectable({ providedIn: 'root'})

export class PoleceniaService implements OnDestroy 
{

private modulysubscribe_p = new Subscription();
private polecenia: Polecenia[] = [];  
private dzialania: Polecenia[] = [];  
private bufordane = Array();


constructor(private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService, private http: HttpClient, private moduly: ModulyService)
{
    //console.log('con polecenia')
  this.modulysubscribe_p = this.moduly.OdczytajModuly$.subscribe
    ( data => { this.poleceniaWykonaj(data) } )
}


ngOnDestroy()
  {
   if(this.modulysubscribe_p) { this.modulysubscribe_p.unsubscribe()}   
  }

poleceniaWykonaj(polecenie: string, tekst: string = '')
{
 // console.log('działanie ',polecenie)
 // console.log('tekst: ',tekst)
  if (polecenie != 'end')
 {
    let dowykonania = this.sprawdzDzialania(polecenie) 
    console.log('polecenie: ',dowykonania)
    switch (dowykonania.dzialanie) {
      case 'komunikat': setTimeout(() => {
                                this.funkcje.addLiniaKomunikatu(this.funkcje.dedal,dowykonania.komunikat,'');
                                this.poleceniaWykonaj(dowykonania.nastepnyTrue);   
                              }, dowykonania.czas);
            break;
      case 'dane': setTimeout(() => {
                                this.funkcje.addLiniaKomunikatu(this.funkcje.dedal,dowykonania.komunikat,''); 
                                this.funkcje.UstawStanPolecenia(dowykonania)
                              }, dowykonania.czas);
            break;
      case 'warunek': setTimeout(() => {
                                let wynik = this.sprawdzWarunek(dowykonania);
                                this.poleceniaWykonaj(wynik);   
                              }, dowykonania.czas);                                
            break;      
      case 'wczytaj': setTimeout(() => { 
                                this.Wczytaj(dowykonania);
                                }, dowykonania.czas);
            break;
      case 'linie': setTimeout(() => {  
                                this.Lista(dowykonania)    
                              //  this.polecenieWyswietl(dowykonania);
                                }, dowykonania.czas);
            break;
      case 'zapiszdane': this.bufordane = [];
                         this.bufordane = [...this.bufordane,tekst];
                         setTimeout(() => 
                         {
                           this.poleceniaWykonaj(dowykonania.nastepnyTrue)
                         }, dowykonania.czas);
            break;                                   
      case 'dodajdane':  this.bufordane = [...this.bufordane,tekst];
                          setTimeout(() => 
                          {
                            this.poleceniaWykonaj(dowykonania.nastepnyTrue)
                          }, dowykonania.czas);
            break;   
      case 'password': this.funkcje.Password(dowykonania.komunikat);
                       this.poleceniaWykonaj(dowykonania.nastepnyTrue);   
            break;
      case 'logowanie': this.bufordane = [...this.bufordane,0];
                        this.komunikacja.Zaloguj(this.bufordane);
                        this.poleceniaWykonaj(dowykonania.nastepnyTrue);         
            break;  
      case 'wylogowanie': this.bufordane = ['', '', this.funkcje.getZalogowany().zalogowany];
                          this.komunikacja.Zaloguj(this.bufordane);
                          this.poleceniaWykonaj(dowykonania.nastepnyTrue);         
            break;              
      case 'bad': 
                  this.funkcje.addLiniaKomunikatu(this.funkcje.dedal,dowykonania.komunikat,'');
            break;  
    default:
            break;
    }
 }
 else
 {
  this.funkcje.OdblokujLinieDialogu('');
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



Lista(dowykonania: any)
{
  //console.log(dowykonania)
  switch (dowykonania.komunikat) 
  {
    case 'polecenia': this.wyswietlLista(0, false, this.polecenia, dowykonania, 'rgb(00, 123, 255)', 'liniakomend'); break;
    case 'polecenia_all': this.wyswietlLista(0, true, this.polecenia, dowykonania, 'rgb(00, 123, 255)', 'liniakomend'); break;
    case 'moduly': this.wyswietlLista(0, false, this.moduly.getModuly(), dowykonania, 'rgb(00, 123, 255)', 'liniakomend'); break;
  }
  
}

Wczytaj(dowykonania: any)
{
  console.log(dowykonania)
  switch (dowykonania.komunikat) 
  {
    case 'polecenia': this.WczytajPolecenia(this.funkcje.getZalogowany().zalogowany); break;
    case 'dzialania': this.WczytajDzialania(this.funkcje.getZalogowany().zalogowany); break;
    case 'moduly': this.moduly.Wczytajmoduly(this.funkcje.getZalogowany().zalogowany, dowykonania); break;
  }
}



wyswietlLista(licznik: number, wszystkie: boolean, lista: any, polecenie: any, kolor: string, rodzaj: string)
{
  console.log('licznik ',licznik)
  console.log('lista ',lista)
  console.log('polecenie ',polecenie)
  console.log('zalogowany ',this.funkcje.getZalogowany())
  setTimeout(() => 
  {
    if (licznik < lista.length)
    {
      if (((lista[licznik].autoryzacja == wszystkie)||(wszystkie))&&(lista[licznik].polecenie))
       { this.funkcje.addLiniaKomunikatu(this.funkcje.dedal, lista[licznik].nazwa, kolor, rodzaj, (typeof lista[licznik].symbol === 'string' ? ' ['+lista[licznik].symbol+']' : '' )), kolor, rodzaj }
      this.wyswietlLista(++licznik, wszystkie, lista, polecenie, kolor, rodzaj)
    }
    else
    {
      //console.log('i next')
      this.poleceniaWykonaj(polecenie.nastepnyTrue)
    }
  }, polecenie.czas);
}
/* (end) pomoc */





/* (start) polecenia*/
getPolecenia (){ return this.polecenia; }
sprawdzPolecenie(polecenie: string)
{
  let wynik = <Polecenia> {"nazwa": polecenie, "czas": 2000, "komunikat": "Nieznane polecenie: '" + polecenie + "'", "dzialanie": "bad", "autoryzacja": false, "polecenie": true, "nastepnyTrue": "brak", "nastepnyFalse": "brak"}
  for (let index = 0; index < this.polecenia.length; index++) 
  {
    if ( this.polecenia[index].nazwa == polecenie )
    {
       wynik = {"nazwa": this.polecenia[index].nazwa,
                "czas": this.polecenia[index].czas,
                "komunikat": this.polecenia[index].komunikat, 
                "dzialanie": this.polecenia[index].dzialanie,
                "autoryzacja": this.polecenia[index].autoryzacja,
                "polecenie": this.polecenia[index].polecenie,
                "nastepnyTrue": this.polecenia[index].nastepnyTrue,
                "nastepnyFalse": this.polecenia[index].nastepnyFalse
         } 
       //this.poleceniePomoc();        
       break;        
    }       
  }
return wynik  
}

WczytajPolecenia(stan: number)
{
    this.polecenia = [];
    this.odczytaj_polecenia(stan);
}

private OdczytajPolecenia = new Subject<any>();
OdczytajPolecenia$ = this.OdczytajPolecenia.asObservable()
private odczytaj_polecenia(stan: number)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "stan": stan})  
  
  this.http.post(this.komunikacja.getURL() + 'polecenia/', data, httpOptions).subscribe( 
    data =>  {
            let wynik = JSON.parse(JSON.stringify(data));
            if (wynik.wynik == true) 
            {
              for (let index = 0; index < wynik.polecenia.length; index++) 
              {
                
                    this.polecenia = [...this.polecenia, {
                      "nazwa": wynik.polecenia[index].nazwa, 
                      "czas": wynik.polecenia[index].czas, 
                      "komunikat": wynik.polecenia[index].komunikat, 
                      "dzialanie": wynik.polecenia[index].dzialanie,
                      "autoryzacja": wynik.polecenia[index].autoryzacja,
                      "polecenie": wynik.polecenia[index].polecenie,
                      "nastepnyTrue": wynik.polecenia[index].nastepnyTrue,
                      "nastepnyFalse": wynik.polecenia[index].nastepnyFalse
                      }]
              }  
            //  console.log(this.polecenia)
            }
            else
            {
              setTimeout(() => {this.odczytaj_polecenia(stan)}, 1000) 
            }
              },
    error => {
              setTimeout(() => {this.odczytaj_polecenia(stan)}, 1000) 
             }
             )      
}
/* (end) polecenia*/


/* (start) działania*/
getDzialania (){ return this.dzialania; }

sprawdzDzialania(dzialanie: string)
{
  let wynik = <Polecenia>{"nazwa": dzialanie, "czas": 2000, "komunikat": "Wystąpił błąd wykonania", "dzialanie":"komunikat", "autoryzacja": false, "polecenie": true, "nastepnyTrue": "end", "nastepnyFalse": "end"}
  for (let index = 0; index < this.dzialania.length; index++) 
  {
    //console.log(this.dzialania[index].nazwa,' == ',dzialanie)
    if ( this.dzialania[index].nazwa == dzialanie )
    {
      //console.log('jest')
       wynik = {"nazwa": this.dzialania[index].nazwa,
                "czas": this.dzialania[index].czas,
                "komunikat": this.dzialania[index].komunikat, 
                "dzialanie": this.dzialania[index].dzialanie,
                "autoryzacja": this.dzialania[index].autoryzacja,
                "polecenie": this.dzialania[index].polecenie,
                "nastepnyTrue": this.dzialania[index].nastepnyTrue,
                "nastepnyFalse": this.dzialania[index].nastepnyFalse
               } 
       break;        
    }       
  }  
return wynik  
}

WczytajDzialania(stan: number)
{
    this.dzialania = [{"nazwa": "bad", "czas": 2000, "komunikat": "Nieznane polecenie", "dzialanie":"komunikat", "autoryzacja": false, "polecenie": true, "nastepnyTrue": "end", "nastepnyFalse": "end"}];
    this.odczytaj_dzialania(stan);
}


private OdczytajDzialania = new Subject<any>();
OdczytajDzialania$ = this.OdczytajDzialania.asObservable()
private odczytaj_dzialania(stan: number)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "stan": stan})  
  
  this.http.post(this.komunikacja.getURL() + 'dzialania/', data, httpOptions).subscribe( 
    data =>  {
            let wynik = JSON.parse(JSON.stringify(data));
            if (wynik.wynik == true) 
            {
             // console.log('wynik ',wynik)  
              for (let index = 0; index < wynik.polecenia.length; index++) 
              {
              this.dzialania = [...this.dzialania, {
                      "nazwa": wynik.polecenia[index].nazwa, 
                      "czas": wynik.polecenia[index].czas, 
                      "komunikat": wynik.polecenia[index].komunikat, 
                      "dzialanie": wynik.polecenia[index].dzialanie,
                      "autoryzacja": wynik.polecenia[index].autoryzacja,
                      "polecenie": wynik.polecenia[index].polecenie,
                      "nastepnyTrue": wynik.polecenia[index].nastepnyTrue,
                      "nastepnyFalse": wynik.polecenia[index].nastepnyFalse
                      }]
              } 
              //console.log(this.dzialania) 
            }
            else
            {
              setTimeout(() => {this.odczytaj_dzialania(stan)}, 1000) 
            }
              },
    error => {
              setTimeout(() => {this.odczytaj_dzialania(stan)}, 1000) 
             }
             )      
}


/* (end) działania*/

}
