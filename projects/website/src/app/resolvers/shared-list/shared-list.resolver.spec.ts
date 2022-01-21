import { TestBed } from '@angular/core/testing';

import { SharedListResolver } from './shared-list.resolver';

describe('SharedListResolver', () => {
  let resolver: SharedListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SharedListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
