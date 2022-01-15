import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CzasService } from '../czas.service';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';

//import * as $ from 'jquery';


@Component({
  selector: 'app-informacje',
  templateUrl: './informacje.component.html',
  styleUrls: ['./informacje.component.css']
})
export class InformacjeComponent implements OnInit, OnDestroy {

  
  private czas_startu_subscribe_i = new Subscription();
  private czas_startu_akcji_subscribe_i = new Subscription();
  private uplyw_dedala_subscribe_i = new Subscription()
  
  czas_na_dedalu: any;
  czas_od_startu_uplyw: any;
  czas_startu: any;
  
  constructor(private czasy: CzasService, private funkcje: FunkcjeWspolneService) 
  {
    //console.log(' constr informacje')
    
    this.czas_startu_subscribe_i = czasy.czasStartuDedal$.subscribe ( data => { this.czas_startu = data; } );
    this.czas_startu_akcji_subscribe_i = czasy.czasRzeczywistyDedala$.subscribe ( data => { this.czas_na_dedalu = data; } );
    this.uplyw_dedala_subscribe_i = czasy.czasDedalaUplyw$.subscribe ( data => { this.czas_od_startu_uplyw = data; } );

           
    
    //this.funkcje.addLiniaKomunikatu('uruchomiono czas rzeczywisty','');
  }

    ngOnInit() 
  {
  //console.log(this.stale.getCzasStartu());   
  //console.log(' OnInit informacje')
  }

  ngOnDestroy() 
  {
    this.czas_startu_subscribe_i.unsubscribe();    
    this.czas_startu_akcji_subscribe_i.unsubscribe();
    this.uplyw_dedala_subscribe_i.unsubscribe();
  }

  
  

}
