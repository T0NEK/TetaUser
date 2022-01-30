import { Injectable, OnDestroy } from '@angular/core';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({ providedIn: 'root'})


export class PetlaService implements OnDestroy {




constructor(private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService)
{
  
  
              
}



ngOnDestroy()
{
   
}


Petla()
{
    
}



}


