/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PoleceniaService } from './polecenia.service';

describe('Service: Polecenia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoleceniaService]
    });
  });

  it('should ...', inject([PoleceniaService], (service: PoleceniaService) => {
    expect(service).toBeTruthy();
  }));
});
