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
private httpHostName = window.location.hostname;
private httpURLdane = [
  'http://'+ this.httpHostName + ':80/TetaPhp/User/',
  'http://'+ this.httpHostName + ':8080/TetaPhp/User/',
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
private idhost = 0;
private host = '';
private nrip = '';
private hostid = '';
private czas_dedala_ofset_korekta: any;

getIdHost() {return this.idhost};
getHost(){ return this.host };
getIP(){ return this.nrip };
getHostId(){ return this.hostid };
getOfsetKorekta(){ return this.czas_dedala_ofset_korekta; }

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
      //console.log(data)
            let wynik = JSON.parse(JSON.stringify(data));
      //console.log(wynik)            
            if (wynik.wynik == true) 
            {
              this.idhost = wynik.id;
              this.host = wynik.nazwa;
              this.nrip = wynik.nrip;
              this.hostid = wynik.hostid;  
              this.czas_dedala_ofset_korekta = moment(wynik.czasserwera,"YYYY-MM-DD HH:mm:ss").diff(moment(wynik.czas,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
            }
            else
            {
              setTimeout(() => {this.rejestruj()}, 1000) 
            }
              },
    error => { 
      //console.log(error)
             setTimeout(() => {this.rejestruj()}, 1000) 
             }
             )      
}

/* (end) rejestracja stanowiska */

/* (start) logowanie */
Zaloguj(parametry: any, czas: string)
{
  this.loguj(5,parametry, czas)
}

private logowanieUsera = new Subject<any>();
logowanieUsera$ = this.logowanieUsera.asObservable()
private loguj(licznik: number, parametry: any, czas: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

//console.log('host ',this.getHost() )  
var data = JSON.stringify({ "login": parametry[0], "pass": parametry[1], "zalogowany": parametry[2], "nazwa": this.getHost(), "hostid": this.getHostId(), "idhost": this.idhost, "czas": czas})  

//console.log('loguje ',data )
if (licznik == 0) 
{ this.logowanieUsera.next( { "wynik":false, "stan":false, "error":"Problem z logowaniem" } ) }
else
{
  this.http.post(this.getURL() + 'logowanie/', data, httpOptions).subscribe( 
    data =>  {
      //console.log('logowanie ',data)
            let wynik = JSON.parse(JSON.stringify(data));
            if (wynik.wynik == true) 
            {
              this.logowanieUsera.next(wynik)
            }
            else
            {
              setTimeout(() => {this.loguj(--licznik, parametry, czas)}, 1000) 
            }
              },
    error => {
      //console.log('logowanie error ',error) 
              setTimeout(() => {this.loguj(--licznik, parametry, czas)}, 1000) 
             }
             )      
}             
}
/* (end) logowanie */
}