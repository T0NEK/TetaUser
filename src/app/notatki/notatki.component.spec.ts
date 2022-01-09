/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NotatkiComponent } from './notatki.component';

describe('NotatkiComponent', () => {
  let component: NotatkiComponent;
  let fixture: ComponentFixture<NotatkiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotatkiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotatkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
