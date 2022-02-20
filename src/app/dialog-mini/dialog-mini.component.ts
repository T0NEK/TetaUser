import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Wiersze } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-dialog-mini',
  templateUrl: './dialog-mini.component.html',
  styleUrls: ['./dialog-mini.component.css']
})
export class DialogMiniComponent implements OnInit {

  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Wiersze [] = [];  
  @ViewChild('scrollViewportUstawienia') VSVUstawienia!: CdkVirtualScrollViewport;
  height: any;


  constructor(private all: AppComponent, private funkcje: FunkcjeWspolneService,private changeDetectorRef: ChangeDetectorRef)
  {
    this.height = all.wysokoscDialogMin + 'px';
       this.tablicazawartoscisubscribe = funkcje.LiniaKomunikatu$.subscribe
    ( data => 
      { 
        this.tablicazawartosci = funkcje.getLinieDialogu(); 
        let count = this.VSVUstawienia.getDataLength()
        changeDetectorRef.detectChanges();
        this.VSVUstawienia.scrollToIndex((count), 'smooth')
      }
    );  
  }

  ngOnInit() {
  }
  ngAfterViewInit()
  {
    this.tablicazawartosci = this.funkcje.getLinieDialogu(); 
    this.changeDetectorRef.detectChanges();
  } 

  ngOnDestroy()
  {
    this.tablicazawartoscisubscribe.unsubscribe();
  }
}
