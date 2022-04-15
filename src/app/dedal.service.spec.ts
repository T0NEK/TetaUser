/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DedalService } from './dedal.service';

describe('Service: Dedal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DedalService]
    });
  });

  it('should ...', inject([DedalService], (service: DedalService) => {
    expect(service).toBeTruthy();
  }));
});
