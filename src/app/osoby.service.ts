import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { Osoby } from './definicje';
import * as moment from 'moment';

@Injectable({ providedIn: 'root'})

export class OsobyService 
{
    
constructor(private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService, private http: HttpClient)
{
    console.log('osoby con');
    //this.odczytaj_osoby(5);
}

/* (start) osoby*/

wczytajOsoby(licznik: number)
{
    this.odczytaj_osoby(licznik);
    this.odczytaj_goscie(licznik);
}

private OdczytajOsoby = new Subject<any>();
OdczytajOsoby$ = this.OdczytajOsoby.asObservable()
private odczytaj_osoby(licznik : number)
  {
    if (licznik == 0) 
    {
      
      this.OdczytajOsoby.next('osoby');
      this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ WCZYTAĆ Osoby', 'red');
    }
    else
    {
    this.http.get(this.komunikacja.getURL() + 'osoby/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
          let osoby = Array();  
            for (let index = 0; index < wynik.osoby.length; index++) {
                osoby = [...osoby, (wynik.osoby[index])];
            } 
          if (wynik.stan == 'START')
          {
            this.OdczytajOsoby.next(osoby);
            this.funkcje.addLiniaKomunikatu('Wczytano Załoga', '')
            } 
          else
          {         
          this.OdczytajOsoby.next(osoby);
          this.funkcje.addLiniaKomunikatu('Wczytano Załoga - stan oryginalny', '')
          }
        }
        else
        {
          this.OdczytajOsoby.next('');
          this.funkcje.addLiniaKomunikatu('Błąd odczytu Załoga - ponawiam: ' + licznik,'rgb(199, 100, 43)');
          setTimeout(() => {this.odczytaj_osoby(--licznik)}, 1000)
        }
                        
               },
      error => {
                
                this.OdczytajOsoby.next("");
                this.funkcje.addLiniaKomunikatu('Błąd połączenia Załoga  - ponawiam:' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_osoby(--licznik)}, 1000)
               }
               )      
    }
  }

  zapisz_osoby_all(licznik: number, zmiana: string, stan: boolean)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    
    var data = JSON.stringify({ "id": 0, "zmiana": zmiana, "stan": stan, "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
console.log(data)        

   if (licznik == 0) 
    { this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "zmiana: [' + zmiana + '] dla Załoga','red'); }
    else
    {
    this.http.post(this.komunikacja.getURL() + 'osoby/', data, httpOptions).subscribe( 
      data =>  {

console.log(data)        
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                //this.changeCzasDedala( wynik.czas );
                this.funkcje.addLiniaKomunikatu('Zapisano "zmiana: [' + zmiana + (stan ? ' = on':' = off') + '] dla Załoga"','') 
                this.odczytaj_osoby(5);
              }
              else
              {
                this.funkcje.addLiniaKomunikatu('Błąd zapisu "zmiana: [' + zmiana + '] dla Załoga" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_osoby_all(--licznik, zmiana, stan)}, 1000) 
              }
                },
      error => {
console.log(error)         
                this.funkcje.addLiniaKomunikatu('Błąd połączenia "zmiana: [' + zmiana + '] dla Załoga" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_osoby_all(--licznik, zmiana, stan)}, 1000) 
               }
               )      
    }
  }

  zapisz_osoby(licznik: number, zmiana: string, dane: any, stan: boolean)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    
    var data = JSON.stringify({ "id": dane.id, "zmiana": zmiana, "stan": stan, "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
console.log(data)        

   if (licznik == 0) 
    { 
      this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "zmiana: [' + zmiana + '] dla: ' + dane.imie + ' ' + dane.nazwisko + '"','red'); 
      this.odczytaj_osoby(5);    
    }
    else
    {
    this.http.post(this.komunikacja.getURL() + 'osoby/', data, httpOptions).subscribe( 
      data =>  {

console.log(data)        
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                //this.changeCzasDedala( wynik.czas );
                this.funkcje.addLiniaKomunikatu('Zapisano "zmiana: [' + zmiana + (stan ? ' = on':' = off') + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '"','') 
              }
              else
              {
                this.funkcje.addLiniaKomunikatu('Błąd zapisu "zmiana: [' + zmiana + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_osoby(--licznik, zmiana, dane, stan)}, 1000) 
              }
                },
      error => {
console.log(error)         
                this.funkcje.addLiniaKomunikatu('Błąd połączenia "zmiana: [' + zmiana + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_osoby(--licznik, zmiana, dane, stan)}, 1000) 
               }
               )      
    }
  }
/* (end) osoby*/

/* (start) osoby dodatkowe*/

  private OdczytajGoscie = new Subject<any>();
  OdczytajGoscie$ = this.OdczytajGoscie.asObservable()
  private odczytaj_goscie(licznik : number)
    {
      if (licznik == 0) 
      {
        
        this.OdczytajGoscie.next('osoby');
        this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ WCZYTAĆ Goście', 'red');
      }
      else
      {
      this.http.get(this.komunikacja.getURL() + 'goscie/').subscribe( 
        data =>  {
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
            let osoby = Array();  
            for (let index = 0; index < wynik.osoby.length; index++) {
                osoby = [...osoby, (wynik.osoby[index])];
            } 
            if (wynik.stan == 'START')
            {
              this.OdczytajGoscie.next(osoby);
              this.funkcje.addLiniaKomunikatu('Wczytano Goście', '')
            } 
            else
            {         
            this.OdczytajGoscie.next(osoby);
            this.funkcje.addLiniaKomunikatu('Wczytano Goście - stan oryginalny', '')
            }
          }
          else
          {
            this.OdczytajGoscie.next('');
            this.funkcje.addLiniaKomunikatu('Błąd odczytu Goście - ponawiam: ' + licznik,'rgb(199, 100, 43)');
            setTimeout(() => {this.odczytaj_goscie(--licznik)}, 1000)
          }
                          
                 },
        error => {
                  
                  this.OdczytajGoscie.next('');
                  this.funkcje.addLiniaKomunikatu('Błąd połączenia Goście  - ponawiam:' + licznik,'rgb(199, 100, 43)');
                  setTimeout(() => {this.odczytaj_goscie(--licznik)}, 1000)
                 }
                 )      
      }
    }

    zapisz_goscie_all(licznik: number, zmiana: string, stan: boolean)
    {
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
      
      var data = JSON.stringify({ "id": 0, "zmiana": zmiana, "stan": stan, "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
  console.log(data)        
  
     if (licznik == 0) 
      { this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "zmiana: [' + zmiana + '] dla Osoby Dodatkowe','red'); }
      else
      {
      this.http.post(this.komunikacja.getURL() + 'goscie/', data, httpOptions).subscribe( 
        data =>  {
  
  console.log(data)        
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  //this.changeCzasDedala( wynik.czas );
                  this.funkcje.addLiniaKomunikatu('Zapisano "zmiana: [' + zmiana + (stan ? ' = on':' = off') +'] dla Osoby Dodatkowe"','') 
                  this.odczytaj_goscie(licznik);
                }
                else
                {
                  this.funkcje.addLiniaKomunikatu('Błąd zapisu "zmiana: [' + zmiana + '] dla Osoby Dodatkowe" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                  setTimeout(() => {this.zapisz_goscie_all(--licznik, zmiana, stan)}, 1000) 
                }
                  },
        error => {
  console.log(error)         
                  this.funkcje.addLiniaKomunikatu('Błąd połączenia "zmiana: [' + zmiana + '] dla Osoby Dodatkowe" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                  setTimeout(() => {this.zapisz_goscie_all(--licznik, zmiana, stan)}, 1000) 
                 }
                 )      
      }
    }

  zapisz_goscie(licznik: number, zmiana: string, dane: any, stan: boolean)
    {
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
      
      var data = JSON.stringify({ "id": dane.id, "zmiana": zmiana, "stan": stan, "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
  console.log(data)        
  
     if (licznik == 0) 
      { 
        this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "zmiana: [' + zmiana + '] dla: ' + dane.imie + ' ' + dane.nazwisko + '"','red'); 
        this.odczytaj_goscie(5);    
      }
      else
      {
      this.http.post(this.komunikacja.getURL() + 'goscie/', data, httpOptions).subscribe( 
        data =>  {
  
  console.log(data)        
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  //this.changeCzasDedala( wynik.czas );
                  this.funkcje.addLiniaKomunikatu('Zapisano "zmiana: [' + zmiana + (stan ? ' = on':' = off') + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '"','') 
                }
                else
                {
                  this.funkcje.addLiniaKomunikatu('Błąd zapisu "zmiana: [' + zmiana + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                  setTimeout(() => {this.zapisz_goscie(--licznik, zmiana, dane, stan)}, 1000) 
                }
                  },
        error => {
  console.log(error)         
                  this.funkcje.addLiniaKomunikatu('Błąd połączenia "zmiana: [' + zmiana + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                  setTimeout(() => {this.zapisz_goscie(--licznik, zmiana, dane, stan)}, 1000) 
                 }
                 )      
      }
    }      
/* (end) osoby dodatkowe*/  

}
