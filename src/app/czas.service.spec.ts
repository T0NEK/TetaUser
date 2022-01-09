/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CzasService } from './czas.service';

describe('Service: Czas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CzasService]
    });
  });

  it('should ...', inject([CzasService], (service: CzasService) => {
    expect(service).toBeTruthy();
  }));
});
