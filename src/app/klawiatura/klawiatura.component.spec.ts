/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KlawiaturaComponent } from './klawiatura.component';

describe('KlawiaturaComponent', () => {
  let component: KlawiaturaComponent;
  let fixture: ComponentFixture<KlawiaturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KlawiaturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KlawiaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
