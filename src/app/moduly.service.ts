import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Modul } from './definicje'
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class ModulyService {

private moduly: Modul[] = [];  
private modulyStan: boolean

constructor(private http: HttpClient, private komunikacja: KomunikacjaService)
{ 
this.modulyStan = false;
}


getModuly() { return this.moduly; }
getModulyStan() { return this.modulyStan; } 


Wczytajmoduly(stan: number, dowykonania: any, czas: string)
{
    this.modulyStan = false;
    this.moduly = [];
    this.odczytaj_moduly(5, stan, dowykonania,'',czas);
}

private OdczytajModuly = new Subject<any>();
OdczytajModuly$ = this.OdczytajModuly.asObservable()
private odczytaj_moduly(licznik: number, stan: number, dowykonania: any, powod: string, czas: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "stan": stan, "czas": czas})  

if (licznik > 0 )
  {
    --licznik;
    this.http.post(this.komunikacja.getURL() + 'moduly/', data, httpOptions).subscribe( 
      data =>  {
        //console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                if (wynik.stan == true)
                {  
                this.moduly = wynik.moduly
                this.moduly.forEach(element => 
                  {
                  if (element.czasbadania)
                  {}
                  });  
                this.modulyStan = true;
                this.OdczytajModuly.next({"nastepny":dowykonania.nastepnyTrue, "komunikat": wynik.error})
        //console.log(this.moduly)
                }
                else
                {//stan false
                  this.modulyStan = false;
                  this.OdczytajModuly.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                }
              }
              else
              {
                setTimeout(() => {this.odczytaj_moduly(licznik, stan, dowykonania, wynik.error, czas)}, 1000) 
              }
                },
      error => {
        //console.log(error)
                setTimeout(() => {this.odczytaj_moduly(licznik, stan, dowykonania, error.error, czas)}, 1000) 
              }
              )      
  }
  else
  {
    this.OdczytajModuly.next({"nastepny":dowykonania.nastepnyFalse, "komunikat": powod})
  }
}

}
