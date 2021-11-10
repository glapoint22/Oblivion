import { TestBed } from '@angular/core/testing';

import { NichesService } from './niches.service';

describe('NichesService', () => {
  let service: NichesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NichesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
