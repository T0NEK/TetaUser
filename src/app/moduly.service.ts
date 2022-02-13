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

sprawdzModuly(polecenie: string)
{
  let wynik = <Modul> {"nazwa": '', "symbol": "", "producent": "", "opis": "", "id": 0}
  for (let index = 0; index < this.moduly.length; index++) 
  {
    if ( this.moduly[index].nazwa == polecenie )
    {
       wynik = {"nazwa": this.moduly[index].nazwa,
                "symbol": this.moduly[index].symbol, 
                "producent": this.moduly[index].producent,
                "opis": this.moduly[index].opis,
                "id": this.moduly[index].id,
         } 
       //this.poleceniePomoc();        
       break;        
    }       
  }
return wynik  
}

Wczytajmoduly(stan: number, dowykonania: any)
{
    this.modulyStan = false;
    this.moduly = [];
    this.odczytaj_moduly(5, stan, dowykonania);
}

private OdczytajModuly = new Subject<any>();
OdczytajModuly$ = this.OdczytajModuly.asObservable()
private odczytaj_moduly(licznik: number, stan: number, dowykonania: any)
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
    this.http.post(this.komunikacja.getURL() + 'moduly/', data, httpOptions).subscribe( 
      data =>  {
        //console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                if (wynik.stan == true)
                {  
                for (let index = 0; index < wynik.moduly.length; index++) 
                {
                  
                      this.moduly = [...this.moduly, {
                        "nazwa": wynik.moduly[index].nazwa, 
                        "symbol": wynik.moduly[index].symbol, 
                        "producent": wynik.moduly[index].producent,
                        "opis": wynik.moduly[index].opis,
                        "id": wynik.moduly[index].id
                        }]
                }  
                this.modulyStan = true;
                this.OdczytajModuly.next({"nastepny":dowykonania.nastepnyTrue, "komunikat": wynik.error})
        //console.log(this.moduly)
                }
                else
                {//stan false
                  this.modulyStan = true;
                  this.OdczytajModuly.next({"nastepny": dowykonania.nastepnyFalse, "komunikat": wynik.error})
                }
              }
              else
              {
                setTimeout(() => {this.odczytaj_moduly(licznik, stan, dowykonania)}, 1000) 
              }
                },
      error => {
        //console.log(error)
                setTimeout(() => {this.odczytaj_moduly(licznik, stan, dowykonania)}, 1000) 
              }
              )      
  }
  else
  {
    this.OdczytajModuly.next({"nastepny":dowykonania.nastepnyFalse, "komunikat": "problem z odczytem"})
  }
}

}
