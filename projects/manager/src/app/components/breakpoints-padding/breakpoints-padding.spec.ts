import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakpointsPaddingComponent } from './breakpoints-padding';

describe('PaddingComponent', () => {
  let component: BreakpointsPaddingComponent;
  let fixture: ComponentFixture<BreakpointsPaddingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakpointsPaddingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakpointsPaddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
