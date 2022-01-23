/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ZalogowaniUzytkownicyComponent } from './zalogowani-uzytkownicy.component';

describe('ZalogowaniUzytkownicyComponent', () => {
  let component: ZalogowaniUzytkownicyComponent;
  let fixture: ComponentFixture<ZalogowaniUzytkownicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZalogowaniUzytkownicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZalogowaniUzytkownicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
