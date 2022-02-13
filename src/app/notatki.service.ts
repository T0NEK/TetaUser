import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notatka, StanNotatka, Tresc } from './definicje';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class NotatkiService {

  private notatki: Notatka[] = [];  
  private notatkiStan: boolean
  private notatka : Tresc[] = [];
  private notatkaStan: StanNotatka;

  constructor(private http: HttpClient, private komunikacja: KomunikacjaService)
  { 
  this.notatkiStan = false;
  this.notatkaStan = {"wczytana": false, "edycja": false};
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
    
  var data = JSON.stringify({"kierunek": "get", "stan": stan})  
  
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
                          "identyfikator": wynik.notatki[index].identyfikator,
                          "czas": wynik.notatki[index].czas,
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



  Zapisznotatki(stan: number, tytul: string, dowykonania: any)
  {
      this.zapisz_notatki(5, stan, tytul, dowykonania);
  }
  
  private ZapiszNotatki = new Subject<any>();
  ZapiszNotatki$ = this.ZapiszNotatki.asObservable()
  private zapisz_notatki(licznik: number, stan: number, tytul: string, dowykonania: any)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": "set", "stan": stan, "tytul": tytul})  
  
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
                          "identyfikator": wynik.notatki[index].identyfikator,
                          "czas": wynik.notatki[index].czas,
                          "tytul": wynik.notatki[index].tytul, 
                          "wlascicielText": wynik.notatki[index].wlascicielText,
                          "stanText": wynik.notatki[index].stanText
                          }]
                  }  
                  this.ZapiszNotatki.next({"nastepny": dowykonania.nastepnyTrue, "komunikat": wynik.error})
            //console.log(this.notatki)
                  }
                  else
                  {//stan false
                    this.ZapiszNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                  }
                }
                else
                {//wynik false
                  setTimeout(() => {this.zapisz_notatki(licznik, stan, tytul, dowykonania)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  setTimeout(() => {this.zapisz_notatki(licznik, stan, tytul, dowykonania)}, 1000) 
                }
                )      
    }
    else
    {
      this.OdczytajNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": "problem z odczytem"})
    }
  }






/*    TRESC      */


  getNotatkaTresc() { return this.notatki; }

  getNotatkaWlasciciel()
  {
    return this.notatka[0]['wlascicielText']
  }

  getNotatkaWczytana()
  { return this.notatkaStan.wczytana; }
  
  getNotatkaEdycja()
  { return this.notatkaStan.edycja; }
    
  getNotatkaEdytuj()
  { return this.notatka[0].edycja; }

  private NotatkaEdytuj = new Subject<any>();
  NotatkaEdytuj$ = this.NotatkaEdytuj.asObservable()
  setNotatkaEdytujOn()
  { this.notatkaStan.edycja = true; this.NotatkaEdytuj.next(true) }
  setNotatkaEdytujOff()
  { this.notatkaStan.edycja = false; this.NotatkaEdytuj.next(false) }


  WczytajnotatkiTresc(stan: number, dowykonania: any, notatka: string)
  {
      this.notatka = [];
      this.notatkaStan = {"wczytana": false, "edycja": false};
      this.odczytaj_notatki_tresc(5, stan, dowykonania, notatka);
  }

  private OdczytajTresc = new Subject<any>();
  OdczytajTresc$ = this.OdczytajTresc.asObservable()
  private OdczytajNotatkiTresc = new Subject<any>();
  OdczytajNotatkiTresc$ = this.OdczytajNotatkiTresc.asObservable()
  private odczytaj_notatki_tresc(licznik: number, stan: number, dowykonania: any, notatka: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": "get",  "stan": stan, "notatka": notatka})  
  
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'notatka/', data, httpOptions).subscribe( 
        data =>  {
          console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  if (wynik.stan == true)
                  {  
                  for (let index = 0; index < wynik.notatki.length; index++) 
                  {
                    
                        this.notatka = [...this.notatka, {
                          "id": wynik.notatki[index].id,
                          "identyfikator": wynik.notatki[index].identyfikator,
                          "tytul": wynik.notatki[index].tytul, 
                          "wersja": wynik.notatki[index].wersja, 
                          "edycja": wynik.notatki[index].edycja, 
                          "wlascicielText": wynik.notatki[index].wlascicielText,
                          "stan": wynik.notatki[index].stan,
                          "stanText": wynik.notatki[index].stanText,
                          "czas": wynik.notatki[index].czas,
                          "tresc": wynik.notatki[index].tresc,
                          }]
                  }  
                  //this.notatkiStan = true;
                  this.notatkaStan.wczytana = true;
                  this.OdczytajNotatkiTresc.next({"nastepny": dowykonania.nastepnyTrue, "komunikat": wynik.error})
                  this.OdczytajTresc.next({"notatka": this.notatka, "wersja": 0})
//console.log('notatka odczyt:',this.notatka)
                  }
                  else
                  {//stan false
                    this.OdczytajNotatkiTresc.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                  }
                }
                else
                {
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, dowykonania,notatka)}, 1000) 
                }
                  },
        error => {
          console.log(error)
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, dowykonania,notatka)}, 1000) 
                }
                )      
    }
    else
    {
      this.OdczytajNotatkiTresc.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": "problem z odczytem"})
    }
  }



}
