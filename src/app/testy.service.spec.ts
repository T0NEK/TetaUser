/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TestyService } from './testy.service';

describe('Service: Testy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestyService]
    });
  });

  it('should ...', inject([TestyService], (service: TestyService) => {
    expect(service).toBeTruthy();
  }));
});
