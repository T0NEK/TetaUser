import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { Osoby } from '../definicje';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-uzytkownicy',
  templateUrl: './uzytkownicy.component.html',
  styleUrls: ['./uzytkownicy.component.css']
})
export class UzytkownicyComponent implements OnInit, OnDestroy 
{

  private osobysubscribe = new Subscription();
  private gosciesubscribe = new Subscription();
  tablicaosoby: Osoby[] = [];
  tablicagoscie: Osoby[] = [];
  zalogowany = true;

  constructor(private osoby: OsobyService, )
   {
    console.log('użytkownicy con')
     this.osobysubscribe = osoby.OdczytajOsoby$.subscribe
     ( data => { this.tablicaosoby = data; } )
    this.gosciesubscribe = osoby.OdczytajGoscie$.subscribe
     ( data => { this.tablicagoscie = data; } )
  }
 
   
  ngOnInit() 
  {
  
  }

  ngOnDestroy()
  {
   if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
   if(this.gosciesubscribe) { this.gosciesubscribe.unsubscribe()}   
  }

setZaloga(czynnosc: string, stan: boolean)
{
  this.osoby.zapisz_osoby_all( 5, czynnosc, stan);
//for (let index = 0; index < this.tablicaosoby.length; index++) { kto[index].zalogowany = stan; }
}

setGoscie(czynnosc: string, stan: boolean)
{
  this.osoby.zapisz_goscie_all( 5, czynnosc, stan);
}

setZalogaOne(czynnosc: string, kto: any, event: MatSlideToggleChange )
{
 this.osoby.zapisz_osoby( 5, czynnosc, kto, event.checked);
 //console.log('czynnosc: ',czynnosc, 'kto:', kto.id, '    to co= ',event.checked)
}

setGoscieOne(czynnosc: string, kto: any, event: MatSlideToggleChange )
{
 this.osoby.zapisz_goscie( 5, czynnosc, kto, event.checked);
}

}
