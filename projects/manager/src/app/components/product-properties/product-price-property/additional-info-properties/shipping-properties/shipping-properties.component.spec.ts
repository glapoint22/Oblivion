import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingPropertiesComponent } from './shipping-properties.component';

describe('ShippingPropertiesComponent', () => {
  let component: ShippingPropertiesComponent;
  let fixture: ComponentFixture<ShippingPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
