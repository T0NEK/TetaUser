/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WiadomosciService } from './wiadomosci.service';

describe('Service: Wiadomosci', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WiadomosciService]
    });
  });

  it('should ...', inject([WiadomosciService], (service: WiadomosciService) => {
    expect(service).toBeTruthy();
  }));
});
