
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class ZespolyService {

//private zespoly: Zespol[] = [];  
//private zespol: Zespol[] = [];  


constructor(private http: HttpClient, private komunikacja: KomunikacjaService)
{ 
  
}


//getZespol() { return this.zespol; }
//getZespoly() { return this.zespoly; }


WczytajZespoly(stan: number, dowykonania: any, bufor: any, czas: string)
{
    //this.zespoly = [];
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
                //this.zespoly =  wynik.zespoly
                this.OdczytajZespoly.next({"nastepny":dowykonania.nastepnyTrue, "komunikat": wynik.error, "data": wynik.zespoly})
               
              }
              else
              {
                this.OdczytajZespoly.next({"nastepny":dowykonania.nastepnyFalse, "komunikat": wynik.error, "data": wynik.zespoly})
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



WczytajZespol(stan: number, dowykonania: any, bufor: any, czas: string, rodzaj: string)
{
    //console.log()
    //this.zespol = [];
    this.odczytaj_zespol(5, stan, dowykonania, bufor[0], bufor[1], '', czas, rodzaj);
}

private OdczytajZespol = new Subject<any>();
OdczytajZespol$ = this.OdczytajZespol.asObservable()
private odczytaj_zespol(licznik: number, stan: number, dowykonania: any, modul: string, zespol: string, powod: string, czas: string, rodzaj: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "stan": stan, "modul": modul, "zespol": zespol, "czas": czas, "rodzaj": rodzaj})  

if (licznik > 0 )
  {
    --licznik;
    this.http.post(this.komunikacja.getURL() + 'zespol/', data, httpOptions).subscribe( 
      data =>  {
        console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
               // this.zespol =  wynik.zespol
                this.OdczytajZespol.next({"nastepny":dowykonania.nastepnyTrue, "komunikat": wynik.error, "data": wynik.zespol})
              }
              else
              {
                this.OdczytajZespol.next({"nastepny":dowykonania.nastepnyFalse, "komunikat": wynik.error, "data": wynik.zespol})
              }
                },
      error => {
        console.log(error)
                setTimeout(() => {this.odczytaj_zespol(licznik, stan, dowykonania, modul, zespol, '', czas, rodzaj)}, 1000) 
              }
              )      
  }
  else
  {
    this.OdczytajZespol.next({"nastepny":dowykonania.nastepnyFalse, "komunikat": powod})
  }
}


}
