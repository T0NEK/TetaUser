import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CzasService } from './czas.service';
import { Notatka, StanNotatka, Tresc } from './definicje';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class NotatkiService {

  private notatki: Notatka[] = [];  
  //private notatkiStan: boolean
  private notatka : Tresc[] = [];
  private notatkaStan: StanNotatka;

  constructor(private http: HttpClient, private komunikacja: KomunikacjaService)
  { 
  //this.notatkiStan = false;
  this.notatkaStan = {"wczytana": false, "edycja": false, "notatka": {"id":0, "identyfikator": "", "czas": "", "stan": false, "stanText": "", "tytul": "", "wlasciciel":0, "wlascicielText":""}, "wersja": 0, "zmiany": false, "tresc": ""};
  }
  
  
  getNotatki() { return this.notatki; }

  //getNotatkiStan() { return this.notatkiStan; } 
/*
  getNotatkaId(identyfikator: string) 
  {
    console.log('identyfikator ', identyfikator)
    for (let index = 0; index < this.notatki.length; index++) 
    {
      console.log('this.notatki[index].identyfikator  ', this.notatki[index].identyfikator)
    if (this.notatki[index].identyfikator == identyfikator)
    {
      this.notatkaStan.notatka = this.notatki[index].id;
      break;
    }
    }
  return this.notatkaStan.notatka;    
  }
*/
  
WczytajnotatkiDostep(stan: number, dowykonania: any, id: string)
  {
      //this.notatkiStan = false;
      this.notatki = [];
      this.odczytaj_notatki(5, stan, id, dowykonania, "dos");
  }

Wczytajnotatki(stan: number, dowykonania: any)
  {
      //this.notatkiStan = false;
      this.notatki = [];
      this.odczytaj_notatki(5, stan, '', dowykonania, "get");
  }
  
  private OdczytajNotatki = new Subject<any>();
  OdczytajNotatki$ = this.OdczytajNotatki.asObservable()
  private odczytaj_notatki(licznik: number, stan: number, id: string, dowykonania: any, get: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": get, "stan": stan, "id": id })  
  
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
                          "wlasciciel": wynik.notatki[index].wlasciciel,
                          "wlascicielText": wynik.notatki[index].wlascicielText,
                          "stan": wynik.notatki[index].stan,
                          "stanText": wynik.notatki[index].stanText
                          }]
                  }  
                  //this.notatkiStan = true;
                  this.OdczytajNotatki.next({"nastepny": dowykonania.nastepnyTrue, "komunikat": wynik.error})
            //console.log(this.notatki)
                  }
                  else
                  {//stan false
                    //this.notatkiStan = true;
                    this.OdczytajNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                  }
                }
                else
                {//wynik false
                  setTimeout(() => {this.odczytaj_notatki(licznik, stan, id, dowykonania, get)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  setTimeout(() => {this.odczytaj_notatki(licznik, stan, id, dowykonania, get)}, 1000) 
                }
                )      
    }
    else
    {
      this.OdczytajNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": "problem z odczytem"})
    }
  }

  Udostepnijnotatki(stan: number, identyfikator: string, osoba: string[], dowykonania: any)
  {
      this.zapisz_notatki(5, stan, identyfikator, dowykonania, "udo", osoba, "");
  }

  Usunnotatki(stan: number, identyfikator: string, dowykonania: any)
  {
      this.zapisz_notatki(5, stan, identyfikator, dowykonania, "del", [], "");
  }

  Zapisznotatki(stan: number, tytul: string, dowykonania: any, czas: string)
  {
      this.zapisz_notatki(5, stan, tytul, dowykonania, "set", [], czas);
  }
  
  private ZapiszNotatki = new Subject<any>();
  ZapiszNotatki$ = this.ZapiszNotatki.asObservable()
  private zapisz_notatki(licznik: number, stan: number, tytul: string, dowykonania: any, del: string, osoba: string[], czas: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": del, "stan": stan, "tytul": tytul, "imie": osoba[0], "nazwisko": osoba[1], "czas": czas})  
  console.log(czas)
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'notatki/', data, httpOptions).subscribe( 
        data =>  {
          console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  if (wynik.stan == true)
                  {  
                    
                  this.ZapiszNotatki.next({"nastepny": dowykonania.nastepnyTrue, "komunikat": wynik.error})
            //console.log(this.notatki)
                  }
                  else
                  {//stan false
                    this.setNotatkaClear();
                    this.ZapiszNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                  }
                }
                else
                {//wynik false
                  setTimeout(() => {this.zapisz_notatki(licznik, stan, tytul, dowykonania, del, osoba, czas)}, 1000) 
                }
                  },
        error => {
          console.log(error)
                  setTimeout(() => {this.zapisz_notatki(licznik, stan, tytul, dowykonania, del, osoba, czas)}, 1000) 
                }
                )      
    }
    else
    {
      this.ZapiszNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": "problem z odczytem"})
    }
  }






