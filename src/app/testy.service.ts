import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Zespol } from './definicje'
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class TestyService {



constructor(private http: HttpClient, private komunikacja: KomunikacjaService)
{ 
  
}



ZapiszTest(osoba: number, modul: number, zespol: number, czasstart: string, czasend: string, numer: number)
{
    console.log(osoba, modul, zespol, czasstart, czasend, numer)
    this.zapisz_test(5, osoba, modul, zespol, czasstart, czasend, numer, '');
}

private ZapiszTesty = new Subject<any>();
ZapiszTesty$ = this.ZapiszTesty.asObservable()
private zapisz_test(licznik: number, osoba: number, modul: number, zespol: number, czasstart: string, czasend: string, numer: number, powod: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "osoba": osoba, "modul": modul, "zespol": zespol, "czasstart": czasstart, "czasend": czasend})  

if (licznik > 0 )
  {
    --licznik;
    this.http.post(this.komunikacja.getURL() + 'testy/', data, httpOptions).subscribe( 
      data =>  {
        console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                this.ZapiszTesty.next({"wynik": wynik.wynik, "stan": wynik.stan, "stanNr": wynik.stanNr, "stanText": wynik.stanText, "czasend": wynik.czasend, "numer": numer})
              }
              else
              {
                setTimeout(() => {this.zapisz_test(licznik, osoba, modul, zespol, czasstart, czasend, numer, wynik.error)}, 500) 
              }
                },
      error => {
        console.log(error)
                setTimeout(() => {this.zapisz_test(licznik, osoba, modul, zespol, czasstart, czasend, numer, error.error)}, 1000) 
              }
              )      
  }
  else
  {
    this.ZapiszTesty.next({"wynik": false, "stan": false, "komunikat": powod, "numer": numer})
  }
}



}
