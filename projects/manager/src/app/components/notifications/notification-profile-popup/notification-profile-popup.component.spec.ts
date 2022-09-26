import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationProfilePopupComponent } from './notification-profile-popup.component';

describe('NotificationProfilePopupComponent', () => {
  let component: NotificationProfilePopupComponent;
  let fixture: ComponentFixture<NotificationProfilePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationProfilePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationProfilePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