/*    TRESC      */

  getNotatkaPozycja(wersja: number)  //pozycja w tabeli wersji notatek
  { let wynik = 0; for (let index = 0; index < this.notatka.length; index++) { if (this.notatka[index].wersja == wersja) { wynik =  index; break; }} return wynik;  }
  getNotatkaTresc() { return this.notatka[this.getNotatkaPozycja(this.getNotatkaWersja())].tresc; } //treść aktualnej wersji notatki
  getNotatkaTrescNew() { return this.notatkaStan.tresc; } //treść aktualnej wersji notatki
  setNotatkaTrescNew(notatka: string) { this.notatkaStan.tresc = notatka; } // treść edytowanej notatki
  getNotatkaWlasciciel() { return this.notatkaStan.notatka.wlascicielText; } //właściciel notatki
  getNotatkaWlascicielId() { return this.notatkaStan.notatka.wlasciciel; } // id właściciela notatki
  getNotatkaIdentyfikator() { return this.notatkaStan.notatka.identyfikator; } //identyfikator notatki
  getNotatkaTytul() { return this.notatkaStan.notatka.tytul; } //tytuł notatki
  getNotatkaCzyWczytana() { return this.notatkaStan.wczytana; } //czy wczytana
  getNotatkaCzyEdycja() { return this.notatkaStan.edycja; } //czy w edycji
  getNotatkaCzyDostepna(numer: number) { return (this.notatka[numer].stan ? true : this.notatka[numer].stanText); } //czy dostępna
  getNotatkaWczytanaId() { return this.notatkaStan.notatka.id; } //id wczytanej notatki
  getNotatkaWersja() { return this.notatkaStan.wersja; } //wersja wczytanej notatki
  getNotatkaWersjaMax() { return this.notatka.length -1; } //wersja wczytanej notatki
  getNotatkaZakres(numer: number) { return ( numer > this.getNotatkaWersjaMax() ? false : true);} //czy numer jest w zakresie notatek
  getNotatkaZmiana() { return this.notatkaStan.zmiany; } //czy notatka edytowana - zmieniona
  setNotatkaZmiana(stan: boolean) { this.notatkaStan.zmiany = stan } //ustawienie czy notatka edytowana - zmieniona
  getNotatkaMozliwoscEdycji(zalogowany: number)  { return ((this.notatkaStan.notatka.stan)&&(this.getNotatkaWlascicielId() == zalogowany )); } //możliwość edycji notatki
  setNotatkaClear() { 
                      this.notatka = [];
                      this.notatkaStan = {"wczytana": false, "edycja": false, "notatka": {"id":0, "identyfikator": "", "czas": "", "stan": false, "stanText": "", "tytul": "", "wlasciciel": 0, "wlascicielText":""}, "wersja": 0, "zmiany": false, "tresc": ""};
                      this.OdczytajTresc.next({"notatka": this.notatka, "wersja": 0 })
                    }


  private NotatkaEdytuj = new Subject<any>();
  NotatkaEdytuj$ = this.NotatkaEdytuj.asObservable()
  setNotatkaEdytujOn()
  { this.notatkaStan.edycja = true; this.NotatkaEdytuj.next(true) }
  setNotatkaEdytujOff()
  { this.notatkaStan.edycja = false; this.NotatkaEdytuj.next(false) }

  setNotatkaWersja(wersja: number)
  {
    console.log('wersja',wersja)
    this.notatkaStan.wersja = wersja;
    this.notatkaStan.zmiany = false;
    this.notatkaStan.tresc = "";
    this.OdczytajTresc.next({"notatka": this.notatka, "wersja": wersja })  
  }



  WczytajnotatkiTresc(stan: number, dowykonania: any, notatka: string)
  {
    //console.log('identyfikator: ', notatka)
    //console.log('id: ', this.getNotatkaId(notatka))
    //console.log('notatki', this.getNotatki())
      this.notatka = [];
      this.notatkaStan = {"wczytana": false, "edycja": false, "notatka": {"id":0, "identyfikator": "", "czas": "", "stan": false, "stanText": "", "tytul": "", "wlasciciel": 0, "wlascicielText":""}, "wersja": 0, "zmiany": false, "tresc": ""};
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
//console.log('data WNT',data)
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'notatka/', data, httpOptions).subscribe( 
        data =>  {
          //console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  if (wynik.stan == true)
                  {  
                  for (let index = 0; index < wynik.notatki.length; index++) 
                  {
                        this.notatka = [...this.notatka, {
                          "id": wynik.notatki[index].id,
                          "wersja": wynik.notatki[index].wersja, 
                          "stan": wynik.notatki[index].stan,
                          "stanText": wynik.notatki[index].stanText,
                          "czas": wynik.notatki[index].czas,
                          "tresc": wynik.notatki[index].tresc,
                          }]
                  }  
                  //this.notatkiStan = true;
                  this.notatkaStan = {"wczytana": true, "edycja": false, "notatka": {"id": wynik.id, "identyfikator": wynik.identyfikator, "czas": wynik.czas, "stan": wynik.stan, "stanText": wynik.stanText, "tytul": wynik.tytul, "wlasciciel": wynik.wlasciciel, "wlascicielText": wynik.wlascicielText}, "wersja": wynik.wersja, "zmiany": false, "tresc": ""};
                  this.OdczytajNotatkiTresc.next({"nastepny": dowykonania.nastepnyTrue, "komunikat": wynik.error})
                  this.OdczytajTresc.next({"notatka": this.notatka, "wersja": wynik.wersja })
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
          //console.log(error)
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, dowykonania,notatka)}, 1000) 
                }
                )      
    }
    else
    {
      this.OdczytajNotatkiTresc.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": "problem z odczytem"})
    }
  }


  ZapiszTrescnotatki(dowykonania: any, czas: string)
  {
    this.zapisz_tresc_notatki(5, this.getNotatkaWczytanaId(), this.getNotatkaWersjaMax() + 1, this.getNotatkaTrescNew(), dowykonania, czas);
  }
  
  private ZapiszTrescNotatki = new Subject<any>();
  ZapiszTrescNotatki$ = this.ZapiszTrescNotatki.asObservable()
  private zapisz_tresc_notatki(licznik: number, id: number, wersja: number, notatka: string, dowykonania: any, czas: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": "set", "stan": id, "wersja": wersja, "notatka": notatka, "czas": czas})  
  
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
                    this.notatka = [...this.notatka, {
                      "id": wynik.id,
                      "wersja": wynik.wersja, 
                      "stan": wynik.stan,
                      "stanText": wynik.stanText,
                      "czas": wynik.czas,
                      "tresc": wynik.tresc
                      }]
                    this.notatkaStan.wersja = wynik.wersja;
                    this.notatkaStan.zmiany = false;
                    this.notatkaStan.tresc = "";
                    this.OdczytajTresc.next({"notatka": this.notatka, "wersja": wynik.wersja })  
                    this.ZapiszTrescNotatki.next({"nastepny": dowykonania.nastepnyTrue, "komunikat": wynik.error})
            //console.log(this.notatki)
                  }
                  else
                  {//stan false
                    this.ZapiszTrescNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                  }
                }
                else
                {//wynik false
                  setTimeout(() => {this.zapisz_tresc_notatki(licznik, id, wersja, notatka, dowykonania, czas)}, 1000) 
                }
                  },
        error => {
          console.log(error)
                  setTimeout(() => {this.zapisz_tresc_notatki(licznik, id, wersja, notatka, dowykonania, czas)}, 1000) 
                }
                )      
    }
    else
    {
      this.ZapiszTrescNotatki.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": "problem z odczytem"})
    }
  }



}
