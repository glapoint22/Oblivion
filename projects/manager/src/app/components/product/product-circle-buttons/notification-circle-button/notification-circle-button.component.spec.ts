import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCircleButtonComponent } from './notification-circle-button.component';

describe('NotificationCircleButtonComponent', () => {
  let component: NotificationCircleButtonComponent;
  let fixture: ComponentFixture<NotificationCircleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationCircleButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationCircleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
