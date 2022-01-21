import { TestBed } from '@angular/core/testing';

import { BrowseResolver } from './browse.resolver';

describe('BrowseResolver', () => {
  let resolver: BrowseResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(BrowseResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
