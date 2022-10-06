import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNotificationPopupComponent } from './error-notification-popup.component';

describe('ErrorNotificationPopupComponent', () => {
  let component: ErrorNotificationPopupComponent;
  let fixture: ComponentFixture<ErrorNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorNotificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
