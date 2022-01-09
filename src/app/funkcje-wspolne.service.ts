import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Wiersze } from './definicje';

@Injectable({
  providedIn: 'root'
})
export class FunkcjeWspolneService {

constructor()
 {

 }


/* (start) dodanie lini komunikatu */
private linieDialogu: Wiersze[] = [];
  
getLinieDialogu() { return this.linieDialogu }
addLinieDialogu(linia: any) 
  {
   this.linieDialogu = [...this.linieDialogu, linia];   
  }

private LiniaKomunikatu = new Subject<any>();
LiniaKomunikatu$ = this.LiniaKomunikatu.asObservable();
addLiniaKomunikatu(linia: string, kolor: string)
{
  let wiersz = {'data':(moment()).format('YYYY-MM-DD HH:mm:ss'), 'name': 'dedal', 'kolor': kolor, 'tekst': linia}
  this.addLinieDialogu(wiersz)
  this.LiniaKomunikatu.next(wiersz);
}
/* (end) dodanie lini komunikatu */ 
}
