import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';

@Component({
  selector: 'app-linia-komend',
  templateUrl: './linia-komend.component.html',
  styleUrls: ['./linia-komend.component.css']
})
export class LiniaKomendComponent implements OnDestroy {


@ViewChild('liniaInput') liniaInput!: ElementRef;
private fokus_subscribe_lk = new Subscription();
private blokada_subscribe_lk = new Subscription();
private add_subscribe_lk = new Subscription();
linia = '';
private liniablokada = '';
blokada = true;
private pozycja = 0;
private linie = Array ();
private linie_wskaznik = 0;
szerokoscInput: any;

constructor(private funkcje: FunkcjeWspolneService, private all: AppComponent, private changeDetectorRef: ChangeDetectorRef )
  {
    console.log('con linia kom')
      this.szerokoscInput = all.szerokoscAll;     
      this.fokus_subscribe_lk = funkcje.LiniaDialogu$.subscribe 
          ( data => 
            { 
              this.liniaInput.nativeElement.focus();
            } 
          );

      this.blokada_subscribe_lk = funkcje.LiniaDialoguBlokada$.subscribe 
          ( data => 
            {
              console.log(data);
              if (data.stan)
              {
                this.liniablokada = this.liniaInput.nativeElement.value;
                this.linia = data.komunikat + '2';
                this.liniaInput.nativeElement.value = data.komunikat + '3';
                changeDetectorRef.detectChanges();
                this.szerokoscInput = all.szerokoscAll;
                this.blokada = data.stan;
               // this.liniaInput.nativeElement.disabled = data.stan;
                }
              else
              {
                this.liniaInput.nativeElement.value = this.liniablokada;
                this.linia = this.liniablokada;
                this.liniablokada = '';
                (this.linia.length == 0 ? this.szerokoscInput = all.szerokoscAll : this.szerokoscInput = all.szerokoscInput)
                this.blokada = data.stan;
                this.liniaInput.nativeElement.disabled = data.stan;
                }
              this.liniaInput.nativeElement.focus();
            } );    

      this.add_subscribe_lk = funkcje.LiniaDialoguAddChar$.subscribe 
          ( data => 
            { 
              this.linia = this.DodajZnak(data);
              this.liniaInput.nativeElement.value = this.linia;
              (this.linia.length == 0 ? this.szerokoscInput = all.szerokoscAll : this.szerokoscInput = all.szerokoscInput)
              this.liniaInput.nativeElement.setSelectionRange(this.pozycja, this.pozycja); 
              this.liniaInput.nativeElement.focus();
            } 
          );
  }
  
  ngOnDestroy()
  {
    this.fokus_subscribe_lk.unsubscribe();    
    this.blokada_subscribe_lk.unsubscribe();    
    this.add_subscribe_lk.unsubscribe();    
  }


