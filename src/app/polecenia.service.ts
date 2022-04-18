import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CzasService } from './czas.service';
import { Polecenia } from './definicje';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})

export class PoleceniaService {

  private dzialania: Polecenia[] = [];  
  private polecenia: Polecenia[] = [];  

constructor(private http: HttpClient, private komunikacja: KomunikacjaService)
{

}


/* (start) polecenia*/
getPolecenia (){ return this.polecenia; }
sprawdzPolecenie(polecenie: string)
{
  let wynik = <Polecenia> {"id":0, "nazwa": polecenie, "czas": 2000, "komunikat": "Nieznane polecenie: '" + polecenie + "'", "dzialanie": "bad", "polecenie": true, "nastepnyTrue": "brak", "nastepnyFalse": "brak"}
  for (let index = 0; index < this.polecenia.length; index++) 
  {
    if ( this.polecenia[index].nazwa.toLowerCase() == polecenie.toLowerCase() )
    {
       wynik = {"id": this.polecenia[index].id,
                "nazwa": this.polecenia[index].nazwa,
                "czas": this.polecenia[index].czas,
                "prefix": this.polecenia[index].prefix, 
                "komunikat": this.polecenia[index].komunikat, 
                "sufix": this.polecenia[index].sufix, 
                "dzialanie": this.polecenia[index].dzialanie,
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
                      "id": wynik.polecenia[index].id,
                      "nazwa": wynik.polecenia[index].nazwa, 
                      "czas": wynik.polecenia[index].czas, 
                      "prefix": wynik.polecenia[index].prefix, 
                      "komunikat": wynik.polecenia[index].komunikat, 
                      "sufix": wynik.polecenia[index].sufix, 
                      "dzialanie": wynik.polecenia[index].dzialanie,
                      "polecenie": wynik.polecenia[index].polecenie,
                      "nastepnyTrue": wynik.polecenia[index].nastepnyTrue,
                      "nastepnyFalse": wynik.polecenia[index].nastepnyFalse
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

HistoriaPolecen(polecenieid: number, polecenieText: string, osoba: number, osobaText: string, czaswykonania: string, terminal: string)
{
  this.zapisz_historia_polecen(5, polecenieid, polecenieText, osoba, osobaText, czaswykonania, terminal)  
}

zapisz_historia_polecen(licznik: number, polecenieid: number, polecenieText: string , osoba: number, osobaText: string, czaswykonania: string, terminal: string)
{
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": "historia", "osoba": osoba, "osobaText": osobaText, "polecenieText": polecenieText, "polecenieid": polecenieid, "czaswykonania": czaswykonania, "terminal": terminal})  
  
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'historia/', data, httpOptions).subscribe( 
        data =>  {
          console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  //ok
                }
                else
                {
                  setTimeout(() => {this.zapisz_historia_polecen(licznik, polecenieid, polecenieText, osoba, osobaText, czaswykonania, terminal )}, 500) 
                }
                  },
        error => {
          console.log(error)
          setTimeout(() => {this.zapisz_historia_polecen(licznik, polecenieid, polecenieText, osoba, osobaText, czaswykonania, terminal)}, 1000) 
                }
                )      
    }
    else
    {
      //zaniechaj
    }
  }

/* (start) działania*/
getDzialania (){ return this.dzialania; }

sprawdzDzialania(dzialanie: string)
{
  let wynik = <Polecenia>{"id": 0,"nazwa": dzialanie, "czas": 2000, "prefix": "", "komunikat": "Wystąpił błąd wykonania", "sufix": "", "dzialanie":"komunikat", "autoryzacja": false, "polecenie": true, "nastepnyTrue": "end", "nastepnyFalse": "end"}
  for (let index = 0; index < this.dzialania.length; index++) 
  {
    //console.log(this.dzialania[index].nazwa,' == ',dzialanie)
    if ( this.dzialania[index].nazwa == dzialanie )
    {
      //console.log('jest')
       wynik = {"id": this.dzialania[index].id,
                "nazwa": this.dzialania[index].nazwa,
                "czas": this.dzialania[index].czas,
                "prefix": this.dzialania[index].prefix, 
                "komunikat": this.dzialania[index].komunikat, 
                "sufix": this.dzialania[index].sufix, 
                "dzialanie": this.dzialania[index].dzialanie,
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
    this.dzialania = [{"id":0,"nazwa": "bad", "czas": 2000, "prefix": "", "komunikat": "Nieznane polecenie", "sufix": "", "dzialanie":"komunikat", "polecenie": true, "nastepnyTrue": "end", "nastepnyFalse": "end"}];
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
             //console.log('wynik ',wynik)  
              for (let index = 0; index < wynik.polecenia.length; index++) 
              {
              this.dzialania = [...this.dzialania, {
                      "id": wynik.polecenia[index].id,
                      "nazwa": wynik.polecenia[index].nazwa, 
                      "czas": wynik.polecenia[index].czas, 
                      "prefix": wynik.polecenia[index].prefix, 
                      "komunikat": wynik.polecenia[index].komunikat, 
                      "sufix": wynik.polecenia[index].sufix, 
                      "dzialanie": wynik.polecenia[index].dzialanie,
                      "polecenie": wynik.polecenia[index].polecenie,
                      "nastepnyTrue": wynik.polecenia[index].nastepnyTrue,
                      "nastepnyFalse": wynik.polecenia[index].nastepnyFalse
                      }]
              } 
            //  console.log(this.dzialania) 
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
