import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountNotificationComponent } from './user-account-notification.component';

describe('UserAccountNotificationComponent', () => {
  let component: UserAccountNotificationComponent;
  let fixture: ComponentFixture<UserAccountNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
