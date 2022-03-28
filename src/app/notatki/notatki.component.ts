import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { NotatkiService } from '../notatki.service';

@Component({
  selector: 'app-notatki',
  templateUrl: './notatki.component.html',
  styleUrls: ['./notatki.component.css'],
  providers: [
    { provide: Window, useValue: window }],
  host: {
  //  "(window:resize)":"onWindowResize($event)",
    "(click)":"onClick($event)",
  //  "(window:keypress)":"onKeyDown($event)"
  }  
})
export class NotatkiComponent implements OnDestroy {

  @ViewChild('PoleNotatki') PoleNotatki!: ElementRef;
//  @HostListener('click',['$event']) onClick2(event: any) { this.onClick(event) }
//  @HostListener('keyup.tab',['$event']) onClick3(event: any) { this.onKeyUp(event) }
 private fokus_subscribe_no = new Subscription();
 private notatkaTresc_subscribe_no = new Subscription();
 private notatkaEdytuj_subscribe_no = new Subscription();
 height: any;
 notatkaTytul: string;
 //notatka: Tresc[] = [];
 notatkaEdycja: boolean;
 notatkaEdytowana: string;
 //wersja: number;
 notatkaLenght: any;



constructor(private funkcje: FunkcjeWspolneService, private all: AppComponent, private notatki: NotatkiService)
  {
    this.height = (all.wysokoscNawigacja - all.wysokoscNawigacjaNag - 80 ) + 'px';
    this.notatkaTytul = 'Wczytaj notatkę';
    this.notatkaEdycja = false;
    this.notatkaEdytowana = 'inherit';
    this.notatkaLenght = {"obecna": 0, "max": 1024};


    this.fokus_subscribe_no = funkcje.PoleNotatki$.subscribe 
    ( data =>
      { 
        this.PoleNotatki.nativeElement.focus();
      } 
    );

    this.notatkaEdytuj_subscribe_no = notatki.NotatkaEdytuj$.subscribe 
    ( data =>
      { 
        this.notatkaEdycja = data;
        this.PoleNotatki.nativeElement.style.cursor = (data ? 'auto' : 'crosshair');
        //this.PoleNotatki.nativeElement.focus();
      } 
    );


    this.notatkaTresc_subscribe_no = notatki.OdczytajTresc$.subscribe 
    ( data =>
      { 
        if (this.notatki.getNotatkaCzyWczytana())
        {
        if (data.notatka[1*data.wersja].stan)
        {  
        this.notatkaTytul = 'Notatka: ' + this.notatki.getNotatkaTytul() + '   (id: ' + this.notatki.getNotatkaIdentyfikator() + ' ver: ' + this.notatki.getNotatkaWersja() + ')';
        this.PoleNotatki.nativeElement.value = this.notatki.getNotatkaTresc();
        this.notatkaLenght.obecna = this.PoleNotatki.nativeElement.value.length;
        this.notatkaEdytowana = (this.notatki.getNotatkaZmiana() ? 'red' : 'inherit')
        }
        else
        {
        this.notatkaTytul = 'Notatka: ' + this.notatki.getNotatkaTytul() + '   (id: ' + this.notatki.getNotatkaIdentyfikator() + ' ver: ' + this.notatki.getNotatkaWersja() + ')';          
        this.PoleNotatki.nativeElement.value = '';
        this.notatkaEdycja = false;
        this.notatkaEdytowana = 'inherit';
        this.notatkaLenght = {"obecna": 0, "max": 1024};
        this.funkcje.addLiniaKomunikatuInfo(funkcje.getDedal(),'notatk w ver: ' + data.notatka[data.wersja].wersja + ' jest: ' + data.notatka[data.wersja].stanText );
        }
        }
        else
        {
          this.notatkaTytul = 'Wczytaj notatkę';
          this.PoleNotatki.nativeElement.value = '';
          this.notatkaEdycja = false;
          this.notatkaEdytowana = 'inherit';
          this.notatkaLenght = {"obecna": 0, "max": 1024};
        }
      } 
    );
  }

  ngOnDestroy()
  {
    this.fokus_subscribe_no.unsubscribe();    
    this.notatkaTresc_subscribe_no.unsubscribe();    
    this.notatkaEdytuj_subscribe_no.unsubscribe();    
  }

  Zmiana()
  {
    this.funkcje.ZablokujLinieDialogu({"liniaL": "", "liniaP": ""})
    this.notatkaLenght.obecna = this.PoleNotatki.nativeElement.value.length;
    this.notatki.setNotatkaZmiana(this.PoleNotatki.nativeElement.value != this.notatki.getNotatkaTresc());
    this.notatkaEdytowana = (this.notatki.getNotatkaZmiana() ? ( (this.notatkaLenght.obecna >= this.PoleNotatki.nativeElement.value.length) ? 'red' : 'blueviolet') : 'inherit')
    this.notatki.setNotatkaTrescNew(this.PoleNotatki.nativeElement.value);
  }

  Fokus(event: boolean)
  {
    console.log(this.notatki.getNotatkaCzyEdycja())
    console.log(event)
   if (this.notatki.getNotatkaCzyEdycja())
   { 
    if (event) 
    { this.funkcje.ZablokujLinieDialogu({"liniaL": "", "liniaP": ""}) }
    else
    { this.funkcje.OdblokujLinieDialogu({"liniaL": "", "liniaP": ""}) }
   } 
  }

  onClick(kto: any)
  {
    //console.log('app   ',kto);
    //console.log(this.PoleNotatki.nativeElement.value)
    //console.log(kto.target);
    //console.log('>',kto.target.innerText,'<');
    //console.log(kto.target.className);
}

  onKeyUp(kto: any)
  {
    //console.log('app2   ',kto);
    //console.log(kto.target);
    //console.log('>',kto.target.innerText,'<');
    //console.log(kto.target.className);
  }


}
