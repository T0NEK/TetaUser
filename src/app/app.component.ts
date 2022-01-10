import { Component } from '@angular/core';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
  title = 'TetaAdmin';

  constructor(private funkcje: FunkcjeWspolneService)
  {

  }

  onClick(kto: string)
  {
    //console.log(kto);
    this.funkcje.fokusLiniaDialogu(kto)

  }
}
