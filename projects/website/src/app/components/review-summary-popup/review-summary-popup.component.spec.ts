import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSummaryPopupComponent } from './review-summary-popup.component';

describe('ReviewSummaryPopupComponent', () => {
  let component: ReviewSummaryPopupComponent;
  let fixture: ComponentFixture<ReviewSummaryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewSummaryPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSummaryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
