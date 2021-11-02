import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReviewPromptComponent } from './report-review-prompt.component';

describe('ReportReviewPromptComponent', () => {
  let component: ReportReviewPromptComponent;
  let fixture: ComponentFixture<ReportReviewPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportReviewPromptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportReviewPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
