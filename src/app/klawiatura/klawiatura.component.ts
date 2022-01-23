import { Component, OnDestroy } from '@angular/core';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';

@Component({
  selector: 'app-klawiatura',
  templateUrl: './klawiatura.component.html',
  styleUrls: ['./klawiatura.component.css']
})
export class KlawiaturaComponent implements OnDestroy {

  klwcaps = false;
  klwalt = false;
  klwshift = false;
  shiftraz = false;
  klw11: any;
  klw11alt: any;
  klw12: any;
  klw12alt: any;
  klw12caps: any;
  klw21: any;
  klw21caps: any;
  klw22: any;
  klw22caps: any;
  zwloka_czas: any;
  zwloka = 500;
  //@Output() bufor = new EventEmitter<string>();
 
  constructor(private funkcje: FunkcjeWspolneService)
    {
      this.klw11 = funkcje.klw11;
      this.klw11alt = funkcje.klw11alt;
      this.klw12 = funkcje.klw12;
      this.klw12alt = funkcje.klw12alt;
      this.klw12caps = funkcje.klw12caps;
      this.klw21 = funkcje.klw21;
      this.klw21caps = funkcje.klw21caps;
      this.klw22 = funkcje.klw22;
      this.klw22caps = funkcje.klw22caps;    
    }
      
  ngOnDestroy()
  {
    
  }

  onNext(event: any)
  {
    if (this.zwloka_czas) { clearInterval(this.zwloka_czas)}
    this.zwloka_czas = setInterval(() => 
    {
      this.onAdd(event); 
      this.onNext(event);
    }, this.zwloka);
  }

  onFunNext(event: any)
  {
    if (this.zwloka_czas) { clearInterval(this.zwloka_czas)}
    this.zwloka_czas = setInterval(() => 
    {
      this.funkcje.LiniaDialoguChar(event)
      this.onFunNext(event);
    }, this.zwloka);
  }

  onStop()
  {
    if (this.zwloka_czas) { clearInterval(this.zwloka_czas)}
  }

  onAdd(event: any)
  {
    if ( event.target.innerHTML.charCodeAt(0) == 38)
    { this.onFun(event.target.innerHTML) }
    else
    { this.funkcje.LiniaDialoguChar(event.target.innerHTML.charCodeAt(0)); }
    if (this.shiftraz) {this.klwcaps = !this.klwcaps; this.klwshift = this.klwcaps; this.shiftraz = false};
    
  }
  
  onFun(event: any)
  {
    this.funkcje.LiniaDialoguChar(event);
  }
  

}
