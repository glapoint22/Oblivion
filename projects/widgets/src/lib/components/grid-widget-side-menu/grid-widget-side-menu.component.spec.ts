import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridWidgetSideMenuComponent } from './grid-widget-side-menu.component';

describe('GridWidgetSideMenuComponent', () => {
  let component: GridWidgetSideMenuComponent;
  let fixture: ComponentFixture<GridWidgetSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridWidgetSideMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridWidgetSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
