import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notatka } from './definicje';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class NotatkiService {

  private notatki: Notatka[] = [];  
  private notatkiStan: boolean

  constructor(private http: HttpClient, private komunikacja: KomunikacjaService)
  { 
  this.notatkiStan = false;
  }
  
  
  getNotatki() { return this.notatki; }
  getNotatkiStan() { return this.notatkiStan; } 
  
  sprawdzNotatki(polecenie: string)
  {
    let wynik = <Notatka> {"id": 0, "tytul": '', "czasU": "", "czasA": "", "wlasciciel": false, "wlascicielText": 'dedal', "stan": false, "stanText": ''}
    for (let index = 0; index < this.notatki.length; index++) 
    {
      if ( this.notatki[index].tytul == polecenie)
      {
         wynik = {"id": this.notatki[index].id,
                  "czasU": this.notatki[index].czasU,
                  "czasA": this.notatki[index].czasA,
                  "tytul": this.notatki[index].tytul, 
                  "wlasciciel": this.notatki[index].wlasciciel,
                  "wlascicielText": this.notatki[index].wlascicielText,
                  "stan": this.notatki[index].stan,
                  "stanText": this.notatki[index].stanText
           } 
         //this.poleceniePomoc();        
         break;        
      }       
    }
  return wynik  
  }
  
  Wczytajnotatki(stan: number, dowykonania: any)
  {
      this.notatkiStan = false;
      this.notatki = [];
      this.odczytaj_notatki(5, stan, dowykonania);
  }
  
  private OdczytajNotatki = new Subject<any>();
  OdczytajNotatki$ = this.OdczytajNotatki.asObservable()
  private odczytaj_notatki(licznik: number, stan: number, dowykonania: any)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({ "stan": stan})  
  
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'notatki/', data, httpOptions).subscribe( 
        data =>  {
          //console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  for (let index = 0; index < wynik.notatki.length; index++) 
                  {
                    
                        this.notatki = [...this.notatki, {
                          "id": wynik.notatki[index].id,
                          "czasU": wynik.notatki[index].czasU,
                          "czasA": wynik.notatki[index].czasA,
                          "tytul": wynik.notatki[index].tytul, 
                          "wlasciciel": wynik.notatki[index].wlasciciel,
                          "wlascicielText": wynik.notatki[index].wlascicielText,
                          "stan": wynik.notatki[index].stan,
                          "stanText": wynik.notatki[index].stanText
                          }]
                  }  
                  this.notatkiStan = true;
                  this.OdczytajNotatki.next(dowykonania.nastepnyTrue)
            //console.log(this.notatki)
                }
                else
                {
                  setTimeout(() => {this.odczytaj_notatki(licznik, stan, dowykonania)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  setTimeout(() => {this.odczytaj_notatki(licznik, stan, dowykonania)}, 1000) 
                }
                )      
    }
    else
    {
      this.OdczytajNotatki.next(dowykonania.nastepnyFalse)
    }
  }

}
