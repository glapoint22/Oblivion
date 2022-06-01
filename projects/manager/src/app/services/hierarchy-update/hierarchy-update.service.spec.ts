import { TestBed } from '@angular/core/testing';

import { HierarchyUpdateService } from './hierarchy-update.service';

describe('HierarchyUpdateService', () => {
  let service: HierarchyUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HierarchyUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});