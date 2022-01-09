/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';

describe('Service: FunkcjeWspolne', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FunkcjeWspolneService]
    });
  });

  it('should ...', inject([FunkcjeWspolneService], (service: FunkcjeWspolneService) => {
    expect(service).toBeTruthy();
  }));
});
