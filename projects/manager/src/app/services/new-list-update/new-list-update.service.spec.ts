import { TestBed } from '@angular/core/testing';

import { NewListUpdateService } from './new-list-update.service';

describe('NewListUpdateService', () => {
  let service: NewListUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewListUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
