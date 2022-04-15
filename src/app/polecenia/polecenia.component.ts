import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component,  OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CzasService } from '../czas.service';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service'; 
import { Wiersze } from '../definicje';
import { AppComponent } from '../app.component';
import { DedalService } from '../dedal.service';

@Component({
  selector: 'app-polecenia',
  templateUrl: './polecenia.component.html',
  styleUrls: ['./polecenia.component.css']
})
export class PoleceniaComponent implements OnInit {

    private tablicazawartoscisubscribe = new Subscription();
    tablicazawartosci: Wiersze[] = [];  
    @ViewChild('scrollViewportPolecenia') VSVPolecenia!: CdkVirtualScrollViewport;
    private zakladkasubscribe = new Subscription();
    checked = true;
    height: any;
    width1: any;
  
    
  
      
    //@Input() : any;
    //@Output() raport = new EventEmitter<string>();
    
    constructor(private hostElement: ElementRef, private czasy: CzasService, private funkcje: FunkcjeWspolneService, private changeDetectorRef: ChangeDetectorRef, private all: AppComponent, private dedal: DedalService) 
    {
      //this.height = (all.wysokoscAll - all.wysokoscInfo - all.wysokoscKlw - all.wysokoscLinia - all.wysokoscDialogMin - all.wysokoscPrzewijaj - 100) + 'px';
      this.height = (all.wysokoscNawigacja - all.wysokoscPrzewijaj - all.wysokoscNawigacjaNag ) + 'px';
      this.width1 = (all.szerokoscAll - all.szerokoscZalogowani - 10) + 'px';
      //console.log (all.wysokoscAll,'    ',all.wysokoscInfo,'    ',all.wysokoscKlw,'    ',all.wysokoscLinia,'    ',all.wysokoscDialogMin,'    ',all.wysokoscPrzewijaj)
      //console.log('konstruktor dialog')
      //console.log(this.VSVDialog._totalContentHeight);
      this.zakladkasubscribe = funkcje.LiniaKomunikatu$.subscribe
      (
         data =>
         {
            if (data == 5) { if (this.checked) { this.Przewin()} }
  
         }
      )
      
      this.tablicazawartoscisubscribe = dedal.PoleceniaDedala$.subscribe
      ( data => 
        { 
          if (data.clear)
          {
            this.tablicazawartosci = [];
            changeDetectorRef.detectChanges();
            this.VSVPolecenia.checkViewportSize()
          }
          else
          {
          let wiersze = this.funkcje.addLiniaKomunikatuFormat(this.czasy.getCzasDedala(), '', data.osoba, '>' ,' ', 
                            [this.funkcje.setNazwaLinia("", [this.funkcje.setTextNazwa("", data.komunikat, "", "", "")], "")],
                             '', all.szerokoscNawigacja - 20)
          for (let index = 0; index < wiersze.length; index++) 
          {
            //console.log('wiersz ',index,' = ',wiersze[index])
            this.tablicazawartosci = [...this.tablicazawartosci, wiersze[index]]; 
            
          }
          if (this.checked) { this.Przewin() }
          }
        }
      );
         
    }
    
    onClick(kto: string)
    {// dla przewijaj
     //   this.funkcje.fokusLiniaPoleceniau('');
    }
  
    Przewijaj()
    {   
      if ((!this.checked)) { this.Przewin() }
    }
  
    Przewin()
    {
      let count = this.VSVPolecenia.getDataLength();
      this.changeDetectorRef.detectChanges();
      this.VSVPolecenia.checkViewportSize()
      this.VSVPolecenia.scrollToIndex((count), 'smooth'); 
    }
  
  
    ngOnInit() 
    {
      //console.log('onInit Polecenia') 
    }
    
    ngAfterViewInit()
    {
    //console.log('AV Polecenia')
      //this.tablicazawartosci = this.funkcje.getLiniePoleceniau(); 
      this.changeDetectorRef.detectChanges();
      this.VSVPolecenia.checkViewportSize()
    } 
  
    ngOnDestroy()
    {
    //console.log('dest dialog')
    if(this.tablicazawartoscisubscribe) {this.tablicazawartoscisubscribe.unsubscribe()};
    if(this.zakladkasubscribe) {this.zakladkasubscribe.unsubscribe()};
    }
  
  
    
  }
  