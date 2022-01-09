/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KomunikacjaService } from './komunikacja.service';

describe('Service: Komunikacja', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KomunikacjaService]
    });
  });

  it('should ...', inject([KomunikacjaService], (service: KomunikacjaService) => {
    expect(service).toBeTruthy();
  }));
});
