import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { OsobyWiadomosci, Wiadomosci, Wiersze } from './definicje';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class WiadomosciService implements OnDestroy{

private logowaniesubscribe = new Subscription();
private osobysubscribe = new Subscription();
private tablicaosoby: OsobyWiadomosci[] = [];
private wiadomosci: Wiadomosci[] =[];
private liczbawiadomosci = 0;
private nowewiadomosci = 0;
private odbiorca: number = 0;


constructor(private komunikacja: KomunikacjaService, private http: HttpClient)
{

this.logowaniesubscribe = komunikacja.logowanieUsera$.subscribe
  ( data => 
    { 
      if ((data.wynik)&&(data.stan))
      {
        this.odbiorca = data.zalogowany;
        this.wczytajOsoby();
      }      
    } 
  )
this.osobysubscribe = this.OdczytajOsoby$.subscribe
  ( data => 
    { 
      this.tablicaosoby = data;   
      this.OdczytajWiadomosci( this.odbiorca);
    } 
  )
}

ngOnDestroy()
{
  if(this.logowaniesubscribe) { this.logowaniesubscribe.unsubscribe()}       
  if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}       
}


wczytajOsoby()
{
    this.odczytaj_osoby('osoby');
}

private OdczytajOsoby = new Subject<any>();
OdczytajOsoby$ = this.OdczytajOsoby.asObservable()
private odczytaj_osoby(stan: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({ "get": stan})  
    

    this.http.post(this.komunikacja.getURL() + 'wiadomosci/', data, httpOptions).subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
          this.tablicaosoby = wynik.osoby;
          this.OdczytajOsoby.next(wynik.osoby);
        }
        else
        {
          setTimeout(() => {this.odczytaj_osoby(stan)}, 1000)
        }
                        
               },
      error => {
                setTimeout(() => {this.odczytaj_osoby(stan)}, 1000)
               }
               )      
  }

  

  OdczytajWiadomosci(odbiorca: number)
  {
    this.odczytaj_wiadomosci('wiad', odbiorca);
  }
  
  private Wiadomosci = new Subject<any>();
  Wiadomosci$ = this.Wiadomosci.asObservable()
  private odczytaj_wiadomosci(stan: string, odbiorca: number)
    {
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
    var data = JSON.stringify({ "get": stan, "odbiorca": odbiorca})  
      
  
      this.http.post(this.komunikacja.getURL() + 'wiadomosci/', data, httpOptions).subscribe( 
        data =>  {
      //console.log(data)
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
            this.liczbawiadomosci = wynik.ilosc;
            this.nowewiadomosci = wynik.odebrane;
            this.Wiadomosci.next(wynik)
            if (wynik.odebrane > 0)
            {
               this.tablicaosoby.forEach(element => 
                {
                if ( wynik.nadawcy.includes(element.id) )
                {
                  element.nowe = true;
                }
                });

            }
            else  
            {
            //  this.wiadomosci = wynik.wiadomosci
            //  this.odczytaj_wiadomosci('wiad', odbiorca);
            }
            

            setTimeout(() => {this.odczytaj_wiadomosci(stan, odbiorca)}, 1000)
          }
          else
          {
            setTimeout(() => {this.odczytaj_wiadomosci(stan, odbiorca)}, 1000)
          }
                          
                 },
        error => {
      //console.log(error)
                  setTimeout(() => {this.odczytaj_wiadomosci(stan, odbiorca)}, 1000)
                 }
                 )      
    }

}
