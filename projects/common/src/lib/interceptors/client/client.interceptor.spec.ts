import { TestBed } from '@angular/core/testing';

import { ClientInterceptor } from './client.interceptor';

describe('ClientInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ClientInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ClientInterceptor = TestBed.inject(ClientInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
