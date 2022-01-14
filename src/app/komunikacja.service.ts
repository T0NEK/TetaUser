import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';

@Injectable({ providedIn: 'root'})


export class KomunikacjaService 
{
  private httpURL_80 = 'http://localhost:80/TetaPhp/Admin/';
  private httpURL_8080 = 'http://localhost:8080/TetaPhp/Admin/';
  private httpURL_8080_1 = 'http://192.168.60.25:8080/TetaPhp/Admin/';
  private httpURL: any;
  
  constructor(private http: HttpClient,private funkcje: FunkcjeWspolneService) 
  {
    //console.log('komunikacja con');
    this.httpURL = 'error';
    this.sprawdz_port(this.httpURL_80);
    this.sprawdz_port(this.httpURL_8080);
    this.sprawdz_port(this.httpURL_8080_1);
  }


/* (start) port serwera sql */
getURL(){ return this.httpURL;}

private sprawdz_port(port: string)
{
  this.http.get(port + 'conect/').subscribe( 
    data =>  {
              this.httpURL = port;
              let wynik = JSON.parse(JSON.stringify(data));
              console.log(wynik)
             },
    error => {
              console.log(error)
             }         
             )      
}
/* (end) port serwera sql */

/* (start) rejestracja stanowiska */
rejestruj(licznik: number, czas: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
  var data = JSON.stringify({ "czas": czas})  

 if (licznik == 0) 
  { 
    this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAREJESTROWAĆ ','red'); 
  }
  else
  {
  this.http.post(this.getURL() + 'rejestracja/', data, httpOptions).subscribe( 
    data =>  {
            let wynik = JSON.parse(JSON.stringify(data));
            console.log(wynik)
            if (wynik.wynik == true) 
            {
              //this.changeCzasDedala( wynik.czas );
              this.funkcje.addLiniaKomunikatu('Zapisano "nowa data na Dedalu" - ' + wynik.token ,'') 
            }
            else
            {
              this.funkcje.addLiniaKomunikatu('Błąd zapisu "nowa data na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
              setTimeout(() => {this.rejestruj(--licznik, czas)}, 1000) 
            }
              },
    error => { 
              this.funkcje.addLiniaKomunikatu('Błąd połączenia "nowa data na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
              setTimeout(() => {this.rejestruj(--licznik,czas)}, 1000) 
             }
             )      
  }
}
/* (end) rejestracja stanowiska */
}
