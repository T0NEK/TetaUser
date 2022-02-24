import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { KomunikacjaService } from './komunikacja.service';
import { Osoby } from './definicje';


@Injectable({ providedIn: 'root'})

export class OsobyService 
{
    
constructor(private komunikacja: KomunikacjaService, private http: HttpClient)
{
  //console.log('osoby con');
}

/* (start) osoby*/

wczytajOsoby(stan: number)
{
    this.odczytaj_osoby(stan);
}

private OdczytajOsoby = new Subject<any>();
OdczytajOsoby$ = this.OdczytajOsoby.asObservable()
private odczytaj_osoby(stan: number)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({ "stan": stan})  
    

    this.http.post(this.komunikacja.getURL() + 'zalogowani/', data, httpOptions).subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
          /*
          let osoby = Array<Osoby>();  
            for (let index = 0; index < wynik.osoby.length; index++) {
                if (wynik.osoby[index].zalogowany)
                {osoby = [...osoby, (wynik.osoby[index])];}
            }
          */   
          if (wynik.stan == 'START')
          {
          //  this.OdczytajOsoby.next(osoby);
          this.OdczytajOsoby.next(wynik.osoby);
          } 
          setTimeout(() => {this.odczytaj_osoby(stan)}, 1000)  
        }
        else
        {
          this.OdczytajOsoby.next('');
          setTimeout(() => {this.odczytaj_osoby(stan)}, 1000)
        }
                        
               },
      error => {
                
                this.OdczytajOsoby.next('');
                setTimeout(() => {this.odczytaj_osoby(stan)}, 1000)
               }
               )      
  }
/* (end) osoby*/

}
