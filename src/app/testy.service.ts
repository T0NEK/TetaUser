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



ZapiszTest(osoba: number, modul: number, zespol: number, czasstart: string, czasend: string, numer: number, nrtestu: number)
{
    //console.log(osoba, modul, zespol, czasstart, czasend, numer)
    this.zapisz_test(5, osoba, modul, zespol, czasstart, czasend, numer, nrtestu, '');
}

private ZapiszTesty = new Subject<any>();
ZapiszTesty$ = this.ZapiszTesty.asObservable()
private zapisz_test(licznik: number, osoba: number, modul: number, zespol: number, czasstart: string, czasend: string, numer: number, nrtestu: number, powod: string)
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
                this.ZapiszTesty.next({"wynik": wynik.wynik, "stan": wynik.stan, "uszkodzenia": wynik.uszkodzenia, "czasend": wynik.czasend, "ilosc": wynik.ilosc, "numer": numer, "nrtestu": nrtestu})
              }
              else
              {
                setTimeout(() => {this.zapisz_test(licznik, osoba, modul, zespol, czasstart, czasend, numer, nrtestu, wynik.error)}, 500) 
              }
                },
      error => {
        console.log(error)
                setTimeout(() => {this.zapisz_test(licznik, osoba, modul, zespol, czasstart, czasend, numer, nrtestu, error.error)}, 1000) 
              }
              )      
  }
  else
  {
    this.ZapiszTesty.next({"wynik": false, "stan": false, "komunikat": powod, "numer": numer, "nrtestu": nrtestu})
  }
}


ResetStart(osoba: number, modul: number, zespol: number, start: number, dane: any)
{
    //console.log(osoba, modul, zespol, czasstart, czasend, numer)
    this.wykonaj_reset(5, osoba, modul, zespol, 'start', '', '', start, dane);
}

ResetStop(osoba: number, modul: number, zespol: number, resetkod: string)
{
    //console.log(osoba, modul, zespol, czasstart, czasend, numer)
    this.wykonaj_reset(5, osoba, modul, zespol, 'end', resetkod, '', 0, '');
}

private WykonajReset = new Subject<any>();
WykonajReset$ = this.WykonajReset.asObservable()
private wykonaj_reset(licznik: number, osoba: number, modul: number, zespol: number, stan: string, resetkod: string, powod: string, start: number, dane: any)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "osoba": osoba, "modul": modul, "zespol": zespol, "stan": stan, "resetkod": resetkod})  

if (licznik > 0 )
  {
    --licznik;
    this.http.post(this.komunikacja.getURL() + 'reset/', data, httpOptions).subscribe( 
      data =>  {
        console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                this.WykonajReset.next({"wynik": wynik.wynik, "stan": wynik.stan, "resetkod": wynik.resetkod, "komunikat": wynik.error, "kierunek": stan, "start": start, "dane": dane})
              }
              else
              {
                setTimeout(() => {this.wykonaj_reset(licznik, osoba, modul, zespol, stan, resetkod, wynik.error, start, dane)}, 500) 
              }
                },
      error => {
        console.log(error)
                setTimeout(() => {this.wykonaj_reset(licznik, osoba, modul, zespol, stan, resetkod, error.error, start, dane)}, 1000) 
              }
              )      
  }
  else
  {
    this.WykonajReset.next({"wynik": false, "stan": false, "komunikat": powod, "kierunek": stan, "start": start, "dane": dane})
  }
}


NaprawaStart(osoba: number, modul: number, zespol: number, start: number, dane: any)
{
    //console.log(osoba, modul, zespol, czasstart, czasend, numer)
    this.wykonaj_naprawa(5, osoba, modul, zespol, 'start', '', '', start, dane);
}

NaprawaStop(osoba: number, modul: number, zespol: number, naprawakod: string)
{
    //console.log(osoba, modul, zespol, czasstart, czasend, numer)
    this.wykonaj_naprawa(5, osoba, modul, zespol, 'end', naprawakod, '', 0, '');
}

private WykonajNaprawa = new Subject<any>();
WykonajNaprawa$ = this.WykonajNaprawa.asObservable()
private wykonaj_naprawa(licznik: number, osoba: number, modul: number, zespol: number, stan: string, naprawakod: string, powod: string, start: number, dane: any)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "osoba": osoba, "modul": modul, "zespol": zespol, "stan": stan, "naprawakod": naprawakod})  

if (licznik > 0 )
  {
    --licznik;
    this.http.post(this.komunikacja.getURL() + 'naprawa/', data, httpOptions).subscribe( 
      data =>  {
        console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                this.WykonajNaprawa.next({"wynik": wynik.wynik, "stan": wynik.stan, "naprawakod": wynik.naprawakod, "komunikat": wynik.error, "kierunek": stan, "start": start, "dane": dane})
              }
              else
              {
                setTimeout(() => {this.wykonaj_naprawa(licznik, osoba, modul, zespol, stan, naprawakod, wynik.error, start, dane)}, 500) 
              }
                },
      error => {
        console.log(error)
                setTimeout(() => {this.wykonaj_naprawa(licznik, osoba, modul, zespol, stan, naprawakod, error.error, start, dane)}, 1000) 
              }
              )      
  }
  else
  {
    this.WykonajNaprawa.next({"wynik": false, "stan": false, "komunikat": powod, "kierunek": stan, "start": start, "dane": dane})
  }
}



}
