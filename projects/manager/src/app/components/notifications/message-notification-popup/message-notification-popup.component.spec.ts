import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageNotificationPopupComponent } from './message-notification-popup.component';

describe('MessageNotificationPopupComponent', () => {
  let component: MessageNotificationPopupComponent;
  let fixture: ComponentFixture<MessageNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageNotificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
