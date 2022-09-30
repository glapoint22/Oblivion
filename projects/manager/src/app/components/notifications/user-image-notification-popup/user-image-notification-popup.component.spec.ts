import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserImageNotificationPopupComponent } from './user-image-notification-popup.component';

describe('UserImageNotificationPopupComponent', () => {
  let component: UserImageNotificationPopupComponent;
  let fixture: ComponentFixture<UserImageNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserImageNotificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImageNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
