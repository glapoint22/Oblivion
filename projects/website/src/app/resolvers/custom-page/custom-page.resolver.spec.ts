import { TestBed } from '@angular/core/testing';

import { CustomPageResolver } from './custom-page.resolver';

describe('CustomPageResolver', () => {
  let resolver: CustomPageResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CustomPageResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
