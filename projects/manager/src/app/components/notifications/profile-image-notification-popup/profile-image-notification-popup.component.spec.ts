import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImageNotificationPopupComponent } from './profile-image-notification-popup.component';

describe('ProfileImageNotificationPopupComponent', () => {
  let component: ProfileImageNotificationPopupComponent;
  let fixture: ComponentFixture<ProfileImageNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileImageNotificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImageNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
