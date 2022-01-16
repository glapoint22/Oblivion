import { TestBed } from '@angular/core/testing';

import { GridWidgetSideMenuService } from './grid-widget-side-menu.service';

describe('GridWidgetSideMenuService', () => {
  let service: GridWidgetSideMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridWidgetSideMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
