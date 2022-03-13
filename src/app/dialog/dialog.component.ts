import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component,  OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CzasService } from '../czas.service';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service'; 
import { Wiersze } from '../definicje';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  //changeDetection : ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {

  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Wiersze[] = [];  
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
    this.height = (all.wysokoscNawigacja - all.wysokoscDialogMin ) + 'px';
    this.width1 = (all.szerokoscAll - all.szerokoscZalogowani - 10) + 'px';
    //console.log (all.wysokoscAll,'    ',all.wysokoscInfo,'    ',all.wysokoscKlw,'    ',all.wysokoscLinia,'    ',all.wysokoscDialogMin,'    ',all.wysokoscPrzewijaj)
    //console.log('konstruktor dialog')
    //console.log(this.VSVDialog._totalContentHeight);
    this.zakladkasubscribe = funkcje.ZakladkaDialogu$.subscribe
    (
       data =>
       {
          if (data == 1) { if (this.checked) { this.Przewin()} }

       }
    )
    this.tablicazawartoscisubscribe = funkcje.LiniaKomunikatu$.subscribe
    ( data => 
      { 
        if (data.clear)
        {
          this.tablicazawartosci = [];
          changeDetectorRef.detectChanges();
          this.VSVDialog.checkViewportSize()
        }
        else
        {
        let wiersze = this.funkcje.addLiniaKomunikatuFormat(data.przed, data.name, data.po ,data.prefix, data.linia, data.sufix, all.szerokoscNawigacja - 20)
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
  if(this.tablicazawartoscisubscribe) {this.tablicazawartoscisubscribe.unsubscribe()};
  if(this.zakladkasubscribe) {this.zakladkasubscribe.unsubscribe()};
  }

  
}
