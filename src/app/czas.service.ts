import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { KomunikacjaService } from './komunikacja.service';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { OsobyService } from './osoby.service';

@Injectable({
  providedIn: 'root'
})
export class CzasService implements OnDestroy
{

  constructor(private http: HttpClient, @Inject(LOCALE_ID) private locate : string, private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService, private osoby: OsobyService) 
  {
  //console.log('czas con'); 
  this.sprawdzSQL(5);  
  }
  
  
 
  ngOnDestroy() 
  {
    if (this.czas_rzeczywisty_id) { clearInterval(this.czas_rzeczywisty_id); }
    if (this.czas_rzeczywisty_Dedala_id) { clearInterval(this.czas_rzeczywisty_Dedala_id); }
    if (this.czas_rzeczywisty_Dedala_org_id) { clearInterval(this.czas_rzeczywisty_Dedala_org_id); }
    if (this.czas_rzeczywisty_start_id) { clearInterval(this.czas_rzeczywisty_start_id); }
    if (this.czas_uplyw_dedala_id) { clearInterval(this.czas_uplyw_dedala_id); }
    
  }

/* (start) START */
  sprawdzSQL(licznik : number)
  {
    if (licznik == 0) 
    { this.funkcje.addLiniaKomunikatu('Sprawdzono porty, brak komunikacji z MySql', 'red'); }
    else
    {
      if (this.komunikacja.getURL() == 'error') 
        {
          this.funkcje.addLiniaKomunikatu('Sprawdzam połączenie z MySql', 'rgb(199, 100, 43)');
          setTimeout(()=> { this.sprawdzSQL(--licznik) },1000)
        }    
      else
      {
        this.funkcje.addLiniaKomunikatu('Połączenie z MySql: OK', '');
        this.odczytaj_startstop(10);
        this.taktujCzas();
        this.odczytaj_czas_startu(10);
        this.odczytaj_czas_dedala(10);
        this.osoby.wczytajOsoby(5);
      }  
    }
  }
/* (end) START */  

/* (start) czas rzeczywisty */
  private czas_rzeczywisty: any;
  private czas_rzeczywisty_id: any;

  getCzasRzeczywisty() { return this.czas_rzeczywisty; }

