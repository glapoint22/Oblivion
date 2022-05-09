import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridWidgetDevComponent } from './grid-widget-dev.component';

describe('GridWidgetDevComponent', () => {
  let component: GridWidgetDevComponent;
  let fixture: ComponentFixture<GridWidgetDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridWidgetDevComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridWidgetDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
