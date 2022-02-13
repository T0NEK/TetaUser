import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Polecenia } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { PetlaService } from '../petla.service';
import { PoleceniaService } from '../polecenia.service';

@Component({
  selector: 'app-linia-komend',
  templateUrl: './linia-komend.component.html',
  styleUrls: ['./linia-komend.component.css']
})
export class LiniaKomendComponent implements OnDestroy {


@ViewChild('liniaInput') liniaInput!: ElementRef;
private fokus_subscribe_lk = new Subscription();
private blokada_subscribe_lk = new Subscription();
private haslo_subscribe_lk = new Subscription();
private stan_polecen_subscribe_lk = new Subscription();
private add_subscribe_lk = new Subscription();
linia = '';
haslo = false;
private liniablokada = '';
blokada = true;
private stanpolecenia: Polecenia;
private pozycja = 0;
szerokoscInput: any;
maxLenght = 60;

constructor(private polecenia: PoleceniaService, private petla: PetlaService, private funkcje: FunkcjeWspolneService, private all: AppComponent, private changeDetectorRef: ChangeDetectorRef )
  {
    //console.log('con linia kom')
      this.stanpolecenia = {"nazwa": "", "czas": 500, "prefix": "", "komunikat": "", "sufix": "", "dzialanie": "bad", "autoryzacja": false, "polecenie": true, "nastepnyTrue": "brak", "nastepnyFalse": "brak"}
      this.szerokoscInput = all.szerokoscAll;     

      this.fokus_subscribe_lk = funkcje.LiniaDialogu$.subscribe 
          ( data => 
            { 
              //console.log('data ',data)
              if (typeof data === 'string')
              {
              data = data.substring(0, this.maxLenght - this.linia.length);  
              this.linia = this.linia.substring(0, this.pozycja) + data + this.linia.substring(this.pozycja);
              this.liniaInput.nativeElement.value = this.linia;
              this.pozycja = this.pozycja + data.length;
              }
              //this.linia = this.linia + (typeof data === 'string' ? data : '');
              //this.liniaInput.nativeElement.value = this.linia;
              //this.pozycja = this.linia.length; 
              (this.linia.length == 0 ? this.szerokoscInput = all.szerokoscAll : this.szerokoscInput = all.szerokoscInput)
              //this.WartoscLinia(this.linia + (typeof data === 'string' ? data : ''),true)
              this.liniaInput.nativeElement.setSelectionRange(this.pozycja, this.pozycja); 
              this.liniaInput.nativeElement.focus();
            } 
          );

      this.blokada_subscribe_lk = funkcje.LiniaDialoguBlokada$.subscribe 
          ( data => 
            {
//('blokuj',data);
//console.log('data ', data)
              this.blokada = data.stan;
              this.liniaInput.nativeElement.disabled = data.stan;
              if (data.stan)
              {
                this.linia = data.komunikat;
                this.liniaInput.nativeElement.value = data.komunikat;
                this.pozycja = data.pozycja;
                this.szerokoscInput = all.szerokoscAll;
              }
              else
              {
                this.linia = data.komunikat;
                this.liniaInput.nativeElement.value = data.komunikat;
                this.pozycja = data.pozycja;
                //this.WartoscLinia(data.komunikat, true);
                (this.linia.length == 0 ? this.szerokoscInput = all.szerokoscAll : this.szerokoscInput = all.szerokoscInput)
              }
              this.liniaInput.nativeElement.setSelectionRange(this.pozycja, this.pozycja);  
              this.liniaInput.nativeElement.focus();
            } );    

      this.stan_polecen_subscribe_lk = funkcje.LiniaDialoguStanPolecen$.subscribe 
            ( data => 
              { 
                //console.log('stan pole',data)
                this.stanpolecenia.nazwa = (typeof data.nastepnyTrue === 'string' ? data.nastepnyTrue : 'brak');
                this.stanpolecenia.czas = (typeof data.czas === 'string' ? data.czas : ' ');
                this.stanpolecenia.komunikat = (typeof data.komunikat === 'string' ? data.komunikat : ' ');
                this.stanpolecenia.dzialanie = (typeof data.dzialanie === 'string' ? data.dzialanie : ' ');
                this.stanpolecenia.autoryzacja = (typeof data.dzialanie === 'number' ? data.autoryzacja : 0);
                this.stanpolecenia.nastepnyTrue = (typeof data.nastepnyTrue === 'string' ? data.nastepnyTrue : 'brak');
                this.stanpolecenia.nastepnyFalse = (typeof data.nastepnyFalse === 'string' ? data.nastepnyFalse : 'brak');
                this.liniaInput.nativeElement.focus();
              } 
            );
  
      this.haslo_subscribe_lk = funkcje.LiniaDialoguStanHaslo$.subscribe 
            ( data => 
              { 
                this.haslo = ( data == 'on' ? true : false);
                this.liniaInput.nativeElement.focus();
              } 
            );
  

      this.add_subscribe_lk = funkcje.LiniaDialoguAddChar$.subscribe 
          ( data => 
            { 
              let nowyznak = this.DodajZnak(data);
              if (this.blokada)
              {
                this.liniablokada = nowyznak;
              }
              else
              {
                if (nowyznak.length <= this.maxLenght)
                {
                this.linia = nowyznak;
                this.liniaInput.nativeElement.value = nowyznak;
                (this.linia.length == 0 ? this.szerokoscInput = all.szerokoscAll : this.szerokoscInput = all.szerokoscInput)
                this.liniaInput.nativeElement.setSelectionRange(this.pozycja, this.pozycja); 
                }
                else
                {
                  this.ZaDlugiTekst(this.linia, this.pozycja) 
                }
              }
            this.liniaInput.nativeElement.focus();  
            } 
          );
  }
  