  private czasRzeczywisty = new Subject<any>();
  czasRzeczywisty$ = this.czasRzeczywisty.asObservable();
  taktujCzas() { 
      this.czas_rzeczywisty = (moment()).format('YYYY-MM-DD HH:mm:ss');
      this.czas_rzeczywisty_id = setInterval(() => { 
            this.czas_rzeczywisty = (moment()).format('YYYY-MM-DD HH:mm:ss');
            this.czasRzeczywisty.next( this.czas_rzeczywisty ) }
            , 1000); 
      }
/* (end) czas rzeczywisty */


/* (start) czas rzeczywisty Dedala */
private czas_dedala_ofset: any;
private czas_rzeczywisty_Dedala_id: any;

getCzasDedala() { return this.czas_dedala_new};

private czasRzeczywistyDedala = new Subject<any>();
czasRzeczywistyDedala$ = this.czasRzeczywistyDedala.asObservable();
taktujCzasDedala() { 
      this.czas_dedala_ofset = moment(this.czas_dedala_new,"YYYY-MM-DD HH:mm:ss").diff(moment(this.czas_rzeczywisty_start,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
     
      this.czas_rzeczywisty_Dedala_id = setInterval(() => 
      {    
       let czas = moment().add(this.czas_dedala_ofset,'milliseconds')
       this.czas_dedala_new = moment(czas).format('YYYY-MM-DD HH:mm:ss');
        this.czasRzeczywistyDedala.next( this.czas_dedala_new )
      }, 1000); 
      
    }

zatrzymajCzasDedala()
    {
      if (this.czas_rzeczywisty_Dedala_id) { clearInterval(this.czas_rzeczywisty_Dedala_id); }
    }

/* (end) czas rzeczywisty Dedala*/

/* (start) czas oryginalny Dedala */
private czas_dedala_ofset_org: any;
private czas_rzeczywisty_Dedala_org_id: any;

getCzasDedalaOryg() { return this.czas_dedala_org_new};

private czasOryginalnyDedala = new Subject<any>();
czasOryginalnyDedala$ = this.czasOryginalnyDedala.asObservable();
taktujCzasOryginalnyDedala() { 
      this.czas_dedala_ofset_org = moment(this.czas_dedala_org,"YYYY-MM-DD HH:mm:ss").diff(moment(this.czas_rzeczywisty_start,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
     
      this.czas_rzeczywisty_Dedala_org_id = setInterval(() => 
      {    
       let czas = moment().add(this.czas_dedala_ofset_org,'milliseconds')
       this.czas_dedala_org_new = moment(czas).format('YYYY-MM-DD HH:mm:ss');
        this.czasOryginalnyDedala.next( this.czas_dedala_org_new );
      }, 1000); 
      
    }

zatrzymajCzasOryginalnyDedala()
    {
      if (this.czas_rzeczywisty_Dedala_org_id) { clearInterval(this.czas_rzeczywisty_Dedala_org_id); }
    }    
/* (end) czas oryginalny Dedala*/


/* (start) formatowanie upływu */ 
formatUplyw(poczatek: any, obecny: any)
{
  let czas_obecny = moment(obecny);
  let czas_poczatek = moment(poczatek)
  let ms = moment(czas_obecny,"YYYY-MM-DD HH:mm:ss").diff(moment(czas_poczatek,"YYYY-MM-DD HH:mm:ss"));
  let d = moment.duration(Math.abs(ms));
  let uplyw = '';
  let przecinek = ''
  if (ms < 0) { uplyw = '– '}
  if (d.years() != 0)  { uplyw = uplyw + d.years().toString() + (d.years() > 1 ? ' lata':' rok'); przecinek = '; ';}
  if (d.months() != 0) { uplyw = uplyw + ' ' + d.months().toString() + (d.months() > 1 ? ' miesięcy':' miesiąc'); przecinek = '; ';}
  if (d.days() != 0)   { uplyw = uplyw + ' ' + d.days().toString() + (d.days() > 1 ? ' dni':' dzień'); przecinek = '; ';}
  uplyw = uplyw + przecinek;
  if (d.hours() != 0)  { uplyw = uplyw + ' ' + d.hours().toString() + (d.hours() > 1 ? ' godzin':' godzina');}
  if (d.minutes() != 0){ uplyw = uplyw + ' ' + d.minutes().toString() + (d.minutes() > 1 ? ' minut':' minuta');}
  if (d.seconds() != 0){ uplyw = uplyw + ' ' + d.seconds().toString() + (d.seconds() > 1 ? ' sekund':' sekunda');}
    return uplyw
}
/* (end) formatowanie upływu */ 

/* (start) upływ czasu rzeczywistego */ 
  private czas_rzeczywisty_start = '';
  private czas_rzeczywisty_end = '';
  private czas_rzeczywisty_start_id: any;

  getCzasRzeczywistyStart() { return this.czas_rzeczywisty_start;}
  getCzasRzeczywistyEnd() { return this.czas_rzeczywisty_end;}
  
  private czasRzeczywistyUplyw = new Subject<any>();
  czasRzeczywistyUplyw$ = this.czasRzeczywistyUplyw.asObservable();
  taktujUplyw() 
    { 
    this.czasRzeczywistyUplyw.next(this.formatUplyw(this.czas_rzeczywisty_start,(moment()).format('YYYY-MM-DD HH:mm:ss')))
    this.czas_rzeczywisty_start_id = setInterval(() => 
      {

        this.czasRzeczywistyUplyw.next(this.formatUplyw(this.czas_rzeczywisty_start,(moment()).format('YYYY-MM-DD HH:mm:ss')))
      },1000);
    }

  zatrzymajUplyw()
    {
      if (this.czas_rzeczywisty_start_id) { clearInterval(this.czas_rzeczywisty_start_id); }
      this.czasRzeczywistyUplyw.next('')
    }
/* (end) upływ czasu rzeczywistego */ 

/* (start) upływ czasu Dedala */ 
private czas_uplyw_dedala_id: any;

private czasDedalaUplyw = new Subject<any>();
czasDedalaUplyw$ = this.czasDedalaUplyw.asObservable();
taktujDedalaUplyw() 
  { 
  this.czasDedalaUplyw.next(this.formatUplyw(this.getCzasStartu(), this.getCzasDedala()));
  this.czas_uplyw_dedala_id = setInterval(() => 
    {
      this.czasDedalaUplyw.next(this.formatUplyw(this.getCzasStartu(), this.getCzasDedala()))
    },1000);
  }

zatrzymajDedalaUplyw()
  {
    if (this.czas_uplyw_dedala_id) { clearInterval(this.czas_uplyw_dedala_id); }
    this.czasDedalaUplyw.next('')
  }

/* (end) upływ czasu Dedala */ 




/* (start)  */
/*
  private PrzelaczZakladka = new Subject<any>();
  PrzelaczZakladka$ = this.PrzelaczZakladka.asObservable()
  changePrzelaczZakladka(numer: number)
  {
    this.PrzelaczZakladka.next(numer)
  }
/* (end) */  

/* (start) czas startu Dedala */
  private czas_startu_org: any;
  private czas_startu_new: any;

  getCzasStartu(){ return this.czas_startu_new}

  private GetCzasStartuNew = new Subject<any>();
  GetCzasStartuNew$ = this.GetCzasStartuNew.asObservable()
  changeCzasStartuNew(czas: any)
  {
    this.czas_startu_new = czas;
    this.GetCzasStartuNew.next(this.czas_startu_new)
  }


  private OdczytajCzasStartu = new Subject<any>();
  OdczytajCzasStartu$ = this.OdczytajCzasStartu.asObservable()
  private odczytaj_czas_startu(licznik : number)
  {
    if (licznik == 0) 
    {
      this.czas_startu_org = 'ERROR';
      this.changeCzasStartuNew(this.czas_startu_org);
      this.OdczytajCzasStartu.next(this.czas_startu_org)
      this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "czas startu Dedala" ','red');
    }
    else
    {
    this.http.get(this.komunikacja.getURL() + 'datastartu/').subscribe( 
      data =>  {
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true)
                {
                  if (wynik.stan == 'START')
                  {
                    this.czas_startu_org = wynik.czasorg;
                    this.funkcje.addLiniaKomunikatu('Parametry po Restarcie Aplikacji: "czas startu Dedala": ' + wynik.czasnew ,'red')
                    this.changeCzasStartuNew(wynik.czasnew);
                    this.OdczytajCzasStartu.next(wynik.czasorg);
                    }
                  else
                  {
                    this.czas_startu_org = wynik.czasorg;
                    this.funkcje.addLiniaKomunikatu('Odczytano "czas startu Dedala":  ' + wynik.czasorg ,'')
                    this.changeCzasStartuNew(wynik.czasorg);
                    this.OdczytajCzasStartu.next(wynik.czasorg);
                    }
          
          
                 }
                else
                {
                  this.czas_startu_org = 'ponawiam';
                  this.changeCzasStartuNew(this.czas_startu_org);
                  this.OdczytajCzasStartu.next(this.czas_startu_org);
                  this.funkcje.addLiniaKomunikatu('Błąd odczytu "czas startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                  setTimeout(() => {this.odczytaj_czas_startu(--licznik)}, 1000)
                }
                },
      error => {
                this.czas_startu_org = 'ponawiam';
                this.changeCzasStartuNew(this.czas_startu_org);
                this.OdczytajCzasStartu.next(this.czas_startu_org);
                this.funkcje.addLiniaKomunikatu('Błąd połączenia "czas startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_czas_startu(--licznik)}, 1000)
               }
               )      
    }
  }

  zapisz_data_startu(licznik : number, czas: string )
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    var data = JSON.stringify({"czas": czas, "zmiana": moment().format('YYYY-MM-DD HH:mm:ss') })  
   if (licznik == 0) 
    { this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "nowa data startu Dedala" ','red'); }
    else
    {
    this.http.post(this.komunikacja.getURL() + 'datastartu/', data, httpOptions).subscribe( 
      data =>  {
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true)
                {
                  this.changeCzasStartuNew( wynik.stan );
                  this.funkcje.addLiniaKomunikatu('Zapisano "nowa data startu Dedala": ' + wynik.stan ,'') 
                }
                else
                {
                  this.funkcje.addLiniaKomunikatu('Błąd zapisu "nowa data startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                  setTimeout(() => {this.zapisz_data_startu(--licznik, czas)}, 1500) 
                }
                
               },
      error => { 
                this.funkcje.addLiniaKomunikatu('Błąd połączenia "nowa data startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_data_startu(--licznik, czas)}, 1500) 
               }
               )      
    }
  }  
/* (end) czas startu Dedala */

/* (start) start/stop akcji na Dedalu */
private startstop: any;

getStartStop() {return this.startstop}

setStart()
      { 
      this.czas_rzeczywisty_start =  (moment()).format('YYYY-MM-DD HH:mm:ss');
      this.czas_rzeczywisty_end = '';
      this.funkcje.addLiniaKomunikatu('Użyto [START] czas','green');
      this.zapisz_startstop(5, 'START', this.czas_rzeczywisty_start, this.getCzasDedala()); 
      }

setStop()
      { 
      this.czas_rzeczywisty_end =  (moment()).format('YYYY-MM-DD HH:mm:ss');
      this.funkcje.addLiniaKomunikatu('Użyto [STOP] czas','red'); 
      this.zapisz_startstop(5, 'STOP', this.czas_rzeczywisty_end, this.getCzasDedala());
      }

private GetStartStop = new Subject();
GetStartStop$ = this.GetStartStop.asObservable()
changeStartStop(stan: any)
{
  this.startstop = stan;
  this.GetStartStop.next(this.startstop);
  switch (stan) {
    case 'START':
                  this.taktujUplyw();
                  this.taktujCzasDedala();  
                  this.taktujCzasOryginalnyDedala();
                  this.taktujDedalaUplyw();
                  break;
    case 'STOP': 
                  this.zatrzymajUplyw(); 
                  this.zatrzymajCzasDedala();
                  this.zatrzymajCzasOryginalnyDedala();
                  this.zatrzymajDedalaUplyw();
                  break;
  } 
}

private OdczytajStartStop = new Subject<any>();
OdczytajStartStop$ = this.OdczytajStartStop.asObservable()
private odczytaj_startstop(licznik : number)
  {
    if (licznik == 0) 
    {
      this.changeStartStop('STOP');
      this.OdczytajStartStop.next('STOP')
      this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "stanu akcji = stop" ','red');
    }
    else
    {
    this.http.get(this.komunikacja.getURL() + 'stan/').subscribe( 
      data =>  {
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true)
                {
                  if (wynik.stan == 'START')
                  {
                    this.funkcje.addLiniaKomunikatu('Parametry po Restarcie Aplikacji: "stan akcji": START','red')
                    this.czas_rzeczywisty_start = wynik.czas;
                    this.funkcje.addLiniaKomunikatu('Parametry po Restarcie Aplikacji: "czas startu akcji": ' + wynik.czas ,'red')
                    this.changeStartStop(wynik.stan);
                    this.OdczytajStartStop.next(wynik.stan);
                  }
                  else
                  {
                    this.changeStartStop(wynik.stan);
                    this.OdczytajStartStop.next(wynik.stan);
                    this.funkcje.addLiniaKomunikatu('Odczytano "stan akcji": STOP','')  
                  }
                }
                else
                {
                  this.changeStartStop('STOP');
                  this.OdczytajStartStop.next('STOP');
                  this.funkcje.addLiniaKomunikatu('Błąd odczytu "stan akcji = STOP" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                  setTimeout(() => {this.odczytaj_startstop(--licznik)}, 1000)  
                }
               },
      error => {
                this.changeStartStop('STOP');
                this.OdczytajStartStop.next('STOP');
                this.funkcje.addLiniaKomunikatu('Błąd połączenia "stan akcji = STOP" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_startstop(--licznik)}, 1000)
               }
               )      
    }
  }

  zapisz_startstop(licznik : number, stan: string, czas: string, czasD: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    var dane = JSON.stringify({ "stan": stan, "czas": czas, "zmiana": moment().format('YYYY-MM-DD HH:mm:ss'),"czasD" : czasD })  
    //console.log(dane)
   if (licznik == 0) 
    { this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "stan akcji" ','red'); }
    else
    {
    this.http.post(this.komunikacja.getURL() + 'stan/', dane, httpOptions).subscribe( 
      data =>  {
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                 {
                  this.changeStartStop(wynik.stan);
                  this.funkcje.addLiniaKomunikatu('Zapisano "stan akcji"','') 
                 } 
                 else
                 {
                  this.funkcje.addLiniaKomunikatu('Błąd zapisu "stan akcji" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                   setTimeout(() => {this.zapisz_startstop(--licznik, stan, czas, czasD)}, 1500)             
                 }        
               },
      error => { 
        //console.log(error)
                this.funkcje.addLiniaKomunikatu('Błąd połączenia "stan akcji" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_startstop(--licznik, stan, czas, czasD)}, 1500);
               }
               )      
    }
  }  
/* (end) start/stop akcji na Dedalu */


/* (start) czas rzeczywisty Dedala */
private czas_dedala_org: any;
private czas_dedala_org_new: any;
private czas_dedala_new: any;

changeCzasDedala(czas: any)
  {
    this.czas_dedala_new = czas;
    this.czas_dedala_ofset = moment(this.czas_dedala_new,"YYYY-MM-DD HH:mm:ss").diff(moment(moment(),"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
    this.czasRzeczywistyDedala.next( czas )
  }

private OdczytajCzasDedala = new Subject<any>();
OdczytajCzasDedala$ = this.OdczytajCzasDedala.asObservable()
private odczytaj_czas_dedala(licznik : number)
  {
    if (licznik == 0) 
    {
      this.czas_dedala_org = 'ERROR';
      this.changeCzasDedala(this.czas_dedala_org);
      this.OdczytajCzasDedala.next(this.czas_dedala_org);
      this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "czas startu akcji na Dedalu" ','red');
    }
    else
    {
    this.http.get(this.komunikacja.getURL() + 'dataakcji/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));
        //console.log(wynik)
        if (wynik.wynik == true) 
        {
          if (wynik.stan == 'START')
          {
            this.funkcje.addLiniaKomunikatu('Parametry po Restarcie Aplikacji: "czas startu akcji na Dedalu": ' + wynik.czasnew ,'red')
            this.czas_dedala_org = wynik.czasorg;
            this.OdczytajCzasDedala.next(wynik.czasorg);
            this.czas_dedala_ofset_org = moment(this.czas_dedala_org,"YYYY-MM-DD HH:mm:ss").diff(moment(this.czas_rzeczywisty_start,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
            this.czas_dedala_new = wynik.czasnew;
            this.czas_dedala_ofset = moment(this.czas_dedala_new,"YYYY-MM-DD HH:mm:ss").diff(moment(wynik.czasnewzmiana,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)  
          } 
          else
          {
          this.czas_dedala_org = wynik.czasorg;
          this.changeCzasDedala(wynik.czasorg);
          //this.czasRzeczywistyDedala.next( wynik.czas );
          this.czasOryginalnyDedala.next( wynik.czasorg)
          this.OdczytajCzasDedala.next(wynik.czasorg);
          this.funkcje.addLiniaKomunikatu('Odczytano "czas startu akcji na Dedalu": ' + wynik.czasorg ,'')
          }
        }
        else
        {
          this.czas_dedala_org = 'ponawiam';
          this.changeCzasDedala(this.czas_dedala_org);
          this.OdczytajCzasDedala.next(this.czas_dedala_org);
          this.funkcje.addLiniaKomunikatu('Błąd odczytu "czas startu akcji na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
          setTimeout(() => {this.odczytaj_czas_dedala(--licznik)}, 1000)
        }
                        
               },
      error => {
                this.czas_dedala_org = 'ponawiam';
                this.changeCzasDedala(this.czas_dedala_org);
                this.OdczytajCzasDedala.next(this.czas_dedala_org);
                this.funkcje.addLiniaKomunikatu('Błąd połączenia "czas startu akcji na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_czas_dedala(--licznik)}, 1000)
               }
               )      
    }
  }

  zapisz_data_akcji(licznik: number, czas: string )
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    var data = JSON.stringify({ "czas": czas, "zmiana": moment().format('YYYY-MM-DD HH:mm:ss')})  

   if (licznik == 0) 
    { this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "nowa data na Dedalu" ','red'); }
    else
    {
    this.http.post(this.komunikacja.getURL() + 'dataakcji/', data, httpOptions).subscribe( 
      data =>  {
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                this.changeCzasDedala( wynik.czas );
                this.funkcje.addLiniaKomunikatu('Zapisano "nowa data na Dedalu" - ' + wynik.czas ,'') 
              }
              else
              {
                this.funkcje.addLiniaKomunikatu('Błąd zapisu "nowa data na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_data_akcji(--licznik, czas)}, 1000) 
              }
                },
      error => { 
                this.funkcje.addLiniaKomunikatu('Błąd połączenia "nowa data na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_data_akcji(--licznik,czas)}, 1000) 
               }
               )      
    }
  }

/* (end) czas rzeczywisty Dedala */
}
