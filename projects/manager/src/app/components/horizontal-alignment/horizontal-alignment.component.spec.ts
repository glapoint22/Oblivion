import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalAlignmentComponent } from './horizontal-alignment.component';

describe('HorizontalAlignmentComponent', () => {
  let component: HorizontalAlignmentComponent;
  let fixture: ComponentFixture<HorizontalAlignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HorizontalAlignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalAlignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
