import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';
import { Polecenia } from './definicje'
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { AppComponent } from './app.component';

@Injectable({ providedIn: 'root'})
export class PoleceniaService {

constructor(private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService, private http: HttpClient)
{
    //console.log('con polecenia')
}

private polecenia: Polecenia[] = [];  
private dzialania: Polecenia[] = [];  
private bufordane = Array();


poleceniaWykonaj(polecenie: string, tekst: string = '')
{
 // console.log('działanie ',polecenie)
 // console.log('tekst: ',tekst)
  let dowykonania = this.sprawdzDzialania(polecenie)
//  console.log('polecenie: ',dowykonania)
  switch (dowykonania.dzialanie) {
    case 'wyswietlpolecenia': setTimeout(() => { 
                                                this.polecenieWyswietl(dowykonania);
                                               }, dowykonania.czas);
          break;
    case 'wyswietlkomunikat': this.funkcje.addLiniaKomunikatu(this.funkcje.dedal,dowykonania.komunikat,'');
                              this.poleceniaWykonaj(dowykonania.nastepny);   
          break;
    case 'wyswietlpytanie': setTimeout(() => {
                                                this.funkcje.addLiniaKomunikatu(this.funkcje.dedal,dowykonania.komunikat,''); 
                                                this.funkcje.UstawStanPolecenia(dowykonania)
                                             }, dowykonania.czas);
          break;
    case 'zapiszdane': this.bufordane = [];
                       this.bufordane = [...this.bufordane,tekst];
                       setTimeout(() => 
                       {
                         this.poleceniaWykonaj(dowykonania.nastepny)
                       }, dowykonania.czas);
          break;                                   
    case 'dodajdane':  this.bufordane = [...this.bufordane,tekst];
                        setTimeout(() => 
                        {
                          this.poleceniaWykonaj(dowykonania.nastepny)
                        }, dowykonania.czas);
          break;   
    case 'password': this.funkcje.Password(dowykonania.komunikat);
                     this.poleceniaWykonaj(dowykonania.nastepny);   
          break;
    case 'logowanie': this.komunikacja.Zaloguj(this.bufordane);
                      this.poleceniaWykonaj(dowykonania.nastepny);         
          break;  
    case 'wyloguj': 
          break;              
    case 'bad': 
                this.funkcje.addLiniaKomunikatu(this.funkcje.dedal,dowykonania.komunikat,'');
          break;      
  default:
          break;
  }
}

/* (start) pomoc */
polecenieWyswietl(polecenie: any)
{
   for (let index = 0; index < this.polecenia.length; index++)
    {
      setTimeout(() => 
      {
        this.funkcje.addLiniaKomunikatu(this.funkcje.dedal,this.polecenia[index].nazwa,'rgb(00, 123, 255)','liniakomend');
      }, polecenie.czas * index);
    }        
      setTimeout(() => 
      {
        this.poleceniaWykonaj(polecenie.nastepny)
      }, polecenie.czas * this.polecenia.length);
}

/* (end) pomoc */



/* (start) polecenia*/
getPolecenia (){ return this.polecenia; }
sprawdzPolecenie(polecenie: string)
{
  let wynik = <Polecenia> {"nazwa": polecenie, "czas": 2000, "komunikat": "Nieznane polecenie: '" + polecenie + "'", "dzialanie": "bad", "nastepny": "brak"}
  for (let index = 0; index < this.polecenia.length; index++) 
  {
    if ( this.polecenia[index].nazwa == polecenie )
    {
       wynik = {"nazwa": this.polecenia[index].nazwa,
                "czas": this.polecenia[index].czas,
                "komunikat": this.polecenia[index].komunikat, 
                "dzialanie": this.polecenia[index].dzialanie,
                "nastepny": this.polecenia[index].nastepny
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
                      "nastepny": wynik.polecenia[index].nastepny
                      }]
              }  
              //console.log(this.polecenia)
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
  let wynik = <Polecenia>{"nazwa": dzialanie, "czas": 2000, "komunikat": "Wystąpił jakiś błąd","dzialanie":"komunikat", "nastepny": "bad"}
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
                "nastepny": this.dzialania[index].nastepny
               } 
       break;        
    }       
  }  
return wynik  
}

WczytajDzialania(stan: number)
{
    this.dzialania = [];
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
                      "nastepny": wynik.polecenia[index].nastepny,
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
