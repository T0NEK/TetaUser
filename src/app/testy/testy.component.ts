import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component,  OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CzasService } from '../czas.service';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service'; 
import { Wiersze, Zespol } from '../definicje';
import { AppComponent } from '../app.component';
import { TestyService } from '../testy.service';


@Component({
  selector: 'app-testy',
  templateUrl: './testy.component.html',
  styleUrls: ['./testy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class TestyComponent implements OnInit {

  private zakladkasubscribe = new Subscription();
  private informacjasubscribe = new Subscription();
  private testsubscribe = new Subscription();
  private resetsubscribe = new Subscription();
  private zapisztestsubscribe = new Subscription();
  tablicazawartosci: Wiersze[] = [];  
  wskaznik: boolean = true;
  @ViewChild('scrollViewportDialog') VSVDialog!: CdkVirtualScrollViewport;
  checked = true;
  height: any;
  width1: any;

  

    
  //@Input() : any;
  //@Output() raport = new EventEmitter<string>();
  
  constructor(private hostElement: ElementRef, private czasy: CzasService, private funkcje: FunkcjeWspolneService, private changeDetectorRef: ChangeDetectorRef, private all: AppComponent, private testy: TestyService) 
  {
    //this.height = (all.wysokoscAll - all.wysokoscInfo - all.wysokoscKlw - all.wysokoscLinia - all.wysokoscDialogMin - all.wysokoscPrzewijaj - 100) + 'px';
    this.height = (all.wysokoscNawigacja - all.wysokoscPrzewijaj - all.wysokoscNawigacjaNag ) + 'px';
    this.width1 = (all.szerokoscAll - all.szerokoscZalogowani - 10) + 'px';
    //console.log (all.wysokoscAll,'    ',all.wysokoscInfo,'    ',all.wysokoscKlw,'    ',all.wysokoscLinia,'    ',all.wysokoscDialogMin,'    ',all.wysokoscPrzewijaj)
    //console.log('konstruktor dialog')
    //console.log(this.VSVDialog._totalContentHeight);
    this.zakladkasubscribe = funkcje.ZakladkaDialogu$.subscribe
    (
       data =>
       {
          if (data == 3) { if (this.checked) { this.Przewin()} }

       }
    )
    this.informacjasubscribe = funkcje.DodajInformacje$.subscribe
    ( data => 
      { 
        //console.log('info')
        if (data.clear)
        {
          this.tablicazawartosci = [];
          changeDetectorRef.detectChanges();
          this.VSVDialog.checkViewportSize()
        }
        else
        {
          let wiersze: Wiersze[] = this.Informacja(data);
          let ilosc: number = wiersze.length; 
          if (this.wskaznik)
          {
            this.wskaznik = false;
            let start = this.tablicazawartosci.length;
            for (let index = 0; index < ilosc; index++) { this.tablicazawartosci = this.tablicazawartosci.concat() }  
            //console.log(this.tablicazawartosci);
            this.wskaznik = true;
            this.Wypelnij(start, ilosc, wiersze, 0, 0, 'info')
          }
          else
          {

          }
          }
          if (this.checked) { this.Przewin() }
      }
    );   

    this.testsubscribe = funkcje.DodajTest$.subscribe
    ( data => 
      { 
        //console.log('test')
        if (data.clear)
        {
          this.tablicazawartosci = [];
          changeDetectorRef.detectChanges();
          this.VSVDialog.checkViewportSize()
        }
        else
        {
          let wiersze: Wiersze[] = this.Test(data);
          let ilosc: number = wiersze.length; 
          if (this.wskaznik)
          {
            this.wskaznik = false;
            let start = this.tablicazawartosci.length;
            for (let index = 0; index < ilosc; index++) { this.tablicazawartosci = this.tablicazawartosci.concat() }  
            //console.log(this.tablicazawartosci);
            this.wskaznik = true;
            this.Wypelnij(start, ilosc, wiersze, 0, data, 'testy')
          }
          else
          {

          }
          }
          if (this.checked) { this.Przewin() }
      }
    );   

    this.testsubscribe = funkcje.DodajReset$.subscribe
    ( data => 
      { 
        //console.log('test')
        if (data.clear)
        {
          this.tablicazawartosci = [];
          changeDetectorRef.detectChanges();
          this.VSVDialog.checkViewportSize()
        }
        else
        {
          let wiersze: Wiersze[] = this.Reset(data);
          let ilosc: number = wiersze.length; 
          if (this.wskaznik)
          {
            this.wskaznik = false;
            let start = this.tablicazawartosci.length;
            for (let index = 0; index < ilosc; index++) { this.tablicazawartosci = this.tablicazawartosci.concat() }  
            //console.log(this.tablicazawartosci);
            this.wskaznik = true;
            this.Wypelnij(start, ilosc, wiersze, 0, data, 'reset')
          }
          else
          {

          }
          }
          if (this.checked) { this.Przewin() }
      }
    );   


    this.testsubscribe = testy.ZapiszTesty$.subscribe
    ( data => 
      { 
        if (data.wynik)
        {
          this.tablicazawartosci[data.numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
          [
            this.funkcje.setNazwaLinia('',
                                      [
                                      this.funkcje.setTextNazwa(' ', data.czasend ,'',this.funkcje.getKolor().zalogowany,'')
                                      ],
                                      '')
          ],
                    '');
          this.tablicazawartosci[data.numer + 1] = this.funkcje.setLiniaWiersz('', '', '' , '    Wynik testu:  ', '',
          [
            this.funkcje.setNazwaLinia(' ',
                                      [
                                      this.funkcje.setTextNazwa('', data.stanText ,'', (data.stanNr == 1 ? this.funkcje.getKolor().info : this.funkcje.getKolor().krytyczny),'')
                                      ],
                                      '')
          ],
                    '')
          this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
          this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
          this.changeDetectorRef.detectChanges();
          this.VSVDialog.checkViewportSize();
        }
        else
        {
          this.tablicazawartosci[data.numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
          [
            this.funkcje.setNazwaLinia('',
                                      [
                                      this.funkcje.setTextNazwa(' ', ' error' ,'',this.funkcje.getKolor().zalogowany,'')
                                      ],
                                      '')
          ],
                    '');
          this.tablicazawartosci[data.numer + 1] = this.funkcje.setLiniaWiersz('', '', '' , '    Wynik testu:  ', '',
                    [
                      this.funkcje.setNazwaLinia(' ',
                                                [
                                                this.funkcje.setTextNazwa('', data.error ,'', (data.stanNr == 1 ? this.funkcje.getKolor().info : this.funkcje.getKolor().krytyczny),'')
                                                ],
                                                '')
                    ],
                              '')
          this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
          this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
          this.changeDetectorRef.detectChanges();
          this.VSVDialog.checkViewportSize();
        }
        //console.log('test')
        
      }
    );   
  }
  
  onClick(kto: string)
  {// dla przewijaj
      this.funkcje.fokusLiniaDialogu('');
  }

  Przewijaj()
  {   
    if ((!this.checked)) { this.Przewin() }
  }

  Przewin()
  {
    let count = this.VSVDialog.getDataLength();
    this.changeDetectorRef.detectChanges();
    this.VSVDialog.checkViewportSize()
    this.VSVDialog.scrollToIndex((count), 'smooth'); 
  }


  ngOnInit() 
  {
    //console.log('onInit dialog') 
  }
  
  ngAfterViewInit()
  {
  //console.log('AV dialog')
    //this.tablicazawartosci = this.funkcje.getLinieDialogu(); 
    this.changeDetectorRef.detectChanges();
    this.VSVDialog.checkViewportSize()
  } 

  ngOnDestroy()
  {
  //console.log('dest dialog')
  if(this.informacjasubscribe) {this.informacjasubscribe.unsubscribe()};
  if(this.testsubscribe) {this.testsubscribe.unsubscribe()};
  if(this.resetsubscribe) {this.testsubscribe.unsubscribe()};
  if(this.zakladkasubscribe) {this.zakladkasubscribe.unsubscribe()};
  if(this.zapisztestsubscribe) {this.zapisztestsubscribe.unsubscribe()};
  }


  Random(min: number, max: number)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  Resetuj(numer: number, czaswykonania: number, procent: number, data: any, elementy: (number|string)[], skok: number)
  {
    console.log(procent, czaswykonania, skok, <number>elementy[0] ) 
    if (procent < data.dane[0].elementy)    
    {
      setTimeout(() => 
        {
        this.tablicazawartosci[numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Wykonuję: ', '',
        [
          this.funkcje.setNazwaLinia('',
                                    [
                                    this.funkcje.setTextNazwa(' ', this.czasy.formatUplyw(data.dane[0].czasbadania, this.czasy.getCzasDedala()) ,'',this.funkcje.getKolor().zalogowany,''),
                                    this.funkcje.setTextNazwa('', (elementy[1]).toString(), '' ,this.funkcje.getKolor().zalogowany,''),
                                    this.funkcje.setTextNazwa(' element nr: ', (<number>elementy[6]).toString(), '' ,this.funkcje.getKolor().zalogowany,'')
                                    ],
                                    '')
        ],
                  '');
        this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
        this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
        this.changeDetectorRef.detectChanges();
        this.VSVDialog.checkViewportSize();
        elementy[6] = <number>elementy[6] + 1;
        this.Resetuj(numer, czaswykonania, ++procent, data, elementy, skok)
          }, 500);          
    }
    else
    {
      this.tablicazawartosci[numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Wykonano:  ', '',
              [
                this.funkcje.setNazwaLinia(' ',
                                          [
                                          this.funkcje.setTextNazwa('', ' wysłano polecenie', '', this.funkcje.getKolor().info,''),
                                          this.funkcje.setTextNazwa('',' reset', '', this.funkcje.getKolor().liniakomend,'liniakomend kursor'),
                                          this.funkcje.setTextNazwa(' do ', (<number>elementy[6] -1).toString() ,' elementów', this.funkcje.getKolor().info,'')
                                          ],
                                          '')
              ],
            '')                
      this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
      this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
      this.changeDetectorRef.detectChanges();
      this.VSVDialog.checkViewportSize();
      //this.testy.ZapiszTest(this.funkcje.getZalogowany().zalogowany, data.dane[0].idmodul, data.dane[0].id, data.dane[0].czasbadania, this.czasy.getCzasDedala(), numer)
    }


  }


    Testuj(numer: number, czaswykonania: number, procent: number, data: any, elementy: (number|string)[], skok: number)
  {
    //console.log(procent, czaswykonania, skok, <number>elementy[0] ) 
    switch (procent) {
      case 0:    czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,70) ); break;
      case 12:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,50) ); break;
      case 17:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,60) ); break;
      case 32:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,80) ); break;
      case 42:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,70) ); break;
      case 57:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,60) ); break;
      case 64:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,80) ); break;
      case 74:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,70) ); break;
      case 80:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,60) ); break;
      case 89:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,90) ); break;
      case 97:   czaswykonania = Math.round( ((1*data.dane[0].stanNr) == 0 ? 1 : 2) * data.dane[0].czaswykonania * this.Random(1,100) ); break;
    }
    if (procent > skok)
    {
      skok = skok + <number>elementy[5]
      if  (<number>elementy[0] == 4) 
          {
          elementy[0] = 1; 
          elementy[6] = <number>elementy[6] + ( <number>elementy[6] == data.dane[0].elementy ?  0:1 );
          }
          else
          {
          elementy[0] = <number>elementy[0] + 1
          } ;
    }
    else
    if (<number>elementy[0] == 1)
    { elementy[0] = 2 }
    else
    if (<number>elementy[0] == 3)
    { elementy[0] = 4 }

    if (procent < 99)    
    {
      setTimeout(() => 
        {
        this.tablicazawartosci[numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
        [
          this.funkcje.setNazwaLinia('',
                                    [
                                    this.funkcje.setTextNazwa(' ', procent.toString() ,'%',this.funkcje.getKolor().zalogowany,''),
                                    this.funkcje.setTextNazwa('', (elementy[(<number>elementy[0])]).toString(), '' ,this.funkcje.getKolor().zalogowany,''),
                                    this.funkcje.setTextNazwa(' element nr: ', (<number>elementy[6]).toString(), '' ,this.funkcje.getKolor().zalogowany,'')
                                    ],
                                    '')
        ],
                  '');
        this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
        this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
        this.changeDetectorRef.detectChanges();
        this.VSVDialog.checkViewportSize();
        this.Testuj(numer, czaswykonania, ++procent, data, elementy, skok)
          }, czaswykonania);          
    }
    else
    {
      this.tablicazawartosci[numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
      [
        this.funkcje.setNazwaLinia('',
                                  [
                                  this.funkcje.setTextNazwa(' ', '99' ,'%',this.funkcje.getKolor().zalogowany,''),
                                  this.funkcje.setTextNazwa('', (elementy[4]).toString(), '' ,this.funkcje.getKolor().zalogowany,''),
                                  this.funkcje.setTextNazwa(' element nr: ', (<number>elementy[6]).toString(), '' ,this.funkcje.getKolor().zalogowany,'')
                                  ],
                                  '')
      ],
                '');
      this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
      this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
      this.changeDetectorRef.detectChanges();
      this.VSVDialog.checkViewportSize();
      //console.log('data')
      //console.log(data)
      this.testy.ZapiszTest(this.funkcje.getZalogowany().zalogowany, data.dane[0].idmodul, data.dane[0].id, data.dane[0].czasbadania, this.czasy.getCzasDedala(), numer)
    }

  }

  Wypelnij(start: number, ilosc: number, wiersze: any, licznik: number, data: any, rodzaj: string)
  {
    //console.log(start, ilosc, wiersze, licznik)
    if (licznik < ilosc)    
    {
      setTimeout(() => 
        {
        this.tablicazawartosci[start + licznik] = wiersze[licznik];
        this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
        this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
        this.changeDetectorRef.detectChanges();
        this.VSVDialog.checkViewportSize();
        if (this.checked) { this.Przewin() }
        this.Wypelnij(start, ilosc, wiersze, ++licznik, data, rodzaj)
          }, 300);          
    }
    else
    switch (rodzaj) {
      case 'info': break;
      case 'testy': this.Testuj(start + 3, 0, 0, data, [1, ' - wysyłam zapytanie', ' - czekam', ' - odbieram',' - analizuję element', Math.round ( 50 / data.dane[0].elementy), 1], 0); break;
      case 'reset':   data.dane[0].czasbadania = this.czasy.getCzasDedala();
                      this.Resetuj(start + 2, 0, 0, data, [1, ' - wysyłam reset', ' - czekam', ' - odbieram',' - analizuję', Math.round ( 50 / data.dane[0].elementy), 1], 0); 
                      break;
    } 
  }

