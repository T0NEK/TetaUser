/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UstawieniaStartLarpaComponent } from './ustawienia-start-larpa.component';

describe('UstawieniaStartLarpaComponent', () => {
  let component: UstawieniaStartLarpaComponent;
  let fixture: ComponentFixture<UstawieniaStartLarpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UstawieniaStartLarpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UstawieniaStartLarpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
