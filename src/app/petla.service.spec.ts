/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PetlaService } from './petla.service';

describe('Service: Petla', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PetlaService]
    });
  });

  it('should ...', inject([PetlaService], (service: PetlaService) => {
    expect(service).toBeTruthy();
  }));
});
