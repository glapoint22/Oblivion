import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpfulReviewsComponent } from './helpful-reviews.component';

describe('HelpfulReviewsComponent', () => {
  let component: HelpfulReviewsComponent;
  let fixture: ComponentFixture<HelpfulReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpfulReviewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpfulReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
