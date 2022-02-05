/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ModulyService } from './moduly.service';

describe('Service: Moduly', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModulyService]
    });
  });

  it('should ...', inject([ModulyService], (service: ModulyService) => {
    expect(service).toBeTruthy();
  }));
});
