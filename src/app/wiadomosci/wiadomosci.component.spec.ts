/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WiadomosciComponent } from './wiadomosci.component';

describe('WiadomosciComponent', () => {
  let component: WiadomosciComponent;
  let fixture: ComponentFixture<WiadomosciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiadomosciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiadomosciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