Pusta():Wiersze[]
{
  return  [this.funkcje.setLiniaWiersz('', '', '' , '', '',[ this.funkcje.setNazwaLinia('', [this.funkcje.setTextNazwa('','',' ','','')],'')],'')]
}


Reset(data: any): Wiersze[]
  {
    let tablica: Wiersze[] = [];
    tablica = [...tablica, 
      this.funkcje.setLiniaWiersz('', '', '' , '--- start polecenie', '',
      [
        this.funkcje.setNazwaLinia('',
                                  [
                                  this.funkcje.setTextNazwa('', ' reset' ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor'),
                                  this.funkcje.setTextNazwa(' ', this.czasy.getCzasDedala() ,'', '','')
                                  ],
                                  '')
      ],
    ''), 
    this.funkcje.setLiniaWiersz('', '', '' , '', '',
      [
        this.funkcje.setNazwaLinia('    ZESPÓŁ:   ',
                                  [
                                  this.funkcje.setTextNazwa('', data.dane[0].nazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                  ],
                                  ''),
        this.funkcje.setNazwaLinia('  (symbol: ',
                                  [
                                  this.funkcje.setTextNazwa('', data.dane[0].symbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                  ],
                                  ')'),
        this.funkcje.setNazwaLinia('    MODUŁ:   ',
                                  [
                                  this.funkcje.setTextNazwa('', data.dane[0].modulNazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                  ],
                                  ''),
        this.funkcje.setNazwaLinia('  (symbol: ',
                                  [
                                  this.funkcje.setTextNazwa('', data.dane[0].modulSymbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                  ],
                                  ')')                                                          
      ],
    ''),
    this.funkcje.setLiniaWiersz('', '', '' , '    Wykonuję: ', '',
      [
        this.funkcje.setNazwaLinia('',
                                  [
                                  this.funkcje.setTextNazwa('', ' ' ,'',this.funkcje.getKolor().zalogowany,''),
                                  this.funkcje.setTextNazwa('', ' ', '' ,this.funkcje.getKolor().zalogowany,'')
                                  ],
                                  '')
      ],
    ''), 
    this.funkcje.setLiniaWiersz('', '', '' , '--- koniec', '',
      [
        this.funkcje.setNazwaLinia('',
                                  [
                                  this.funkcje.setTextNazwa('', '' ,'','','')
                                  ],
                                  '')
      ],
                '')
      ];        
  return tablica            
  }



Test(data: any): Wiersze[]
  {
    let tablica: Wiersze[] = [];
    let czasstart = this.czasy.getCzasDedala();
    data.dane[0].czasbadania = czasstart;
    tablica = [...tablica, 
      this.funkcje.setLiniaWiersz('', '', '' , '--- start polecenie', '',
            [
              this.funkcje.setNazwaLinia('',
                                        [
                                        this.funkcje.setTextNazwa('', ' test' ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor'),
                                        this.funkcje.setTextNazwa(' ', this.czasy.getCzasDedala() ,'', '','')
                                        ],
                                        '')
            ],
      ''), 
      this.funkcje.setLiniaWiersz('', '', '' , '', '',
            [
              this.funkcje.setNazwaLinia('    ZESPÓŁ:   ',
                                        [
                                        this.funkcje.setTextNazwa('', data.dane[0].nazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                        ],
                                        ''),
              this.funkcje.setNazwaLinia('  (symbol: ',
                                        [
                                        this.funkcje.setTextNazwa('', data.dane[0].symbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                        ],
                                        ')'),
              this.funkcje.setNazwaLinia('    MODUŁ:   ',
                                        [
                                        this.funkcje.setTextNazwa('', data.dane[0].modulNazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                        ],
                                        ''),
              this.funkcje.setNazwaLinia('  (symbol: ',
                                        [
                                        this.funkcje.setTextNazwa('', data.dane[0].modulSymbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                        ],
                                        ')')                                                          
            ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '    Badanie start: ', '',
          [
            this.funkcje.setNazwaLinia('',
                                      [
                                      this.funkcje.setTextNazwa('', czasstart ,'',this.funkcje.getKolor().liniakomend,'')
                                      ],
                                      '')
          ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
          [
            this.funkcje.setNazwaLinia('',
              [
              this.funkcje.setTextNazwa(' ', '0' ,'%',this.funkcje.getKolor().zalogowany,''),
              this.funkcje.setTextNazwa('', ' - wysyłam zapytanie', '' ,this.funkcje.getKolor().zalogowany,''),
              this.funkcje.setTextNazwa(' element nr: ', '1', '' ,this.funkcje.getKolor().zalogowany,'')
              ],
              '')
          ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '    Wynik testu:  ', '',
          [
            this.funkcje.setNazwaLinia(' ',
                                      [
                                      this.funkcje.setTextNazwa('', 'w trakcie badania' ,'', this.funkcje.getKolor().zalogowany,'mrugaj')
                                      ],
                                      '')
          ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '--- koniec ', '',
          [
            this.funkcje.setNazwaLinia('',
                                      [
                                      this.funkcje.setTextNazwa('', '' ,'','','')
                                      ],
                                      '')
          ],
      '')
              ];        
  return tablica            
  }



Informacja(data: any): Wiersze[]
  {
    let tablica: Wiersze[] = [];
      tablica = [...tablica, 
      this.funkcje.setLiniaWiersz('', '', '' , '--- start polecenie', '',
            [
              this.funkcje.setNazwaLinia('',
                                        [
                                        this.funkcje.setTextNazwa('', ' zespół' ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor'),
                                        this.funkcje.setTextNazwa(' ', this.czasy.getCzasDedala() ,'', '','')
                                        ],
                                        '')
            ],
      ''), 
      this.funkcje.setLiniaWiersz('', '', '' , '', '',
            [
              this.funkcje.setNazwaLinia('    ZESPÓŁ:   ',
                                        [
                                        this.funkcje.setTextNazwa('', data.dane[0].nazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                        ],
                                        ''),
              this.funkcje.setNazwaLinia('  (symbol: ',
                                        [
                                        this.funkcje.setTextNazwa('', data.dane[0].symbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                        ],
                                        ')'),
              this.funkcje.setNazwaLinia('    MODUŁ:   ',
                                        [
                                        this.funkcje.setTextNazwa('', data.dane[0].modulNazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                        ],
                                        ''),
              this.funkcje.setNazwaLinia('  (symbol: ',
                                        [
                                        this.funkcje.setTextNazwa('', data.dane[0].modulSymbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                        ],
                                        ')')                                                          
            ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '', '',
            [
              this.funkcje.setNazwaLinia('    Ostatni wykonany test z dnia: ',
                                        [
                                        this.funkcje.setTextNazwa('', data.dane[0].czaszakonczenia ,'',this.funkcje.getKolor().liniakomend,'')
                                        ],
                                        ''),
              
              this.funkcje.setNazwaLinia('    Wykonał: ',
                                          [
                                          this.funkcje.setTextNazwa('', data.dane[0].imie,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor'),
                                          this.funkcje.setTextNazwa('', ' ','',this.funkcje.getKolor().liniakomend,''),
                                          this.funkcje.setTextNazwa('', data.dane[0].nazwisko ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                          ],
                                          '')                                                          
              ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '', '',
          [
            this.funkcje.setNazwaLinia('    Wynik testu:  ',
                                      [
                                      this.funkcje.setTextNazwa('', data.dane[0].stanText ,'',(data.dane[0].stanNr == 1 ? this.funkcje.getKolor().info : this.funkcje.getKolor().alert),'')
                                      ],
                                      '')
          ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '--- koniec', '',
          [
            this.funkcje.setNazwaLinia('',
                                      [
                                      this.funkcje.setTextNazwa('', '' ,'','','')
                                      ],
                                      '')
          ],
      '')
          ];
  return tablica            
  }


  
}
