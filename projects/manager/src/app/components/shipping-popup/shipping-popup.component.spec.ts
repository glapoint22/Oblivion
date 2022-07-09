import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPopupComponent } from './shipping-popup.component';

describe('ShippingPopupComponent', () => {
  let component: ShippingPopupComponent;
  let fixture: ComponentFixture<ShippingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
