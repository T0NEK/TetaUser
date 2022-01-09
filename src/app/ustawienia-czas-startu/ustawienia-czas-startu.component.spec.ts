/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UstawieniaCzasStartuComponent } from './ustawienia-czas-startu.component';

describe('UstawieniaCzasStartuComponent', () => {
  let component: UstawieniaCzasStartuComponent;
  let fixture: ComponentFixture<UstawieniaCzasStartuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UstawieniaCzasStartuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UstawieniaCzasStartuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
