import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';

@Injectable({ providedIn: 'root'})

export class OsobyService 
{
    
constructor(private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService, private http: HttpClient)
{
    console.log('osoby con');
    //this.odczytaj_osoby(5);
}

/* (start) osoby*/

wczytajOsoby()
{
    this.odczytaj_osoby();
}

private OdczytajOsoby = new Subject<any>();
OdczytajOsoby$ = this.OdczytajOsoby.asObservable()
private odczytaj_osoby()
  {
    this.http.get(this.komunikacja.getURL() + 'zalogowani/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
          let osoby = Array();  
            for (let index = 0; index < wynik.osoby.length; index++) {
                if (wynik.osoby[index].zalogowany)
                {osoby = [...osoby, (wynik.osoby[index])];}
            } 
          if (wynik.stan == 'START')
          {
            this.OdczytajOsoby.next(osoby);
          } 
          setTimeout(() => {this.odczytaj_osoby()}, 1000)  
        }
        else
        {
          this.OdczytajOsoby.next('');
          setTimeout(() => {this.odczytaj_osoby()}, 1000)
        }
                        
               },
      error => {
                
                this.OdczytajOsoby.next('');
                setTimeout(() => {this.odczytaj_osoby()}, 1000)
               }
               )      
  }
/* (end) osoby*/

}
