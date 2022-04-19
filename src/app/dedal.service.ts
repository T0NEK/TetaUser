import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CzasService } from './czas.service';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({ providedIn: 'root' })

export class DedalService {

constructor(private http: HttpClient, private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService, private czasy: CzasService)
{
  setTimeout(() => {
    this.OdczytujOdpowiedzi();  
  }, 3000);
  
}



public PoleceniaDedala = new Subject<any>();
PoleceniaDedala$ = this.PoleceniaDedala.asObservable()


Polecenie(poleceniepierwsze: string, czaspierwsze: string, polecenieodpowiedz: string, polecenieid: number, polecenieText: string, osoba: number, osobaText: string, czas: string, terminal: string, odpowiedzText: string)
  {
    console.log(polecenieid,  osoba , terminal);
    if (polecenieid != 0)
    {
        setTimeout(() => 
        {
            this.PoleceniaDedala.next({"osoba": this.funkcje.getDedal(), "czas": this.czasy.getCzasDedala() , "komunikat": "znam to polecenie, możesz je wykonać", "clear": false})   
            this.funkcje.OdblokujLinieDialogu('') 
        }, 1000);
        
    }
    else
    {
    this.set_polecenie(5, 'set', poleceniepierwsze, czaspierwsze, polecenieodpowiedz, polecenieid, polecenieText , osoba , osobaText, czas, terminal, odpowiedzText, '');
    }
  }
   
  public WyslijPolecenie = new Subject<any>();
  WyslijPolecenie$ = this.WyslijPolecenie.asObservable()



  private set_polecenie(licznik: number, get: string, poleceniepierwsze: string, czaspierwsze: string, polecenieodpowiedz: string, polecenieid: number, polecenieText: string, osoba: number, osobaText: string, czas: string, terminal: string, odpowiedzText: string, powod: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"get": get, "poleceniepierwsze": poleceniepierwsze, "czaspierwsze": czaspierwsze, "polecenieodpowiedz": polecenieodpowiedz, "polecenieid": polecenieid, "polecenieText": polecenieText, "osoba": osoba, "osobaText": osobaText, "czaswykonania": czas, "terminal": terminal, "odpowiedzText": odpowiedzText })  
  
  if (licznik == 0) 
  {
    this.WyslijPolecenie.next({"wynik": false, "komunikat": ' error: ' + powod, "odczytane": 0})
  }
  else
  {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'dedal/', data, httpOptions).subscribe( 
        data =>  {
          console.log(data, licznik)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  this.WyslijPolecenie.next({"wynik": true, "komunikat": wynik.error, "odczytane": wynik.odczytane})
                }
                else
                {//wynik false
                  setTimeout(() => {this.set_polecenie(licznik, get, poleceniepierwsze, czaspierwsze, polecenieodpowiedz, polecenieid, polecenieText , osoba, osobaText, czas, terminal, odpowiedzText, wynik.error)}, 1000) 
                }
                  },
        error => {
          console.log(error)
                  setTimeout(() => {this.set_polecenie(licznik, get, poleceniepierwsze, czaspierwsze, polecenieodpowiedz, polecenieid, polecenieText , osoba, osobaText, czas, terminal, odpowiedzText, error.error)}, 1000) 
                }
                )      
  }
  }


OdczytujOdpowiedzi()
{
  this.odczytuj_odpowiedzi()
}

  private Odpowiedzi = new Subject<any>();
  Odpowiedzi$ = this.Odpowiedzi.asObservable()
    private odczytuj_odpowiedzi()
    {
      const httpOptions = {
          headers: new HttpHeaders({
            'Access-Control-Allow-Origin':'*',
            'content-type': 'application/json',
            Authorization: 'my-auth-token'
          })
        };
        
      var data = JSON.stringify({"get": "get", "osoba": this.funkcje.getZalogowany().zalogowany, "terminal": this.komunikacja.getHost() })  
  
      this.http.post(this.komunikacja.getURL() + 'dedal/', data, httpOptions).subscribe( 
        data =>  {
       //console.log(data)   
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
              this.Odpowiedzi.next(wynik.polecenia);
              setTimeout(() => {this.odczytuj_odpowiedzi()}, 1000)
          }
          else
          {
            setTimeout(() => {this.odczytuj_odpowiedzi()}, 1000)
          }
                          
                 },
        error => {
        console.log(error)
                  setTimeout(() => {this.odczytuj_odpowiedzi()}, 1000)
                 }
                 )      
    }

}
