import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import { KomunikacjaService } from './komunikacja.service';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { OsobyService } from './osoby.service';
import { Sprawdz } from './definicje'

@Injectable({
  providedIn: 'root'
})




export class CzasService implements OnDestroy
{

    
  constructor(private http: HttpClient, @Inject(LOCALE_ID) private locate : string, private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService, private osoby: OsobyService) 
  {
  //console.log('czas con');
  this.funkcje.addLiniaKomunikatu('Uruchomiono terminal ','');
  setTimeout(() => {
      this.funkcje.addLiniaKomunikatu('Łączę z serwerem', '');
      setTimeout(() => {
        this.komunikacja.StartKomunikacja();
        this.PetlaStart();  
        }, 500);
      }, 500);
  
  }
  
 
  ngOnDestroy() 
  {
    if (this.czas_rzeczywisty_Dedala_id) { clearInterval(this.czas_rzeczywisty_Dedala_id); }
    if (this.czas_rzeczywisty_start_id) { clearInterval(this.czas_rzeczywisty_start_id); }
    if (this.czas_uplyw_dedala_id) { clearInterval(this.czas_uplyw_dedala_id); }
    
  }

  /* (start) Pętla główna sprawdzająca stan */
private stanAkcjiBlad = 1;
private tablica_sprawdzajaca: Sprawdz = 
{ 
  stanSQL: false,
  stanAkcji: false,
  stanRejestracja: false,
  stanCzasStartuDedal: false,
  stanCzasDedala: false,
}; 
PetlaStart()
{
  console.log('pętla  ', this.tablica_sprawdzajaca)
  if (this.tablica_sprawdzajaca.stanSQL)
    {
      if (this.tablica_sprawdzajaca.stanRejestracja)
      {
        if (this.tablica_sprawdzajaca.stanCzasDedala && this.tablica_sprawdzajaca.stanCzasStartuDedal) 
        {
          if (this.tablica_sprawdzajaca.stanAkcji)
          {
            if (this.getStanAkcji() == 'STOP')
            {
              this.funkcje.addLiniaKomunikatu('Oczekuję na dane', 'rgb(199, 100, 43)');
              setTimeout(()=> { this.PetlaStart() },2000)
            }
            else
            {
              this.funkcje.addLiniaKomunikatu('Start', 'rgb(199, 100, 43)');
            }
          }
          else
          {
          this.stanAkcji();  
          setTimeout(()=> { this.PetlaStart() },1000)
          }
        }
        else
        {
          if ((this.getCzasDedala() == 'error')&&(this.getCzasStartuDedal() == 'error')) {
                              this.funkcje.addLiniaKomunikatu('Błąd odczytu c1', 'rgb(199, 100, 43)');
                              this.funkcje.addLiniaKomunikatu('Błąd odczytu c2', 'rgb(199, 100, 43)');
                              this.funkcje.addLiniaKomunikatu('Błąd krytyczny - terminal stop', 'red');
                              }
          else if (this.getCzasDedala() == 'error') {
                              this.funkcje.addLiniaKomunikatu('Błąd odczytu c1', 'rgb(199, 100, 43)');
                              this.funkcje.addLiniaKomunikatu('Błąd krytyczny - terminal stop', 'red');
                              }
          else if (this.getCzasStartuDedal() == 'error') {
                              this.funkcje.addLiniaKomunikatu('Błąd odczytu c2', 'rgb(199, 100, 43)');
                              this.funkcje.addLiniaKomunikatu('Błąd krytyczny - terminal stop', 'red');
                              }  
          else { setTimeout(()=> { this.PetlaStart() },1000) }                    
        }
      }
      else
      {
        switch (this.komunikacja.getHostId()) {
          case 'error': this.funkcje.addLiniaKomunikatu('Błąd rejestracji terminala - odmowa dostepu', 'red');
                        this.funkcje.addLiniaKomunikatu('Błąd krytyczny - terminal stop', 'red');
                        break;
          case '':      this.funkcje.addLiniaKomunikatu('Ponawiam rejestrację terminala w systemie', 'rgb(199, 100, 43)');
                        setTimeout(()=> { this.PetlaStart() },1000)      
                        break;                      
          default:      this.funkcje.addLiniaKomunikatu('Zarejestrowano terminal w systemie', '');
                        setTimeout(() => {
                          this.funkcje.addLiniaKomunikatu('Synchronizuję czas', '');  
                          setTimeout(() => {
                          this.funkcje.addLiniaKomunikatu('Odczytuję dane', '');
                          this.tablica_sprawdzajaca.stanRejestracja = true  
                          this.odczytaj_czas_startu_dedal(5);
                          this.odczytaj_czas_dedala(5);
                          setTimeout(()=> { this.PetlaStart() },500); 
                          }, 500);
                        }, 500);
                        
                        break;
        }
      }
    }
    else
    {
      switch (this.komunikacja.getURL()) {
        case 'error': this.funkcje.addLiniaKomunikatu('Sprawdzono połączenie z serwerem - brak komunikacji', 'red');
                      break;
        case '':      this.funkcje.addLiniaKomunikatu('Ponawiam połączenie z serwerem', 'rgb(199, 100, 43)');
                      setTimeout(()=> { this.PetlaStart() },1500)          
                      break;                      
        default:      this.funkcje.addLiniaKomunikatu('Uzyskano połączenie z serwerem', '');
                      setTimeout(() => {
                        this.funkcje.addLiniaKomunikatu('Rejestruję terminal w systemie', '');
                        this.tablica_sprawdzajaca.stanSQL = true;
                        setTimeout(()=> { this.PetlaStart() },500);          
                      }, 500);                      
                      break;
        }
    
    }
}
/* (end) Pętla główna sprawdzająca stan */


/* (start) czas startu Dedala */
private czas_startu_dedal: any;

getCzasStartuDedal(){ return this.czas_startu_dedal}


private czasStartuDedal = new Subject<any>();
czasStartuDedal$ = this.czasStartuDedal.asObservable()
private odczytaj_czas_startu_dedal(licznik : number)
{
  if (licznik == 0) 
  {
    this.czas_startu_dedal = 'error';
    this.czasStartuDedal.next(this.czas_startu_dedal);
    this.tablica_sprawdzajaca.stanCzasStartuDedal = false;
  }
  else
  {
  this.http.get(this.komunikacja.getURL() + 'datastartu/').subscribe( 
    data =>  {
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true)
              {
                  this.czas_startu_dedal = wynik.czasnew
                  this.czasStartuDedal.next(this.czas_startu_dedal);
                  this.tablica_sprawdzajaca.stanCzasStartuDedal = true;
              }
              else
              {
                this.czas_startu_dedal = 'error';
                this.tablica_sprawdzajaca.stanCzasStartuDedal = false;
                this.czasStartuDedal.next(this.czas_startu_dedal);
                setTimeout(() => {this.odczytaj_czas_startu_dedal(--licznik)}, 1000)
              }
              },
    error => {
      this.czas_startu_dedal = 'error';
      this.tablica_sprawdzajaca.stanCzasStartuDedal = false;
      this.czasStartuDedal.next(this.czas_startu_dedal);
      setTimeout(() => {this.odczytaj_czas_startu_dedal(--licznik)}, 1000)
             }
             )      
  }
}
/* (end) czas startu Dedala */

