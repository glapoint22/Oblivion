import { TestBed } from '@angular/core/testing';

import { ListIdResolver } from './list-id.resolver';

describe('ListIdResolver', () => {
  let resolver: ListIdResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ListIdResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
