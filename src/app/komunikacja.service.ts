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
    this.sprawdz_port(0,this.httpURLdane);
  }

/* (start) port serwera sql */
private httpURLdane = [
  'http://localhost:80/TetaPhp/Admin/',
  'http://192.168.60.25:8080/TetaPhp/Admin/',
  'http://localhost:8080/TetaPhp/Admin/'
  ];
private httpURL= '';

getURL(){ return this.httpURL;}

private sprawdz_port(licznik: number, porty: any)
{
  //console.log(this.httpURLdane.length)
  //console.log(porty.length, '                ',licznik, '    ', porty[licznik])
  if (licznik < porty.length)
  {
  this.http.get(porty[licznik] + 'conect/').subscribe( 
    data =>  {
      //console.log('data', data)
              this.httpURL = porty[licznik];
              //let wynik = JSON.parse(JSON.stringify(data));
              if (this.hostid == '')
              {
              this.rejestruj(5)  
              }
             },
    error => {
     //console.log('error', error)
              this.sprawdz_port(++licznik,porty)
             }         
             )      
  }           
  else
  {
    this.httpURL = 'error'
  }
}
/* (end) port serwera sql */

/* (start) rejestracja stanowiska */
private host = '';
private hostid = '';
private czas_dedala_ofset_korekta: any;

getHost(){ return this.host;}
getHostId(){ return this.hostid;}
getOfsetKorekta(){ return this.czas_dedala_ofset_korekta;}

rejestruj(licznik: number)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
  
 if (licznik == 0) 
  { 
    this.hostid = 'error';
  }
  else
  {
  this.http.post(this.getURL() + 'rejestracja/', data, httpOptions).subscribe( 
    data =>  {
            let wynik = JSON.parse(JSON.stringify(data));
            if (wynik.wynik == true) 
            {
              this.host = wynik.host;
              this.hostid = wynik.hostid;  
              this.czas_dedala_ofset_korekta = moment(wynik.czasserwera,"YYYY-MM-DD HH:mm:ss").diff(moment(wynik.czas,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
              //console.log('wynik ', wynik, '         ofset', this.czas_dedala_ofset_korekta)
            }
            else
            {
              setTimeout(() => {this.rejestruj(--licznik)}, 1000) 
            }
              },
    error => { 
              setTimeout(() => {this.rejestruj(--licznik)}, 1000) 
             }
             )      
  }
}
}
/* (end) rejestracja stanowiska */
