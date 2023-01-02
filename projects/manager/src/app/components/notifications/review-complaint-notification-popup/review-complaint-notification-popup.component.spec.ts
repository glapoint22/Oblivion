import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewComplaintNotificationPopupComponent } from './review-complaint-notification-popup.component';

describe('ReviewComplaintNotificationPopupComponent', () => {
  let component: ReviewComplaintNotificationPopupComponent;
  let fixture: ComponentFixture<ReviewComplaintNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewComplaintNotificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComplaintNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
