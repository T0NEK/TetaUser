/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UstawieniaCzasNaDedaluComponent } from './ustawienia-czas-na-dedalu.component';

describe('UstawieniaCzasNaDedaluComponent', () => {
  let component: UstawieniaCzasNaDedaluComponent;
  let fixture: ComponentFixture<UstawieniaCzasNaDedaluComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UstawieniaCzasNaDedaluComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UstawieniaCzasNaDedaluComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
