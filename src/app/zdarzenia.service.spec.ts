/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ZdarzeniaService } from './zdarzenia.service';

describe('Service: Zdarzenia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZdarzeniaService]
    });
  });

  it('should ...', inject([ZdarzeniaService], (service: ZdarzeniaService) => {
    expect(service).toBeTruthy();
  }));
});