  Zmiana(event: any)
  {
  /* 
    console.log('ZMIANA', event) 
    console.log('pozycje', this.pozycja )
    console.log('pozycjeS', this.liniaInput.nativeElement.selectionStart )
    console.log('pozycjeE', this.liniaInput.nativeElement.selectionEnd )
    console.log('pozycje', this.liniaInput.nativeElement.value )
  */    
    switch (event.key) {
      case 'ArrowRight': if ( Math.abs(this.liniaInput.nativeElement.selectionEnd - this.pozycja) == 1)
                          { this.funkcje.LiniaDialoguChar(8594); }
                          else
                          { let tekst = this.liniaInput.nativeElement.value.substring(this.pozycja, this.liniaInput.nativeElement.selectionEnd);
                            for (let index = 0; index < tekst.length; index++) 
                            { this.funkcje.LiniaDialoguChar(8594); }
                          }
                          break;
      case 'ArrowLeft': if ( Math.abs(this.liniaInput.nativeElement.selectionStart - this.pozycja) == 1)
                        { this.funkcje.LiniaDialoguChar(8592); }
                        else
                        { let tekst = this.liniaInput.nativeElement.value.substring(this.pozycja, this.liniaInput.nativeElement.selectionStart);
                          for (let index = 0; index < tekst.length; index++) 
                          { this.funkcje.LiniaDialoguChar(8592); }
                        }
                        break;
      case 'ArrowUp':   this.funkcje.LiniaDialoguChar(8593); break;
      case 'Home':      this.funkcje.LiniaDialoguChar(8593); break;
      case 'ArrowDown': this.funkcje.LiniaDialoguChar(8595); break;
      case 'End':       this.funkcje.LiniaDialoguChar(8595); break;
      case 'Backspace': if ( Math.abs(this.liniaInput.nativeElement.selectionStart - this.pozycja) == 1)
                        { this.funkcje.LiniaDialoguChar('&back'); }
                        else
                        { let tekst = this.linia.substring(this.liniaInput.nativeElement.selectionStart, this.pozycja);
                          for (let index = 0; index < tekst.length; index++) 
                          { this.funkcje.LiniaDialoguChar('&back'); }
                        }
                        break;
      case 'Delete':    let ile = this.linia.length - this.liniaInput.nativeElement.value.length;
                        if ( ile == 1)
                        { this.funkcje.LiniaDialoguChar('&del'); }
                        else
                        { 
                          for (let index = 0; index < ile; index++) 
                          { this.funkcje.LiniaDialoguChar('&del'); }
                        }
                        break;
      case 'Enter': this.funkcje.LiniaDialoguChar('&enter'); break;
      default:
        if (event.key.length == 1 )
        { 
          if ( Math.abs(this.liniaInput.nativeElement.selectionStart - this.pozycja) == 1)
          {
            this.funkcje.LiniaDialoguChar(event.key.charCodeAt(0)); 
          }  
          else
          {
          let tekst = this.liniaInput.nativeElement.value.substring(this.pozycja, this.liniaInput.nativeElement.selectionStart);
          for (let index = 0; index < tekst.length; index++) 
          {
            this.funkcje.LiniaDialoguChar(tekst[index].charCodeAt(0));
          }  
          }          
        }
        else
        { this.DodajString(event.key) }
      break;
    }
 // this.liniaInput.nativeElement.selectionStart = this.pozycja;
  }

  
DodajString(tekst: string)
  {
    console.log(tekst)
    //let liniaI = tekst.length;
  }


/* */
ClearLinia()
{
 this.linia = '';
 this.liniaInput.nativeElement.value = this.linia;
 this.pozycja = 0;
 this.szerokoscInput = this.all.szerokoscAll;     
}  
/* */

WybranoEnter(linia: string)
{
  this.linie.push(linia);
  this.funkcje.addLiniaKomunikatu(linia,'');
  this.funkcje.ZablokujLinieDialogu('')
}


DodajZnak(znak: any)
  {
    let linia = this.linia;
//console.log('znak  ',znak)
    switch (znak) {
      case '&enter'     : if (linia.length != 0) 
                          { 
                            this.linie.push(linia);
                            this.funkcje.addLiniaKomunikatu(linia,'');
                            linia = '4'; 
                            this.pozycja = 0;
                            this.funkcje.ZablokujLinieDialogu('linia')
                            
                          }
                          break;
      case '&delall'    : linia = ''; this.pozycja = 0; break;
      case '&back'      : linia = linia.substring(0, this.pozycja-1) + linia.substring(this.pozycja);
                        (this.pozycja == 0 ? this.pozycja = 0 : this.pozycja--); 
                        break;
      case '&del'   :   linia = linia.substring(0, this.pozycja) + linia.substring(this.pozycja+1);
      console.log('del ',linia)
                        break;
      case '&bad'   :   linia = linia.substring(0, this.pozycja) + linia.substring(this.pozycja);
                        break;
      case 8593     :   this.pozycja = 0; //góra
                        break;
      case 8595     :   this.pozycja = linia.length; //dół
                        break;
      case 8592     :   (this.pozycja == 0 ? this.pozycja = 0 : this.pozycja--); //w lewo
                        break;
      case 8594     :   (this.pozycja == linia.length ? this.pozycja = linia.length : this.pozycja++); //w prawo
                        break;
      case '&amp;'   :  linia = linia.substring(0, this.pozycja) + '&' + linia.substring(this.pozycja);
                        (this.pozycja == linia.length ? this.pozycja = linia.length : this.pozycja++);
                        break;
      case '&lt;'    :  linia = linia.substring(0, this.pozycja) + '<' + linia.substring(this.pozycja);
                        (this.pozycja == linia.length ? this.pozycja = linia.length : this.pozycja++);
                        break;
      case '&rt;'    :  linia = linia.substring(0, this.pozycja) + '>' + linia.substring(this.pozycja);
                        (this.pozycja == linia.length ? this.pozycja = linia.length : this.pozycja++);
                        break;
      case '&space' :   linia = linia.substring(0, this.pozycja) + ' ' + linia.substring(this.pozycja);
                        (this.pozycja == linia.length ? this.pozycja = linia.length : this.pozycja++);
                        break;
      default       :   linia = linia.substring(0, this.pozycja) + String.fromCharCode(znak) + linia.substring(this.pozycja);
                        (this.pozycja == linia.length ? this.pozycja = linia.length : this.pozycja++);
                        break;
    }
  //  console.log('linia ', linia,'       ', this.pozycja)
    return linia
  }

  
}
