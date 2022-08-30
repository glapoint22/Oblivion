import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationUserProfilePopupComponent } from './notification-user-profile-popup.component';

describe('NotificationUserProfilePopupComponent', () => {
  let component: NotificationUserProfilePopupComponent;
  let fixture: ComponentFixture<NotificationUserProfilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationUserProfilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationUserProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
