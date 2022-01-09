/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NawigacjaComponent } from './nawigacja.component';

describe('NawigacjaComponent', () => {
  let component: NawigacjaComponent;
  let fixture: ComponentFixture<NawigacjaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NawigacjaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NawigacjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
