import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component,  OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CzasService } from '../czas.service';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service'; 
import { Linia, Nazwa, Wiersze } from '../definicje';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-testy',
  templateUrl: './testy.component.html',
  styleUrls: ['./testy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class TestyComponent implements OnInit {

  private informacjasubscribe = new Subscription();
  private testsubscribe = new Subscription();
  tablicazawartosci: Wiersze[] = [];  
  wskaznik: boolean = true;
  @ViewChild('scrollViewportDialog') VSVDialog!: CdkVirtualScrollViewport;
  private zakladkasubscribe = new Subscription();
  checked = true;
  height: any;
  width1: any;

  

    
  //@Input() : any;
  //@Output() raport = new EventEmitter<string>();
  
  constructor(private hostElement: ElementRef, private czasy: CzasService, private funkcje: FunkcjeWspolneService, private changeDetectorRef: ChangeDetectorRef, private all: AppComponent) 
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
            this.Wypelnij(start, ilosc, wiersze, 0)
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
            this.Wypelnij(start, ilosc, wiersze, 0)
            this.Testuj(start + 3, data.dane[0].czaswykonania, data.dane[0].czaswykonania )
          }
          else
          {

          }
          }
          if (this.checked) { this.Przewin() }
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
  if(this.zakladkasubscribe) {this.zakladkasubscribe.unsubscribe()};
  }


  Testuj(numer: number, czaswykonania: number, czas: number)
  {
    console.log(numer, czaswykonania, czas) 
    if (czas > 0)    
    {
      setTimeout(() => 
        {
        let procent = Math.round(czas * 100 / czaswykonania);
        console.log(procent) 
    
        this.tablicazawartosci[numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
        [
          this.funkcje.setNazwaLinia('',
                                    [
                                    this.funkcje.setTextNazwa(' ', procent.toString() ,'%',this.funkcje.getKolor().zalogowany,'')
                                    ],
                                    '')
        ],
                  '');
        this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
        this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
        this.changeDetectorRef.detectChanges();
        this.VSVDialog.checkViewportSize();
        czas = czas - 500;
        this.Testuj(numer, czaswykonania, czas)
          }, 5000);          
    }

  }

  Wypelnij(start: number, ilosc: number, wiersze: any, licznik: number)
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
        this.Wypelnij(start, ilosc, wiersze, ++licznik)
          }, 300);          
    }
    
  }

Pusta():Wiersze[]
{
  return  [this.funkcje.setLiniaWiersz('', '', '' , '', '',[ this.funkcje.setNazwaLinia('', [this.funkcje.setTextNazwa('','','','','')],'')],'')]
}

Test(data: any): Wiersze[]
  {
    let tablica: Wiersze[] = [];
      tablica = [...tablica, 
        this.funkcje.setLiniaWiersz('', '', '' , '    ZESPÓŁ:  ', '',
                          [
                            this.funkcje.setNazwaLinia('nazwa: ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].nazwa ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      ''),
                            this.funkcje.setNazwaLinia('    symbol: [ ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].symbol ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      ' ]')                                                          
                          ],
                                    '')
      ]; 
      tablica = [...tablica, 
        this.funkcje.setLiniaWiersz('', '', '' , '    MODUŁ:   ', '',
                          [
                            this.funkcje.setNazwaLinia('nazwa: ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].modulNazwa ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      ''),
                            this.funkcje.setNazwaLinia('    symbol: [ ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].modulSymbol ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      ' ]')                                                          
                          ],
                                    '')
      ]; 
      tablica = [...tablica, 
        this.funkcje.setLiniaWiersz('', '', '' , '    Badanie start: ', '',
                            [
                              this.funkcje.setNazwaLinia('',
                                                        [
                                                        this.funkcje.setTextNazwa(' ', this.czasy.getCzasDedala() ,' ',this.funkcje.getKolor().liniakomend,'')
                                                        ],
                                                        '')
                            ],
                                      '')
        ];
        tablica = [...tablica, 
          this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
                              [
                                this.funkcje.setNazwaLinia('',
                                                          [
                                                          this.funkcje.setTextNazwa(' ', '0' ,'%',this.funkcje.getKolor().zalogowany,'')
                                                          ],
                                                          '')
                              ],
                                        '')
          ];
          tablica = [...tablica, 
            this.funkcje.setLiniaWiersz('', '', '' , '    Wynik testu:  ', '',
                                [
                                  this.funkcje.setNazwaLinia(' ',
                                                            [
                                                            this.funkcje.setTextNazwa(' ', 'w trakcie badania' ,' ', this.funkcje.getKolor().zalogowany,'mrugaj')
                                                            ],
                                                            '')
                                ],
                                          '')
          ]; 
          tablica = [...tablica, 
            this.funkcje.setLiniaWiersz('', '', '' , '--- koniec danych ---', '',
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
      this.funkcje.setLiniaWiersz('', '', '' , '    Stan wyświetlony z dnia: ', '',
                          [
                            this.funkcje.setNazwaLinia('',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', this.czasy.getCzasDedala() ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      '')
                          ],
                                    '')
      ];
      tablica = [...tablica, 
        this.funkcje.setLiniaWiersz('', '', '' , '    ZESPÓŁ:  ', '',
                          [
                            this.funkcje.setNazwaLinia('nazwa: ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].nazwa ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      ''),
                            this.funkcje.setNazwaLinia('    symbol: [ ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].symbol ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      ' ]')                                                          
                          ],
                                    '')
      ]; 
      tablica = [...tablica, 
        this.funkcje.setLiniaWiersz('', '', '' , '    MODUŁ:   ', '',
                          [
                            this.funkcje.setNazwaLinia('nazwa: ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].modulNazwa ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      ''),
                            this.funkcje.setNazwaLinia('    symbol: [ ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].modulSymbol ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      ' ]')                                                          
                          ],
                                    '')
      ]; 
      tablica = [...tablica, 
      this.funkcje.setLiniaWiersz('', '', '' , '    Ostatni wykonany test:  ', '',
                          [
                            this.funkcje.setNazwaLinia('data: ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].czasbadania ,' ',this.funkcje.getKolor().liniakomend,'')
                                                      ],
                                                      ''),
                            this.funkcje.setNazwaLinia(' wykonał: ',
                                                      [
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].imie,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor'),
                                                      this.funkcje.setTextNazwa(' ', data.dane[0].nazwisko ,' ',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                                      ],
                                                      '')                                                          
                          ],
                                    '')
      ]; 
      tablica = [...tablica, 
        this.funkcje.setLiniaWiersz('', '', '' , '    Wynik testu:  ', '',
                            [
                              this.funkcje.setNazwaLinia(' ',
                                                        [
                                                        this.funkcje.setTextNazwa(' ', data.dane[0].stanText ,' ',(data.dane[0].stanNr == 1 ? this.funkcje.getKolor().info : this.funkcje.getKolor().alert),'')
                                                        ],
                                                        '')
                            ],
                                      '')
      ]; 
      tablica = [...tablica, 
        this.funkcje.setLiniaWiersz('', '', '' , '--- koniec danych ---', '',
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
