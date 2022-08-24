import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakpointsHorizontalAlignmentComponent } from './breakpoints-horizontal-alignment';

describe('HorizontalAlignmentComponent', () => {
  let component: BreakpointsHorizontalAlignmentComponent;
  let fixture: ComponentFixture<BreakpointsHorizontalAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakpointsHorizontalAlignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakpointsHorizontalAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
