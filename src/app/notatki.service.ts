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
                  if (wynik.stan == true)
                  {  
                  for (let index = 0; index < wynik.notatki.length; index++) 
                  {
                    
                        this.notatki = [...this.notatki, {
                          "id": wynik.notatki[index].id,
                          "czas": wynik.notatki[index].czasU,
                          "tytul": wynik.notatki[index].tytul, 
                          "wlascicielText": wynik.notatki[index].wlascicielText,
                          "stanText": wynik.notatki[index].stanText
                          }]
                  }  
                  this.notatkiStan = true;
                  this.OdczytajNotatki.next({"nastepny": dowykonania.nastepnyTrue, "komunikat": wynik.error})
            //console.log(this.notatki)
                  }
                  else
                  {//stan false
                    this.notatkiStan = true;
                    this.OdczytajNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                  }
                }
                else
                {//wynik false
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
      this.OdczytajNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": "problem z odczytem"})
    }
  }





  private OdczytajNotatkiTresc = new Subject<any>();
  OdczytajNotatkiTresc$ = this.OdczytajNotatkiTresc.asObservable()
  private odczytaj_notatki_tresc(licznik: number, stan: number, dowykonania: any)
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
      this.http.post(this.komunikacja.getURL() + 'notatka/', data, httpOptions).subscribe( 
        data =>  {
          //console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  for (let index = 0; index < wynik.notatki.length; index++) 
                  {
                    
                        this.notatki = [...this.notatki, {
                          "id": wynik.notatki[index].id,
                          "czas": wynik.notatki[index].czasU,
                          "tytul": wynik.notatki[index].tytul, 
                          "wlascicielText": wynik.notatki[index].wlascicielText,
                          "stanText": wynik.notatki[index].stanText
                          }]
                  }  
                  //this.notatkiStan = true;
                  this.OdczytajNotatkiTresc.next(dowykonania.nastepnyTrue)
            //console.log(this.notatki)
                }
                else
                {
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, dowykonania)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, dowykonania)}, 1000) 
                }
                )      
    }
    else
    {
      this.OdczytajNotatkiTresc.next(dowykonania.nastepnyFalse)
    }
  }



}
