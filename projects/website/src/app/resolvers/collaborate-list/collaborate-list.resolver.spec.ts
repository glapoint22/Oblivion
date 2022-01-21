import { TestBed } from '@angular/core/testing';

import { CollaborateListResolver } from './collaborate-list.resolver';

describe('CollaborateListResolver', () => {
  let resolver: CollaborateListResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CollaborateListResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
