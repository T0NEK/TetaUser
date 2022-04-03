import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';


@Injectable({
    providedIn: 'root'
  })
export class ZdarzeniaService {

constructor(private funkcje: FunkcjeWspolneService , private komunikacja: KomunikacjaService, private http: HttpClient) 
 {
  //  this.OdczytujZdarzenia()
 }

 OdczytujZdarzenia()
 {
    this.odczytuj_zdarzenia()
 }


private Zdarzenia = new Subject<any>();
Zdarzenia$ = this.Zdarzenia.asObservable()
  private odczytuj_zdarzenia()
  {
    const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
    var data = JSON.stringify({"zalogowany": this.funkcje.getZalogowany().zalogowany })  

    this.http.post(this.komunikacja.getURL() + 'zdarzenia/', data, httpOptions).subscribe( 
      data =>  {
     //console.log(data)   
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
            this.funkcje.setOsobaNarosl(wynik.narosl)
            this.Zdarzenia.next(wynik);
            setTimeout(() => {this.odczytuj_zdarzenia()}, 1000)
        }
        else
        {
          setTimeout(() => {this.odczytuj_zdarzenia()}, 1000)
        }
                        
               },
      error => {
      //console.log(error)
                setTimeout(() => {this.odczytuj_zdarzenia()}, 1000)
               }
               )      
  }

}
