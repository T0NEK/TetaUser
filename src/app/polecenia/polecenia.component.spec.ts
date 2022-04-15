/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PoleceniaComponent } from './polecenia.component';

describe('PoleceniaComponent', () => {
  let component: PoleceniaComponent;
  let fixture: ComponentFixture<PoleceniaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoleceniaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoleceniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
