import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Polecenia } from './definicje';
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
             //console.log('wynik ',wynik)  
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
