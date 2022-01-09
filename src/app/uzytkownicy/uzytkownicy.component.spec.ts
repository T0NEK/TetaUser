/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UzytkownicyComponent } from './uzytkownicy.component';

describe('UzytkownicyComponent', () => {
  let component: UzytkownicyComponent;
  let fixture: ComponentFixture<UzytkownicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UzytkownicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UzytkownicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
