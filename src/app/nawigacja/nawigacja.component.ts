import { Component, OnInit } from '@angular/core';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';


@Component({
  selector: 'app-nawigacja',
  templateUrl: './nawigacja.component.html',
  styleUrls: ['./nawigacja.component.css']
})
export class NawigacjaComponent implements OnInit {

  active: any = 1;
  
  constructor(private funkcje: FunkcjeWspolneService) 
  {
    
  }

  ngOnInit() 
  {
   // console.log('nawigacja')
  }
 
  Changed(event: any)
  {
    this.funkcje.setzakladkadialogu(event)
  }
}
