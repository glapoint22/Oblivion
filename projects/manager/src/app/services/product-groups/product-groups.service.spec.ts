import { TestBed } from '@angular/core/testing';

import { ProductGroupsService } from './product-groups.service';

describe('ProductGroupsService', () => {
  let service: ProductGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
