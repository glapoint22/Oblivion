import { TestBed } from '@angular/core/testing';

import { EmailPreferencesResolver } from './email-preferences.resolver';

describe('EmailPreferencesResolver', () => {
  let resolver: EmailPreferencesResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(EmailPreferencesResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
