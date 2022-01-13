import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root'})


export class KomunikacjaService 
{
  private httpURL_80 = 'http://localhost:80/TetaPhp/Admin/';
  private httpURL_8080 = 'http://localhost:8080/TetaPhp/Admin/';
  private httpURL_8080_1 = 'http://192.168.60.25:8080/TetaPhp/Admin/';
  private httpURL: any;
  
  constructor(private http: HttpClient) 
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
              console.log(wynik.wynik, '    ', wynik.host)
             },
    error => {

             }         
             )      
}
/* (end) port serwera sql */









}
