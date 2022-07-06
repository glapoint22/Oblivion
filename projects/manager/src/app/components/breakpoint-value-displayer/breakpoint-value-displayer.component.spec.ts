import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakpointValueDisplayerComponent } from './breakpoint-value-displayer.component';

describe('BreakpointValueDisplayerComponent', () => {
  let component: BreakpointValueDisplayerComponent;
  let fixture: ComponentFixture<BreakpointValueDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakpointValueDisplayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakpointValueDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
