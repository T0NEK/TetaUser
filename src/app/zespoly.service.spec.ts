/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ZespolyService } from './zespoly.service';

describe('Service: Zespoly', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZespolyService]
    });
  });

  it('should ...', inject([ZespolyService], (service: ZespolyService) => {
    expect(service).toBeTruthy();
  }));
});
