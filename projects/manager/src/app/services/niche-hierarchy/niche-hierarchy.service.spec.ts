import { TestBed } from '@angular/core/testing';

import { NicheHierarchyService } from './niche-hierarchy.service';

describe('NicheHierarchyService', () => {
  let service: NicheHierarchyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NicheHierarchyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
