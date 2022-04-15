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

}



public PoleceniaDedala = new Subject<any>();
PoleceniaDedala$ = this.PoleceniaDedala.asObservable()


Polecenie(polecenie: number, polecenieText: string, osoba: number, osobaText: string, czas: string, terminal: string)
  {
    console.log(polecenie,  osoba , terminal);
    if (polecenie != 0)
    {
        setTimeout(() => 
        {
            this.PoleceniaDedala.next({"osoba": this.funkcje.getDedal(), "czas": this.czasy.getCzasDedala() , "komunikat": "znam to polecenie, możesz je wykonać", "clear": false})   
            this.funkcje.OdblokujLinieDialogu('') 
        }, 1000);
        
    }
    else
    {
    this.set_polecenie(5, 'set', polecenie, polecenieText , osoba , osobaText, czas, terminal, '');
    }
  }
   
  public WyslijPolecenie = new Subject<any>();
  WyslijPolecenie$ = this.WyslijPolecenie.asObservable()



  private set_polecenie(licznik: number, get: string, polecenie: number, polecenieText: string, osoba: number, osobaText: string, czas: string, terminal: string, powod: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"get": get, "polecenie": polecenie, "polecenieText": polecenieText, "osoba": osoba, "osobaText": osobaText, "czaswykonania": czas, "terminal": terminal })  
  
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
                  setTimeout(() => {this.set_polecenie(licznik, get, polecenie, polecenieText , osoba, osobaText, czas, terminal, wynik.error)}, 1000) 
                }
                  },
        error => {
          console.log(error)
                  setTimeout(() => {this.set_polecenie(licznik, get, polecenie, polecenieText , osoba, osobaText, czas, terminal, error.error)}, 1000) 
                }
                )      
  }
  }

}
