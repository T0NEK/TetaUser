import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
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
  'http://localhost:80/TetaPhp/Admin/',
  'http://192.168.60.25:8080/TetaPhp/Admin/',
  'http://localhost:8080/TetaPhp/Admin/'
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
}
/* (end) rejestracja stanowiska */
