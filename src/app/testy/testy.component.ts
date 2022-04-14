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
  private resetwykonajsubscribe = new Subscription();
  private naprawasubscribe = new Subscription();
  private naprawawykonajsubscribe = new Subscription();
  private zapisztestsubscribe = new Subscription();
  tablicazawartosci: Wiersze[] = [];  
  wskaznik: boolean = true;
  @ViewChild('scrollViewportDialog') VSVDialog!: CdkVirtualScrollViewport;
  checked = true;
  height: any;
  width1: any;
  private nrtestu: number = 41433;

  

    
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
          this.nrtestu = this.nrtestu + this.Random(1,7);
          let nrtestu = this.nrtestu ;
          let wiersze: Wiersze[] = this.Test(data, nrtestu);
          let ilosc: number = wiersze.length; 
          if (this.wskaznik)
          {
            this.wskaznik = false;
            let start = this.tablicazawartosci.length;
            for (let index = 0; index < ilosc; index++) { this.tablicazawartosci = this.tablicazawartosci.concat() }  
            //console.log(this.tablicazawartosci);
            this.wskaznik = true;
            this.Wypelnij(start, ilosc, wiersze, 0, data, 'testy', nrtestu )
          }
          else
          {

          }
          }
          if (this.checked) { this.Przewin() }
      }
    );   

    this.resetsubscribe = funkcje.DodajReset$.subscribe
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

    this.resetwykonajsubscribe = testy.WykonajReset$.subscribe
    ( data => 
      { 
        //console.log(data)
        if (data.kierunek == 'start')
        {
        if (data.wynik)
        {
          if (data.stan)
          {
            //console.log(data.dane.dane[0])
            data.dane.dane[0].czasbadania = this.czasy.getCzasDedala();
            this.Resetuj(data.start + 2, 0, 0, data.dane, [1, ' - wysyłam reset', ' - czekam', ' - odbieram',' - analizuję', Math.round ( 50 / data.dane.dane[0].elementy), 1], 0); 
            setTimeout(() => 
              {
                this.testy.ResetStop(this.funkcje.getZalogowany().zalogowany, data.dane.dane[0].idmodul, data.dane.dane[0].id, data.resetkod)
              }, 1000 * data.dane.dane[0].czasreset);
          }
          else
          {
            this.Bad1(data.start + 2, 0, 0, data.dane, [1, ' - wysyłam reset', ' - czekam', ' - odbieram',' - analizuję', Math.round ( 50 / data.dane.dane[0].elementy), 1], 0, 'resetuj'); 
          }
        
        } 
        else
        {
          this.Bad2(data.start + 2, 0, 0, data.dane, [1, ' - wysyłam reset', ' - czekam', ' - odbieram',' - analizuję', Math.round ( 50 / data.dane.dane[0].elementy), 1], 0, 'resetuj'); 
        }
        }
        else
        {// 'end'

        }
      }
    );   

    this.naprawasubscribe = funkcje.DodajNaprawa$.subscribe
    ( data => 
      { 
        console.log('naprawa')
        if (data.clear)
        {
          this.tablicazawartosci = [];
          changeDetectorRef.detectChanges();
          this.VSVDialog.checkViewportSize()
        }
        else
        {
          let wiersze: Wiersze[] = this.Naprawa(data);
          let ilosc: number = wiersze.length; 
          if (this.wskaznik)
          {
            this.wskaznik = false;
            let start = this.tablicazawartosci.length;
            for (let index = 0; index < ilosc; index++) { this.tablicazawartosci = this.tablicazawartosci.concat() }  
            //console.log(this.tablicazawartosci);
            this.wskaznik = true;
            this.Wypelnij(start, ilosc, wiersze, 0, data, 'naprawa')
          }
          else
          {

          }
          }
          if (this.checked) { this.Przewin() }
      }
    );   

    this.naprawawykonajsubscribe = testy.WykonajNaprawa$.subscribe
    ( data => 
      { 
        console.log(data)
        if (data.kierunek == 'start')
        {
        if (data.wynik)
        {
          if (data.stan)
          {
            console.log(data.dane.dane[0])
            data.dane.dane[0].czasbadania = this.czasy.getCzasDedala();
            this.Naprawiaj(data.start + 2, 0, 0, data.dane, [1, ' - wysyłam naprawa', ' - czekam', ' - odbieram',' - analizuję', Math.round ( 50 / data.dane.dane[0].elementy), 1], 0); 
            setTimeout(() => 
              {
                this.testy.NaprawaStop(this.funkcje.getZalogowany().zalogowany, data.dane.dane[0].idmodul, data.dane.dane[0].id, data.naprawakod)
              }, 1000 * data.dane.dane[0].czasnaprawa);
          }
          else
          {
            this.Bad1(data.start + 2, 0, 0, data.dane, [1, ' - wysyłam naprawa', ' - czekam', ' - odbieram',' - analizuję', Math.round ( 50 / data.dane.dane[0].elementy), 1], 0, 'napraw'); 
          }
        
        } 
        else
        {
          this.Bad2(data.start + 2, 0, 0, data.dane, [1, ' - wysyłam naprawa', ' - czekam', ' - odbieram',' - analizuję', Math.round ( 50 / data.dane.dane[0].elementy), 1], 0, 'napraw'); 
        }
        }
        else
        {// 'end'

        }
      }
    );   


    this.testsubscribe = testy.ZapiszTesty$.subscribe
    ( data => 
      { 
        //console.log(data)
        if (data.wynik)
        {
          this.tablicazawartosci[data.numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
          [
            this.funkcje.setNazwaLinia('',
                                      [
                                      this.funkcje.setTextNazwa(' ', data.czasend.toString() ,'',this.funkcje.getKolor().zalogowany,'')
                                      ],
                                      '')
          ],
                    '');
          this.tablicazawartosci[data.numer + 1] = this.funkcje.setLiniaWiersz('', '', '' , '    Wynik testu:  ', '',
          [
            this.funkcje.setNazwaLinia(' wykryto ',
                                      [
                                      this.funkcje.setTextNazwa('', data.ilosc.toString() ,' ', (data.ilosc == 0 ? this.funkcje.getKolor().info : this.funkcje.getKolor().krytyczny),'')
                                      ],
                                      (data.ilosc == 0 ? ' problemów' : (data.ilosc == 1 ? ' problem' : (data.ilosc == 2 ? 'problemy' : (data.ilosc == 3 ? 'problemy' : (data.ilosc == 4 ? 'problemy' : 'problemów'))))))
          ],
                    '')
          if (data.ilosc != 0)
          {
          this.tablicazawartosci = [...this.tablicazawartosci,
                    this.funkcje.setLiniaWiersz('', '', '' , '----- wyniki testu nr : ', '',
                    [
                      this.funkcje.setNazwaLinia('',
                                                [
                                                this.funkcje.setTextNazwa('', data.nrtestu.toString(16) ,'',this.funkcje.getKolor().liniakomend,'')
                                                ],
                                                '')
                    ],
                '')];
          for (let index = 0; index < data.ilosc; index++) 
          {
            this.tablicazawartosci = [...this.tablicazawartosci,
            this.funkcje.setLiniaWiersz('', '', '' , '       problem nr ', '',
              [
                this.funkcje.setNazwaLinia((index + 1).toString(),
                                          [
                                          this.funkcje.setTextNazwa(': ', data.uszkodzenia[index].nazwa ,' ', '', ''),
                                          this.funkcje.setTextNazwa(' - ', data.uszkodzenia[index].stanText ,';', (data.stan == 1 ? this.funkcje.getKolor().krytyczny : this.funkcje.getKolor().alert),'')
                                          ],
                                          '')
              ],
           '') ]
          }  
          this.tablicazawartosci = [...this.tablicazawartosci,
          this.funkcje.setLiniaWiersz('', '', '' , '----- koniec', '',
                [
                  this.funkcje.setNazwaLinia('',
                                            [
                                            this.funkcje.setTextNazwa('', '' ,'','','')
                                            ],
                                            '')
                ],
                '')]
          }  
          this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
          this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
          this.changeDetectorRef.detectChanges();
          this.VSVDialog.checkViewportSize();
          if (this.checked) { this.Przewin() }
            
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
                                                this.funkcje.setTextNazwa('', data.komunikat ,'', this.funkcje.getKolor().alert,'')
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
  if(this.resetsubscribe) {this.resetsubscribe.unsubscribe()};
  if(this.resetwykonajsubscribe) {this.resetwykonajsubscribe.unsubscribe()};
  if(this.naprawasubscribe) {this.naprawasubscribe.unsubscribe()};
  if(this.naprawawykonajsubscribe) {this.naprawawykonajsubscribe.unsubscribe()};
  if(this.zakladkasubscribe) {this.zakladkasubscribe.unsubscribe()};
  if(this.zapisztestsubscribe) {this.zapisztestsubscribe.unsubscribe()};
  }


  Random(min: number, max: number)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  Naprawiaj(numer: number, czaswykonania: number, procent: number, data: any, elementy: (number|string)[], skok: number)
  {
    //console.log(procent, czaswykonania, skok, <number>elementy[0] ) 
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
        this.Naprawiaj(numer, czaswykonania, ++procent, data, elementy, skok)
          }, 500);          
    }
    else
    {
      this.tablicazawartosci[numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Wykonano:  ', '',
              [
                this.funkcje.setNazwaLinia(' ',
                                          [
                                          this.funkcje.setTextNazwa('', ' wysłano polecenie', '', this.funkcje.getKolor().info,''),
                                          this.funkcje.setTextNazwa('',' naprawa', '', this.funkcje.getKolor().liniakomend,'liniakomend kursor'),
                                          this.funkcje.setTextNazwa(' do ', (<number>elementy[6] -1).toString() ,' elementów', this.funkcje.getKolor().info,''),
                                          this.funkcje.setTextNazwa('', ', czas naprawy - około: ' ,'', this.funkcje.getKolor().info,''),
                                          this.funkcje.setTextNazwa('',data.dane[0].czasnaprawa, ' s', this.funkcje.getKolor().liniakomend,''),
                                          ],
                                          '')
              ],
            '')                
      this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
      this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
      this.changeDetectorRef.detectChanges();
      this.VSVDialog.checkViewportSize();
    }
  }


  
