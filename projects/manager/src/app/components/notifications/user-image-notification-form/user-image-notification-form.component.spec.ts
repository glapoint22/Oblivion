import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserImageNotificationFormComponent } from './user-image-notification-form.component';

describe('UserImageNotificationFormComponent', () => {
  let component: UserImageNotificationFormComponent;
  let fixture: ComponentFixture<UserImageNotificationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserImageNotificationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImageNotificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
