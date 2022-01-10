import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';

@Component({
  selector: 'app-linia-komend',
  templateUrl: './linia-komend.component.html',
  styleUrls: ['./linia-komend.component.css']
})
export class LiniaKomendComponent implements OnInit {

liniaPolecen : String;
@ViewChild('liniaInput') liniaInput!: ElementRef;
private fokus_subscribe_lk = new Subscription();

constructor(private funkcje: FunkcjeWspolneService)
  {
      this.liniaPolecen = 'przetważam, czekaj';
      this.fokus_subscribe_lk = funkcje.LiniaDialogu$.subscribe 
          ( data => 
            { 
              this.liniaPolecen = data;
              const  element = this.liniaInput.nativeElement; 
              //console.log('kto: ',data, '   element: ',element);
              if(element) { element.focus()}
            } 
          );

    
  }

  ngOnInit() 
  {
    
  }

}