Bad1(numer: number, czaswykonania: number, procent: number, data: any, elementy: (number|string)[], skok: number, polecenie: string)
  {
    {
      this.tablicazawartosci[numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Wykonano:  ', '',
              [
                this.funkcje.setNazwaLinia(' ',
                                          [
                                          this.funkcje.setTextNazwa('', ' problem z wysłaniem polecenia', '', this.funkcje.getKolor().info,''),
                                          this.funkcje.setTextNazwa('', polecenie, '', this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                          ],
                                          '')
              ],
            '')                
      this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
      this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
      this.changeDetectorRef.detectChanges();
      this.VSVDialog.checkViewportSize();
    }
  }

Bad2(numer: number, czaswykonania: number, procent: number, data: any, elementy: (number|string)[], skok: number, polecenie: string)
  {
    {
      this.tablicazawartosci[numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Wykonano:  ', '',
              [
                this.funkcje.setNazwaLinia(' ',
                                          [
                                          this.funkcje.setTextNazwa('', ' problem z wysłaniem polecenia', '', this.funkcje.getKolor().info,''),
                                          this.funkcje.setTextNazwa(' ', polecenie, '', this.funkcje.getKolor().liniakomend,'liniakomend kursor'),
                                          this.funkcje.setTextNazwa('', ' brak odpowiedzi zespołu', '', this.funkcje.getKolor().info,'')
                                          ],
                                          '')
              ],
            '')                
      this.tablicazawartosci = this.tablicazawartosci.concat(this.Pusta())
      this.tablicazawartosci.splice(this.tablicazawartosci.length-1,1)
      this.changeDetectorRef.detectChanges();
      this.VSVDialog.checkViewportSize();
    }
  }






  Resetuj(numer: number, czaswykonania: number, procent: number, data: any, elementy: (number|string)[], skok: number)
  {
    //console.log(procent, czaswykonania, skok, <number>elementy[0] ) 
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
    }
  }

  
    Testuj(numer: number, czaswykonania: number, procent: number, data: any, elementy: (number|string)[], skok: number, nrtestu: number, uplyw: number)
  {
    //console.log(procent, czaswykonania, skok, <number>elementy[0] ) 
    //console.log(data)
    switch (procent) {
      case 0:    czaswykonania = Math.round( ((100 * data.dane[0].czaswykonania) / 1000) * this.Random(1,10) ); break;
      case 12:   uplyw = uplyw + 12 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 880 ) * this.Random(1,9) ); break;
      case 17:   uplyw = uplyw + 5 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 830 ) * this.Random(1,11) ); break;
      case 32:   uplyw = uplyw + 15 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 680 ) * this.Random(1,8) ); break;
      case 42:   uplyw = uplyw + 10 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 580 ) * this.Random(1,12) ); break;
      case 57:   uplyw = uplyw + 15 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 430 ) * this.Random(1,10) ); break;
      case 64:   uplyw = uplyw + 7 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 360 ) * this.Random(1,8) ); break;
      case 74:   uplyw = uplyw + 10 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 260 ) * this.Random(1,12) ); break;
      case 80:   uplyw = uplyw + 6 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 200 ) * this.Random(1,12) ); break;
      case 89:   uplyw = uplyw + 9 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 110 ) * this.Random(1,8) ); break;
      case 97:   uplyw = uplyw + 8 * czaswykonania; czaswykonania = Math.round( ((1000 * data.dane[0].czaswykonania - uplyw) / 30 ) * this.Random(1,10) ); break;
    }
    
    if (procent > skok)
    {
      skok = skok + procent * <number>elementy[5]
      if  (<number>elementy[0] == 4) 
          {
          elementy[0] = 1; 
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



    elementy[6] = Math.round( procent * data.dane[0].elementy / 100 );
    
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
        this.Testuj(numer, czaswykonania, ++procent, data, elementy, skok, nrtestu, uplyw)
          }, czaswykonania);          
    }
    else
    {
      this.tablicazawartosci[numer] = this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
      [
        this.funkcje.setNazwaLinia('',
                                  [
                                  //this.funkcje.setTextNazwa(' ', '99' ,'%',this.funkcje.getKolor().zalogowany,''),
                                  //this.funkcje.setTextNazwa('', (elementy[4]).toString(), '' ,this.funkcje.getKolor().zalogowany,''),
                                  //this.funkcje.setTextNazwa(' element nr: ', (<number>elementy[6]).toString(), '' ,this.funkcje.getKolor().zalogowany,'')
                                  this.funkcje.setTextNazwa('', ' kończę', '' ,this.funkcje.getKolor().zalogowany,'')
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
      this.testy.ZapiszTest(this.funkcje.getZalogowany().zalogowany, data.dane[0].idmodul, data.dane[0].id, data.dane[0].czasbadania, this.czasy.getCzasDedala(), numer, nrtestu)
    }

  }

  Wypelnij(start: number, ilosc: number, wiersze: any, licznik: number, data: any, rodzaj: string, nrtestu: number = 0)
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
        this.Wypelnij(start, ilosc, wiersze, ++licznik, data, rodzaj, nrtestu)
          }, 300);          
    }
    else
    switch (rodzaj) {
      case 'info': break;
      case 'testy': this.Testuj(start + 3, 0, 0, data, [1, ' - wysyłam zapytanie', ' - czekam', ' - odbieram',' - analizuję element', ( data.dane[0].elementy / 100), 1], 0, nrtestu, 0); break;
      case 'reset': this.testy.ResetStart(this.funkcje.getZalogowany().zalogowany, data.dane[0].idmodul, data.dane[0].id,start, data)
                   break;
      case 'naprawa': this.testy.NaprawaStart(this.funkcje.getZalogowany().zalogowany, data.dane[0].idmodul, data.dane[0].id,start, data)
                   break;                   
    } 
  }



