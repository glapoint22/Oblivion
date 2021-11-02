import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReviewFormComponent } from './report-review-form.component';

describe('ReportReviewFormComponent', () => {
  let component: ReportReviewFormComponent;
  let fixture: ComponentFixture<ReportReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportReviewFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
