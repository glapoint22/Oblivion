import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakpointsVerticalAlignmentComponent } from './breakpoints-vertical-alignment';

describe('VerticalAlignmentComponent', () => {
  let component: BreakpointsVerticalAlignmentComponent;
  let fixture: ComponentFixture<BreakpointsVerticalAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakpointsVerticalAlignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakpointsVerticalAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
