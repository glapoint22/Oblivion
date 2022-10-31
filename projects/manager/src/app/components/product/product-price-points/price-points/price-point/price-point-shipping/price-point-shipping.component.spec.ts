import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePointShippingComponent } from './price-point-shipping.component';

describe('PricePointShippingComponent', () => {
  let component: PricePointShippingComponent;
  let fixture: ComponentFixture<PricePointShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePointShippingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePointShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
