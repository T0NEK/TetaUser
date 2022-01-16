import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';

@Component({
  selector: 'app-linia-komend',
  templateUrl: './linia-komend.component.html',
  styleUrls: ['./linia-komend.component.css']
})
export class LiniaKomendComponent implements OnDestroy {

liniaPolecen : String;
@ViewChild('liniaInput') liniaInput!: ElementRef;
private fokus_subscribe_lk = new Subscription();
private blokada_subscribe_lk = new Subscription();

constructor(private funkcje: FunkcjeWspolneService)
  {
      this.liniaPolecen = 'przetważam, czekaj';

      this.fokus_subscribe_lk = funkcje.LiniaDialogu$.subscribe 
          ( data => 
            { 
              this.liniaInput.nativeElement.focus()
            } 
          );

      this.blokada_subscribe_lk = funkcje.LiniaDialoguBlokada$.subscribe 
          ( data => 
            {
              this.liniaInput.nativeElement.disabled = data.stan;
              this.liniaInput.nativeElement.value = data.komunikat;
            } );    
  }

  ngOnDestroy()
  {
    this.fokus_subscribe_lk.unsubscribe();    
    this.blokada_subscribe_lk.unsubscribe();    
  }

}