/* (start) czas rzeczywisty Dedala */
private czas_dedala: any;

changeCzasDedala(czas: any)
  {
    this.czas_dedala = czas;
    this.czas_dedala_ofset = moment(this.czas_dedala,"YYYY-MM-DD HH:mm:ss").diff(moment(moment(),"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
    this.czasRzeczywistyDedala.next( czas )
  }

private OdczytajCzasDedala = new Subject<any>();
OdczytajCzasDedala$ = this.OdczytajCzasDedala.asObservable()
private odczytaj_czas_dedala(licznik : number)
  {
    if (licznik == 0) 
    {
      this.czas_dedala = 'error';
      this.changeCzasDedala(this.czas_dedala);
      this.OdczytajCzasDedala.next(this.czas_dedala);
      this.tablica_sprawdzajaca.stanCzasDedala = false;
    }
    else
    {
    this.http.get(this.komunikacja.getURL() + 'dataakcji/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));
        //console.log(wynik)
        if (wynik.wynik == true) 
        {
          this.czas_dedala = wynik.czasnew;
          this.changeCzasDedala(this.czas_dedala);
          this.czasRzeczywistyDedala.next( this.czas_dedala );
          this.OdczytajCzasDedala.next(this.czas_dedala);
          this.tablica_sprawdzajaca.stanCzasDedala = true;        
        }
        else
        {
          this.tablica_sprawdzajaca.stanCzasDedala = false;
          setTimeout(() => {this.odczytaj_czas_dedala(--licznik)}, 1000)
        }
                        
               },
      error => {
                this.tablica_sprawdzajaca.stanCzasDedala = false;
                setTimeout(() => {this.odczytaj_czas_dedala(--licznik)}, 1000)
               }
               )      
    }
  }
/* (end) czas rzeczywisty Dedala */


/* (start) stan akcji */
//private stanStartStop = '';

//getStanAkcji(){ return this.stanStartStop}
private stan_akcji: any;

getStanAkcji(){ return this.stan_akcji}

//private OdczytajStanAkcji = new Subject<any>();
//OdczytajStanAkcji$ = this.OdczytajStanAkcji.asObservable()
stanAkcji()
  {
    this.http.get(this.komunikacja.getURL() + 'stan/').subscribe( 
      data =>  {
                let wynik = JSON.parse(JSON.stringify(data));
                console.log('Stan akcji', wynik)
                if (wynik.wynik == true)
                {
                  if (wynik.stan == 'START')
                  {
                    this.tablica_sprawdzajaca.stanAkcji = true;  
                    this.stan_akcji = 'START'
                  }
                  else
                  {
                    this.tablica_sprawdzajaca.stanAkcji = true;
                    this.stan_akcji = 'STOP'
                  }
                setTimeout(() => {this.stanAkcji()}, 1000)             
                }
                else
                {
                  this.tablica_sprawdzajaca.stanAkcji = false;
                  setTimeout(() => {this.stanAkcji()}, 1000)           
                }
               },
      error => {
                this.tablica_sprawdzajaca.stanAkcji = false;
                setTimeout(() => {this.stanAkcji()}, 1000)           
               }
               )      
}
/* (end) stan akcji */






























/* (start) czas rzeczywisty Dedala */
private czas_dedala_ofset: any;
private czas_dedala_ofset_korekta: any;
private czas_rzeczywisty_Dedala_id: any;

getCzasDedala() { return this.czas_dedala};

private czasRzeczywistyDedala = new Subject<any>();
czasRzeczywistyDedala$ = this.czasRzeczywistyDedala.asObservable();
taktujCzasDedala() { 
      this.czas_dedala_ofset = moment(this.czas_dedala,"YYYY-MM-DD HH:mm:ss").diff(moment(this.czas_rzeczywisty_start,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
     
      this.czas_rzeczywisty_Dedala_id = setInterval(() => 
      {    
       let czas = moment().add(this.czas_dedala_ofset,'milliseconds')
       this.czas_dedala = moment(czas).format('YYYY-MM-DD HH:mm:ss');
        this.czasRzeczywistyDedala.next( this.czas_dedala)
      }, 1000); 
      
    }

zatrzymajCzasDedala()
    {
      if (this.czas_rzeczywisty_Dedala_id) { clearInterval(this.czas_rzeczywisty_Dedala_id); }
    }

/* (end) czas rzeczywisty Dedala*/


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
  this.czasDedalaUplyw.next(this.formatUplyw(this.getCzasStartuDedal(), this.getCzasDedala()));
  this.czas_uplyw_dedala_id = setInterval(() => 
    {
      this.czasDedalaUplyw.next(this.formatUplyw(this.getCzasStartuDedal(), this.getCzasDedala()))
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


/* (start) start/stop akcji na Dedalu */
private startstop: any;

getStartStop() {return this.startstop}

setStart()
      { 
      this.czas_rzeczywisty_start =  (moment()).format('YYYY-MM-DD HH:mm:ss');
      this.czas_rzeczywisty_end = '';
      this.funkcje.addLiniaKomunikatu('Użyto [START] czas','green');
      }

setStop()
      { 
      this.czas_rzeczywisty_end =  (moment()).format('YYYY-MM-DD HH:mm:ss');
      this.funkcje.addLiniaKomunikatu('Użyto [STOP] czas','red'); 
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
                  this.taktujDedalaUplyw();
                  break;
    case 'STOP': 
                  this.zatrzymajUplyw(); 
                  this.zatrzymajCzasDedala();
                  this.zatrzymajDedalaUplyw();
                  break;
  } 
}
/* (end) start/stop akcji na Dedalu */



}
