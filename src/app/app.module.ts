import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCheckboxModule} from '@angular/material/checkbox'
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { InformacjeComponent } from './informacje/informacje.component';
import { NawigacjaComponent } from './nawigacja/nawigacja.component';
import { DialogComponent } from './dialog/dialog.component';
import { WiadomosciComponent } from './wiadomosci/wiadomosci.component';
import { NotatkiComponent } from './notatki/notatki.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogMiniComponent } from './dialog-mini/dialog-mini.component';
import { TestyComponent } from './testy/testy.component';
import { KlawiaturaComponent } from './klawiatura/klawiatura.component';
import { LiniaKomendComponent } from './linia-komend/linia-komend.component';
import { ZalogowaniUzytkownicyComponent } from './zalogowani-uzytkownicy/zalogowani-uzytkownicy.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PoleceniaComponent } from './polecenia/polecenia.component';

@NgModule({
  declarations: [																		
    AppComponent,
      InformacjeComponent,
      NawigacjaComponent,
      WiadomosciComponent,
      NotatkiComponent,
      DialogComponent,
      DialogMiniComponent,
      TestyComponent,
      KlawiaturaComponent,
      LiniaKomendComponent,
      ZalogowaniUzytkownicyComponent,
      PoleceniaComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ScrollingModule,
    MatCheckboxModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    CdkAccordionModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