Naprawa(data: any): Wiersze[]
  {
    let tablica: Wiersze[] = [];
    tablica = [...tablica, 
    this.StartPolecenie('naprawa'), 
    this.Zespol(data.dane[0]),  
    this.funkcje.setLiniaWiersz('', '', '' , '    Wykonuję: ', '',
      [
        this.funkcje.setNazwaLinia('',
                                  [
                                  //this.funkcje.setTextNazwa('', ' ' ,'',this.funkcje.getKolor().zalogowany,''),
                                  this.funkcje.setTextNazwa('', ' odczytuję dane zespołu', '' ,this.funkcje.getKolor().zalogowany,'')],
                                  '')
      ],
    ''), 
    this.funkcje.setLiniaWiersz('', '', '' , '-- koniec', '',
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



Reset(data: any): Wiersze[]
  {
    let tablica: Wiersze[] = [];
    tablica = [...tablica, 
    this.StartPolecenie('reset'), 
    this.Zespol(data.dane[0]),
    this.funkcje.setLiniaWiersz('', '', '' , '    Wykonuję: ', '',
      [
        this.funkcje.setNazwaLinia('',
                                  [
                                  //this.funkcje.setTextNazwa('', ' ' ,'',this.funkcje.getKolor().zalogowany,''),
                                  this.funkcje.setTextNazwa('', ' odczytuję dane zespołu', '' ,this.funkcje.getKolor().zalogowany,'')],
                                  '')
      ],
    ''), 
    this.funkcje.setLiniaWiersz('', '', '' , '-- koniec', '',
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



Test(data: any, nrtestu: number): Wiersze[]
  {
    let tablica: Wiersze[] = [];
    let czasstart = this.czasy.getCzasDedala();
    data.dane[0].czasbadania = czasstart;
    tablica = [...tablica, 
      this.StartPolecenie('test'), 
      this.Zespol(data.dane[0]),
      
      this.funkcje.setLiniaWiersz('', '', '' , '    Badanie start: ', '',
          [
            this.funkcje.setNazwaLinia('',
                                      [
                                      this.funkcje.setTextNazwa('', czasstart ,'',this.funkcje.getKolor().liniakomend,''),
                                      this.funkcje.setTextNazwa('', '    TEST nr: ' ,'','',''),
                                      this.funkcje.setTextNazwa('', nrtestu.toString(16) ,'',this.funkcje.getKolor().liniakomend,'')
                                      ],
                                      '')
          ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '    Badanie stop: ', '',
          [
            this.funkcje.setNazwaLinia('',
              [
              //this.funkcje.setTextNazwa(' ', '0' ,'%',this.funkcje.getKolor().zalogowany,''),
              //this.funkcje.setTextNazwa('', ' - wysyłam zapytanie', '' ,this.funkcje.getKolor().zalogowany,''),
              //this.funkcje.setTextNazwa(' element nr: ', '1', '' ,this.funkcje.getKolor().zalogowany,'')
              this.funkcje.setTextNazwa('', ' przygotowuję', '' ,this.funkcje.getKolor().zalogowany,'')
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
      this.funkcje.setLiniaWiersz('', '', '' , '-- koniec ', '',
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


FormatCzas(czassekund: number):string
  {
    let godziny = Math.trunc(czassekund / 3600);
    let minuty = Math.trunc((czassekund - godziny * 3600) / 60);
    let sekundy = Math.trunc(czassekund - godziny * 3600 - minuty * 60); 
    return (godziny != 0 ? godziny.toString() + 'h ' : '') + (minuty != 0 ? minuty.toString() + 'm ' : '') + (sekundy != 0 ? sekundy.toString() + ' s' : ''); 
  }


Informacja(data: any): Wiersze[]
  {
    let tablica: Wiersze[] = [];
      tablica = [...tablica, 
        this.StartPolecenie('zespół'), 
        this.ZespolI(data.dane[0]), 
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
                                      this.funkcje.setTextNazwa('', data.dane[0].stanText ,'',(data.dane[0].uszkodzeniailosc == 0 ? this.funkcje.getKolor().info : this.funkcje.getKolor().alert),'')
                                      ],
                                      '')
          ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '', '',
          [
            this.funkcje.setNazwaLinia('    Przybliżone czasy wykonania: ',
                                      [
                                        this.funkcje.setTextNazwa(' ', 'reset'  ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor'),  
                                        this.funkcje.setTextNazwa(' ~ ', this.FormatCzas(data.dane[0].czasreset), '', this.funkcje.getKolor().liniakomend,''),
                                        this.funkcje.setTextNazwa(' ', ',naprawa'  ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor'),  
                                        this.funkcje.setTextNazwa(' ~ ', this.FormatCzas(data.dane[0].czasnaprawa), '', this.funkcje.getKolor().liniakomend,''),
                                        this.funkcje.setTextNazwa('', ', test ważny: ' ,'','',''),
                                        this.funkcje.setTextNazwa('', data.dane[0].wazny ,'',this.funkcje.getKolor().liniakomend,''),
                                      ],
                                      '')
          ],
      ''),
      this.funkcje.setLiniaWiersz('', '', '' , '-- koniec', '',
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

  Pusta():Wiersze[]
  {
    return  [this.funkcje.setLiniaWiersz('', '', '' , '', '',[ this.funkcje.setNazwaLinia('', [this.funkcje.setTextNazwa('','',' ','','')],'')],'')]
  }
  
  Zespol(dane: any):Wiersze
  {
    return this.funkcje.setLiniaWiersz('', '', '' , '', '',
    [
      this.funkcje.setNazwaLinia('    ZESPÓŁ:   ',
                                [
                                this.funkcje.setTextNazwa('', dane.nazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                ],
                                ''),
      this.funkcje.setNazwaLinia('  (symbol: ',
                                [
                                this.funkcje.setTextNazwa('', dane.symbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                ],
                                ')'),
      this.funkcje.setNazwaLinia('    MODUŁ:   ',
                                [
                                this.funkcje.setTextNazwa('', dane.modulNazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                ],
                                ''),
      this.funkcje.setNazwaLinia('  (symbol: ',
                                [
                                this.funkcje.setTextNazwa('', dane.modulSymbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                ],
                                ')')                                                                                                       
    ],
    '')
  }
  
  ZespolI(dane: any):Wiersze
  {
    return this.funkcje.setLiniaWiersz('', '', '' , '', '',
    [
      this.funkcje.setNazwaLinia('    ZESPÓŁ:   ',
                                [
                                this.funkcje.setTextNazwa('', dane.nazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                ],
                                ''),
      this.funkcje.setNazwaLinia('  (symbol: ',
                                [
                                this.funkcje.setTextNazwa('', dane.symbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                ],
                                ')'),
      this.funkcje.setNazwaLinia('    MODUŁ:   ',
                                [
                                this.funkcje.setTextNazwa('', dane.modulNazwa ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                ],
                                ''),
      this.funkcje.setNazwaLinia('  (symbol: ',
                                [
                                this.funkcje.setTextNazwa('', dane.modulSymbol ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor')
                                ],
                                ')'),
      this.funkcje.setNazwaLinia('  (ilość elementów zespołu: ',
                                [
                                this.funkcje.setTextNazwa('', dane.elementy ,'',this.funkcje.getKolor().liniakomend,'liniakomend')
                                ],
                                ')')                                                                                                                    
    ],
    '')
  }



  StartPolecenie(polecenie: string):Wiersze
  {
    return this.funkcje.setLiniaWiersz('', '', '' , '-- start polecenie', '',
    [
      this.funkcje.setNazwaLinia('',
                                [
                                this.funkcje.setTextNazwa(' ', polecenie ,'',this.funkcje.getKolor().liniakomend,'liniakomend kursor'),
                                this.funkcje.setTextNazwa(' ', this.czasy.getCzasDedala() ,'', '','')
                                ],
                                '')
    ],
  '')
  }
  
  
}
