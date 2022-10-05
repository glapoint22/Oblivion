import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountNotificationPopupComponent } from './user-account-notification-popup.component';

describe('UserAccountNotificationPopupComponent', () => {
  let component: UserAccountNotificationPopupComponent;
  let fixture: ComponentFixture<UserAccountNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountNotificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
