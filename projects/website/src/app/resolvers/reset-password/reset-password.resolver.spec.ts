import { TestBed } from '@angular/core/testing';

import { ResetPasswordResolver } from './reset-password.resolver';

describe('ResetPasswordResolver', () => {
  let resolver: ResetPasswordResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ResetPasswordResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
