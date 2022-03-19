import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';

@Injectable({ providedIn: 'root'})


export class KomunikacjaService 
{
  
constructor(private http: HttpClient,private funkcje: FunkcjeWspolneService) 
  {
    //console.log('komunikacja con', );
  }


StartKomunikacja()
  {
    for (let index = 0; index < this.httpURLdane.length; index++) 
    {
      this.sprawdz_port(this.httpURLdane[index]);  
    }  
    
  }

/* (start) port serwera sql */
private httpURLdane = [
  'http://192.168.0.16:80/TetaPhp/User/',
  'http://localhost:80/TetaPhp/User/',
  'http://192.168.60.25:8080/TetaPhp/User/',
  'http://localhost:8080/TetaPhp/User/'
  ];
private httpURL= '';

getURL(){ return this.httpURL;}

private sprawdz_port(port: any)
{
  this.http.get(port + 'conect/').subscribe( 
    data =>  {
              this.httpURL = port;
             },
    error => {   }         
             )      
}           
/* (end) port serwera sql */

/* (start) rejestracja stanowiska */
private host = '';
private hostid = '';
private czas_dedala_ofset_korekta: any;

getHost(){ return this.host;}
getHostId(){ return this.hostid;}
getOfsetKorekta(){ return this.czas_dedala_ofset_korekta;}

rejestruj()
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
  
  this.http.post(this.getURL() + 'rejestracja/', data, httpOptions).subscribe( 
    data =>  {
            let wynik = JSON.parse(JSON.stringify(data));
            if (wynik.wynik == true) 
            {
              this.host = wynik.host;
              this.hostid = wynik.hostid;  
              this.czas_dedala_ofset_korekta = moment(wynik.czasserwera,"YYYY-MM-DD HH:mm:ss").diff(moment(wynik.czas,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
            }
            else
            {
              setTimeout(() => {this.rejestruj()}, 1000) 
            }
              },
    error => { 
              setTimeout(() => {this.rejestruj()}, 1000) 
             }
             )      
}

/* (end) rejestracja stanowiska */

/* (start) logowanie */
Zaloguj(parametry: any)
{
  this.loguj(5,parametry)
}

private logowanieUsera = new Subject<any>();
logowanieUsera$ = this.logowanieUsera.asObservable()
private loguj(licznik: number, parametry: any)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "login": parametry[0], "pass": parametry[1], "zalogowany": parametry[2]})  

//console.log('loguje ',parametry )
if (licznik == 0) 
{ this.logowanieUsera.next( { "wynik":false, "stan":false, "error":"Problem z logowaniem" } ) }
else
{
  this.http.post(this.getURL() + 'logowanie/', data, httpOptions).subscribe( 
    data =>  {
            let wynik = JSON.parse(JSON.stringify(data));
            //console.log('logowanie ',wynik)
            //console.log(wynik.error)
            if (wynik.wynik == true) 
            {
              this.logowanieUsera.next(wynik)
            }
            else
            {
              setTimeout(() => {this.loguj(--licznik, parametry)}, 1000) 
            }
              },
    error => {
      //let wynik = JSON.parse(JSON.stringify(error.error));
      //console.log('logowanie error ',error) 
              setTimeout(() => {this.loguj(--licznik, parametry)}, 1000) 
             }
             )      
}             
}
/* (end) logowanie */
}