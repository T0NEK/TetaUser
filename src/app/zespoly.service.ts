
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Zespol } from './definicje'
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class ZespolyService {

private zespoly: Zespol[] = [];  
private zespol: Zespol[] = [];  


constructor(private http: HttpClient, private komunikacja: KomunikacjaService)
{ 
  
}


getZespol() { return this.zespol; }
getZespoly() { return this.zespoly; }


WczytajZespoly(stan: number, dowykonania: any, bufor: any, czas: string)
{
    this.zespoly = [];
    this.odczytaj_zespoly(5, stan, dowykonania, bufor[0], '', czas);
}

private OdczytajZespoly = new Subject<any>();
OdczytajZespoly$ = this.OdczytajZespoly.asObservable()
private odczytaj_zespoly(licznik: number, stan: number, dowykonania: any, modul: string, powod: string, czas: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "stan": stan, "modul": modul, "czas": czas})  

if (licznik > 0 )
  {
    --licznik;
    this.http.post(this.komunikacja.getURL() + 'zespoly/', data, httpOptions).subscribe( 
      data =>  {
        console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                if (wynik.stan == true)
                {  
                this.zespoly =  wynik.zespoly
                this.OdczytajZespoly.next({"nastepny":dowykonania.nastepnyTrue, "komunikat": wynik.error})
                }
                else
                {//stan false
                  this.OdczytajZespoly.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                }
              }
              else
              {
                setTimeout(() => {this.odczytaj_zespoly(licznik, stan, dowykonania, modul, wynik.error, czas)}, 1000) 
              }
                },
      error => {
        console.log(error)
                setTimeout(() => {this.odczytaj_zespoly(licznik, stan, dowykonania, modul, '', czas)}, 1000) 
              }
              )      
  }
  else
  {
    this.OdczytajZespoly.next({"nastepny":dowykonania.nastepnyFalse, "komunikat": powod})
  }
}



WczytajZespol(stan: number, dowykonania: any, bufor: any, czas: string)
{
    this.zespol = [];
    this.odczytaj_zespol(5, stan, dowykonania, bufor[0], bufor[1], '', czas);
}

private OdczytajZespol = new Subject<any>();
OdczytajZespol$ = this.OdczytajZespol.asObservable()
private odczytaj_zespol(licznik: number, stan: number, dowykonania: any, modul: string, zespol: string, powod: string, czas: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "stan": stan, "modul": modul, "zespol": zespol, "czas": czas})  

if (licznik > 0 )
  {
    --licznik;
    this.http.post(this.komunikacja.getURL() + 'zespol/', data, httpOptions).subscribe( 
      data =>  {
        console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                if (wynik.stan == true)
                {  
                this.zespol =  wynik.zespol
                this.OdczytajZespol.next({"nastepny":dowykonania.nastepnyTrue, "komunikat": wynik.error})
                }
                else
                {//stan false
                  this.OdczytajZespol.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                }
              }
              else
              {
                setTimeout(() => {this.odczytaj_zespol(licznik, stan, dowykonania, modul, zespol, wynik.error, czas)}, 1000) 
              }
                },
      error => {
        console.log(error)
                setTimeout(() => {this.odczytaj_zespol(licznik, stan, dowykonania, modul, zespol, '', czas)}, 1000) 
              }
              )      
  }
  else
  {
    this.OdczytajZespol.next({"nastepny":dowykonania.nastepnyFalse, "komunikat": powod})
  }
}


}
