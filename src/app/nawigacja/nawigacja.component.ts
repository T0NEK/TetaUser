import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-nawigacja',
  templateUrl: './nawigacja.component.html',
  styleUrls: ['./nawigacja.component.css']
})
export class NawigacjaComponent implements OnInit {

  active: any = 3;
  
  constructor() 
  {
    
  }

  ngOnInit() 
  {
   // console.log('nawigacja')
  }
 
  Changed(event: any)
  {
    //this.komunikacja.changePrzelaczZakladka(event)
  }
}
