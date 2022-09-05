import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewNotificationPopupComponent } from './review-notification-popup.component';

describe('ReviewNotificationPopupComponent', () => {
  let component: ReviewNotificationPopupComponent;
  let fixture: ComponentFixture<ReviewNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewNotificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
