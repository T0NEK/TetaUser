/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LiniaKomendComponent } from './linia-komend.component';

describe('LiniaKomendComponent', () => {
  let component: LiniaKomendComponent;
  let fixture: ComponentFixture<LiniaKomendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiniaKomendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiniaKomendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
