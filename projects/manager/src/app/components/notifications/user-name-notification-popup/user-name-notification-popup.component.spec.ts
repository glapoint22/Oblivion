import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNameNotificationPopupComponent } from './user-name-notification-popup.component';

describe('UserNameNotificationPopupComponent', () => {
  let component: UserNameNotificationPopupComponent;
  let fixture: ComponentFixture<UserNameNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNameNotificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNameNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