  ngOnDestroy()
  {
    this.fokus_subscribe_lk.unsubscribe();    
    this.blokada_subscribe_lk.unsubscribe();    
    this.haslo_subscribe_lk.unsubscribe();    
    this.stan_polecen_subscribe_lk.unsubscribe();    
    this.add_subscribe_lk.unsubscribe();    
  }

  ZaDlugiTekst(linia: string, pozycja: number)
  {
    this.funkcje.ZablokujLinieDialogu('max ' + this.maxLenght + ' znaków')
    setTimeout(() => { this.funkcje.OdblokujLinieDialogu(linia, pozycja) }, 600);
  }
  
  Zmiana(event: any)
  {
  /* 
    console.log('ZMIANA', event) 
    console.log('ZMIANA', event.key)
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
      case ' ': this.funkcje.LiniaDialoguChar('&space'); break;
      default:
        if (this.linia.length >= this.maxLenght)
        { 
          this.ZaDlugiTekst(this.linia, this.pozycja) 
        }
        else
        {        
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
        }
      break;
    }
 // this.liniaInput.nativeElement.selectionStart = this.pozycja;
  }

  
DodajString(tekst: string)
  {
    console.log(tekst)
    //let liniaI = tekst.length;
  }


/* (start) funkcje lini Input*/

//getStanPolecenia()
//{  return this.stanpolecenia }

WartoscLinia(linia: string, clear: boolean)
{
  //console.log('linia ', linia)
  this.linia = linia;
  this.liniaInput.nativeElement.value = linia;
  this.pozycja = linia.length;
  this.szerokoscInput = ( this.linia.length == 0 ?  this.all.szerokoscAll : this.szerokoscInput = this.all.szerokoscInput)
  this.szerokoscInput = ( clear ?  this.szerokoscInput : this.all.szerokoscAll)
  this.liniaInput.nativeElement.focus();
}

ClearLinia()
{
  this.linia = '';
  this.liniaInput.nativeElement.value = '';
  this.pozycja = 0;
  this.szerokoscInput = this.all.szerokoscAll;
  this.liniaInput.nativeElement.focus();
}  
/* (end) funkcje lini Input*/

/* (start) historia poleceń */
private linie = Array ();
private linie_wskaznik = 0;

DodajHistorie(linia: string)
{
  this.linie.push(linia);
  this.linie_wskaznik = this.linie.length;
  //console.log('historia ',this.linie,'    wskaznik',this.linie_wskaznik )
}
PokazHistorie(kierunek: number)
{
  this.linie_wskaznik = this.linie_wskaznik + kierunek;
  //console.log(this.linie_wskaznik)
  let linia = '';
  this.pozycja = 0;
    if ( this.linie_wskaznik < 0) 
    {
      this.funkcje.ZablokujLinieDialogu('koniec historii')
      this.linie_wskaznik = 0;
      if (this.linie.length > 0) { linia = this.linie[0]; } else { linia = ''}
      setTimeout(() => { this.funkcje.OdblokujLinieDialogu(linia, linia.length) }, 600);
    }
    else if ( this.linie_wskaznik < this.linie.length )  
    {
      linia = this.linie[this.linie_wskaznik];
      this.pozycja = linia.length;
    }
    else
    {
      this.linie_wskaznik = this.linie.length; 
    }
  return linia;    
}
/* (end) historia poleceń */

WybranoEnter(linia: string)
{
  let polecenie: any;
  if (this.haslo)
  {
    let ciag = '*';
    this.funkcje.addLiniaKomunikatuPolecenia(this.funkcje.getZalogowany().imie, ciag.repeat(linia.length));
  }
  else
  {
    this.funkcje.addLiniaKomunikatuPolecenia(this.funkcje.getZalogowany().imie,linia);
    this.DodajHistorie(linia);  
  }
  if (( this.stanpolecenia.nastepnyTrue == 'brak')||( this.stanpolecenia.nastepnyTrue == 'bad'))
  {
    polecenie = this.polecenia.sprawdzPolecenie(linia);
    setTimeout(() => {
            this.petla.poleceniaWykonaj(polecenie.dzialanie, '');
   //         this.funkcje.OdblokujLinieDialogu('');
    }, polecenie.czas);
  }
  else
  {
    setTimeout(() => {
      this.petla.poleceniaWykonaj(this.stanpolecenia.nastepnyTrue,linia);
      this.funkcje.UstawStanPolecenia('');
   //   this.funkcje.OdblokujLinieDialogu('');
    }, this.stanpolecenia.czas);
  }   
  
}


DodajZnak(znak: any)
  {
    let linia = this.linia;
//console.log('znak  ',znak)
    switch (znak) {
      case '&enter'     : if (linia.length != 0) 
                          { 
                            this.funkcje.ZablokujLinieDialogu('')
                            this.WybranoEnter(linia)
                            linia = ''; 
                            this.pozycja = 0;
                          }
                          break;
      case '&delall'    : linia = ''; this.pozycja = 0; break;
      case '&back'      : linia = linia.substring(0, this.pozycja-1) + linia.substring(this.pozycja);
                        (this.pozycja == 0 ? this.pozycja = 0 : this.pozycja--); 
                        break;
      case '&del'   :   linia = linia.substring(0, this.pozycja) + linia.substring(this.pozycja+1);
                        break;
      case '&bad'   :   linia = linia.substring(0, this.pozycja) + linia.substring(this.pozycja);
                        break;
      case 8593     :   linia = this.PokazHistorie(-1) //góra
                        break;
      case 8595     :   linia = this.PokazHistorie(1); //dół
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
    //console.log('linia ', linia,'       ', this.pozycja)
    //console.log('linia ', this.linia,'       ', this.liniablokada)
    return linia
  }

}
