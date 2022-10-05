import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountNotificationFormComponent } from './user-account-notification-form.component';

describe('UserAccountNotificationFormComponent', () => {
  let component: UserAccountNotificationFormComponent;
  let fixture: ComponentFixture<UserAccountNotificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountNotificationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountNotificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
