/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotatkiService } from './notatki.service';

describe('Service: Notatki', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotatkiService]
    });
  });

  it('should ...', inject([NotatkiService], (service: NotatkiService) => {
    expect(service).toBeTruthy();
  }));
});
