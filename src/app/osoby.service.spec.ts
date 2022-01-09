/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OsobyService } from './osoby.service';

describe('Service: Osoby', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OsobyService]
    });
  });

  it('should ...', inject([OsobyService], (service: OsobyService) => {
    expect(service).toBeTruthy();
  }));
});
