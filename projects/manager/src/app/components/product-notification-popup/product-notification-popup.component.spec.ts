import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNotificationPopupComponent } from './product-notification-popup.component';

describe('ProductNotificationPopupComponent', () => {
  let component: ProductNotificationPopupComponent;
  let fixture: ComponentFixture<ProductNotificationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductNotificationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
